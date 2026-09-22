import { isAdminAuthenticated } from "@/lib/auth";
import { getAllEnrollmentRecords } from "@/lib/db";

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return Response.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  const records = await getAllEnrollmentRecords();
  return Response.json({ success: true, data: records });
}
