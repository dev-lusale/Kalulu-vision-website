import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getAllEnrollmentRecords } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function TrainingAdminPage() {
  const records = await getAllEnrollmentRecords();
  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold">Tech Lessons</h1>
      <p className="mb-6 text-sm text-slate-500">Enrollments, payment verification and subscriptions.</p>
      <div className="-mx-4 overflow-hidden rounded-2xl border border-slate-200 sm:mx-0"><AdminDashboard initialRecords={records} embedded /></div>
    </div>
  );
}
