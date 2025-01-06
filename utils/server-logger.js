import { createClient } from "@/utils/supabase/server";

export async function logServerEvent(
  type,
  event,
  userId = null,
  metadata = {}
) {
  try {
    const supabase = await createClient();

    const data = {
      timestamp: new Date(),
      level: "INFO",
      category: type,
      message: `Server Event: ${event}`,
      environment: process.env.NODE_ENV || "development",
      user_id: userId,
      metadata,
    };

    const { error } = await supabase.from("logs").insert(data);

    if (error) {
      console.error("[ServerLogger] Error inserting log:", error);
    }
  } catch (error) {
    console.error("[ServerLogger] Error:", error);
  }
}
