import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Health Check Endpoint
 * GET /api/health
 * 
 * Returns the health status of all services
 * Used by monitoring tools (Vercel, uptime monitors)
 */
export async function GET() {
  const checks = {
    status: "healthy" as "healthy" | "degraded" | "unhealthy",
    timestamp: new Date().toISOString(),
    services: {
      database: false,
      auth: false,
    },
  };

  try {
    const supabase = await createClient();

    // Check database connectivity
    const { error: dbError } = await supabase
      .from("users_profile") // Replace with any table that exists
      .select("id")
      .limit(1);
    checks.services.database = !dbError;

    // Check auth service
    const { error: authError } = await supabase.auth.getSession();
    checks.services.auth = !authError;

    // Determine overall status
    const allHealthy = Object.values(checks.services).every(Boolean);
    checks.status = allHealthy ? "healthy" : "degraded";

    return NextResponse.json(checks, { 
      status: allHealthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ...checks, status: "unhealthy", error: String(error) },
      { status: 503 }
    );
  }
}
