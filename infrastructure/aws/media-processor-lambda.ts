import { S3Event, S3Handler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);
const s3 = new S3();

interface ProcessResult {
  success: boolean;
  optimizedSize?: number;
  originalSize?: number;
  formats?: string[];
}

export const handler: S3Handler = async (event: S3Event): Promise<void> => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
    
    // Skip processing for already optimized files
    if (key.includes('/optimized/') || key.includes('/thumbnails/')) {
      continue;
    }

    try {
      console.log(`Processing file: s3://${bucket}/${key}`);
      
      // Download the file
      const params = { Bucket: bucket, Key: key };
      const fileObject = await s3.getObject(params).promise();
      const originalSize = fileObject.ContentLength || 0;
      
      // Determine file type and process accordingly
      const extension = path.extname(key).toLowerCase();
      let result: ProcessResult;
      
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(extension)) {
        result = await processImage(fileObject.Body as Buffer, key, bucket);
      } else if (['.mov', '.mp4', '.avi'].includes(extension)) {
        result = await processVideo(fileObject.Body as Buffer, key, bucket);
      } else {
        console.log(`Skipping unsupported file type: ${extension}`);
        continue;
      }

      console.log(`Processing complete for ${key}:`, {
        originalSize: `${(originalSize / 1024 / 1024).toFixed(2)}MB`,
        optimizedSize: result.optimizedSize ? `${(result.optimizedSize / 1024 / 1024).toFixed(2)}MB` : 'N/A',
        compressionRatio: result.optimizedSize ? `${((1 - result.optimizedSize / originalSize) * 100).toFixed(1)}%` : 'N/A',
        formats: result.formats
      });

    } catch (error) {
      console.error(`Error processing file ${key}:`, error);
      // Continue processing other files even if one fails
    }
  }
};

async function processImage(buffer: Buffer, originalKey: string, bucket: string): Promise<ProcessResult> {
  const tempDir = '/tmp/media-processing';
  const inputPath = path.join(tempDir, `input-${Date.now()}`);
  const baseName = path.basename(originalKey, path.extname(originalKey));
  const dirName = path.dirname(originalKey);
  
  // Ensure temp directory exists
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Write input file
  fs.writeFileSync(inputPath, buffer);
  
  const results: ProcessResult = {
    success: true,
    originalSize: buffer.length,
    formats: []
  };

  try {
    // Generate WebP version
    const webpPath = path.join(tempDir, `${baseName}.webp`);
    await execAsync(`cwebp -q 85 "${inputPath}" -o "${webpPath}"`);
    
    const webpBuffer = fs.readFileSync(webpPath);
    await s3.putObject({
      Bucket: bucket,
      Key: `${dirName}/optimized/${baseName}.webp`,
      Body: webpBuffer,
      ContentType: 'image/webp',
      CacheControl: 'max-age=31536000, immutable'
    }).promise();
    
    results.formats?.push('webp');
    if (!results.optimizedSize || webpBuffer.length < results.optimizedSize) {
      results.optimizedSize = webpBuffer.length;
    }

    // Generate AVIF version (if supported)
    try {
      const avifPath = path.join(tempDir, `${baseName}.avif`);
      await execAsync(`cavif -q 50 "${inputPath}" -o "${avifPath}"`);
      
      const avifBuffer = fs.readFileSync(avifPath);
      await s3.putObject({
        Bucket: bucket,
        Key: `${dirName}/optimized/${baseName}.avif`,
        Body: avifBuffer,
        ContentType: 'image/avif',
        CacheControl: 'max-age=31536000, immutable'
      }).promise();
      
      results.formats?.push('avif');
      if (!results.optimizedSize || avifBuffer.length < results.optimizedSize) {
        results.optimizedSize = avifBuffer.length;
      }
    } catch (avifError) {
      console.log(`AVIF conversion failed for ${originalKey}:`, avifError);
    }

    // Generate thumbnail
    const thumbnailPath = path.join(tempDir, `${baseName}-thumb.jpg`);
    await execAsync(`convert "${inputPath}" -thumbnail 300x300^ -gravity center -extent 300x300 "${thumbnailPath}"`);
    
    const thumbnailBuffer = fs.readFileSync(thumbnailPath);
    await s3.putObject({
      Bucket: bucket,
      Key: `${dirName}/thumbnails/${baseName}.jpg`,
      Body: thumbnailBuffer,
      ContentType: 'image/jpeg',
      CacheControl: 'max-age=31536000, immutable'
    }).promise();

    results.formats?.push('thumbnail');

  } catch (error) {
    console.error(`Image processing failed for ${originalKey}:`, error);
    results.success = false;
  } finally {
    // Cleanup temp files
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error('Cleanup failed:', cleanupError);
    }
  }

  return results;
}

async function processVideo(buffer: Buffer, originalKey: string, bucket: string): Promise<ProcessResult> {
  const tempDir = '/tmp/media-processing';
  const inputPath = path.join(tempDir, `input-${Date.now()}`);
  const baseName = path.basename(originalKey, path.extname(originalKey));
  const dirName = path.dirname(originalKey);
  
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  fs.writeFileSync(inputPath, buffer);
  
  const results: ProcessResult = {
    success: true,
    originalSize: buffer.length,
    formats: []
  };

  try {
    // Convert to optimized MP4
    const mp4Path = path.join(tempDir, `${baseName}.mp4`);
    await execAsync(`ffmpeg -i "${inputPath}" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k -movflags +faststart "${mp4Path}"`);
    
    const mp4Buffer = fs.readFileSync(mp4Path);
    await s3.putObject({
      Bucket: bucket,
      Key: `${dirName}/optimized/${baseName}.mp4`,
      Body: mp4Buffer,
      ContentType: 'video/mp4',
      CacheControl: 'max-age=31536000, immutable'
    }).promise();
    
    results.formats?.push('mp4');
    results.optimizedSize = mp4Buffer.length;

    // Generate HLS stream for adaptive streaming
    const hlsDir = path.join(tempDir, 'hls');
    fs.mkdirSync(hlsDir, { recursive: true });
    
    await execAsync(`ffmpeg -i "${inputPath}" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k -f hls -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${hlsDir}/segment%03d.ts" "${hlsDir}/playlist.m3u8"`);
    
    // Upload HLS playlist
    const playlistBuffer = fs.readFileSync(path.join(hlsDir, 'playlist.m3u8'));
    await s3.putObject({
      Bucket: bucket,
      Key: `${dirName}/hls/${baseName}.m3u8`,
      Body: playlistBuffer,
      ContentType: 'application/vnd.apple.mpegurl',
      CacheControl: 'max-age=31536000, immutable'
    }).promise();
    
    // Upload HLS segments
    const segmentFiles = fs.readdirSync(hlsDir).filter(f => f.endsWith('.ts'));
    for (const segment of segmentFiles) {
      const segmentBuffer = fs.readFileSync(path.join(hlsDir, segment));
      await s3.putObject({
        Bucket: bucket,
        Key: `${dirName}/hls/${segment}`,
        Body: segmentBuffer,
        ContentType: 'video/MP2T',
        CacheControl: 'max-age=31536000, immutable'
      }).promise();
    }
    
    results.formats?.push('hls');

    // Generate video thumbnail
    const thumbnailPath = path.join(tempDir, `${baseName}-thumb.jpg`);
    await execAsync(`ffmpeg -i "${inputPath}" -ss 00:00:01 -vframes 1 -vf "scale=300:300:force_original_aspect_ratio=increase,crop=300:300" "${thumbnailPath}"`);
    
    const thumbnailBuffer = fs.readFileSync(thumbnailPath);
    await s3.putObject({
      Bucket: bucket,
      Key: `${dirName}/thumbnails/${baseName}.jpg`,
      Body: thumbnailBuffer,
      ContentType: 'image/jpeg',
      CacheControl: 'max-age=31536000, immutable'
    }).promise();

    results.formats?.push('thumbnail');

  } catch (error) {
    console.error(`Video processing failed for ${originalKey}:`, error);
    results.success = false;
  } finally {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error('Cleanup failed:', cleanupError);
    }
  }

  return results;
}
