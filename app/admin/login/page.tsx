import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const authed = await isAdminAuthenticated();
  if (authed) redirect("/admin");

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 dot-bg overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Radial blue glow top-right */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-20%", right: "-15%",
          width: "50vw", height: "50vw",
          background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 65%)",
        }}
      />
      {/* Radial cyan glow bottom-left */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-15%", left: "-10%",
          width: "40vw", height: "40vw",
          background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10 w-full max-w-sm">
        <AdminLoginForm />
      </div>
    </div>
  );
}
