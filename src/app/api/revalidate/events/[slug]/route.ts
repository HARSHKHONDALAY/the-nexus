import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Revalidate the specific event page
    revalidatePath(`/events/${slug}`);
    revalidatePath("/events"); // Also revalidate events listing
    revalidatePath("/"); // Also revalidate homepage for featured events
    
    return NextResponse.json({ 
      success: true, 
      message: `Event page "${slug}" revalidated successfully`,
      revalidated: [`/events/${slug}`, "/events", "/"]
    });
  } catch (error) {
    console.error("Failed to revalidate event page:", error);
    return NextResponse.json(
      { success: false, message: "Failed to revalidate event page" },
      { status: 500 }
    );
  }
}
