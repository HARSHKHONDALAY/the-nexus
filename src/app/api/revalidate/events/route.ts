import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST() {
  try {
    // Revalidate all event-related paths
    revalidatePath("/");
    revalidatePath("/events");
    
    // Also revalidate sitemap
    revalidatePath("/sitemap.xml");
    
    return NextResponse.json({ 
      success: true, 
      message: "Event pages revalidated successfully",
      revalidated: ["/", "/events", "/sitemap.xml"]
    });
  } catch (error) {
    console.error("Failed to revalidate event pages:", error);
    return NextResponse.json(
      { success: false, message: "Failed to revalidate event pages" },
      { status: 500 }
    );
  }
}
