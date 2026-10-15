import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function LoginPage() {
  const authed = await isAdminAuthenticated();
  if (authed) redirect("/admin");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 16px",
        background: "#F5F6F2",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative lime circle top-right */}
      <div style={{
        position: "absolute", top: "-10%", right: "-8%",
        width: "40vw", height: "40vw", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(233,255,163,0.6) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      {/* Teal circle bottom-left */}
      <div style={{
        position: "absolute", bottom: "-8%", left: "-6%",
        width: "30vw", height: "30vw", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(6,63,58,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "400px" }}>
        <AdminLoginForm />
      </div>
    </div>
  );
}
