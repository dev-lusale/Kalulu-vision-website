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
        minHeight:       "100vh",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        padding:         "20px 16px",
        background:      "#070b14",
        position:        "relative",
        overflow:        "hidden",
      }}
    >
      {/* Dot background */}
      <div
        style={{
          position:        "absolute",
          inset:           0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize:  "28px 28px",
          pointerEvents:   "none",
          zIndex:          0,
        }}
      />
      {/* Glow top-right */}
      <div
        style={{
          position:   "absolute",
          top:        "-15%",
          right:      "-10%",
          width:      "50vw",
          height:     "50vw",
          background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 65%)",
          pointerEvents: "none",
          borderRadius: "50%",
          zIndex:     0,
        }}
      />
      {/* Glow bottom-left */}
      <div
        style={{
          position:   "absolute",
          bottom:     "-10%",
          left:       "-8%",
          width:      "40vw",
          height:     "40vw",
          background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
          borderRadius: "50%",
          zIndex:     0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "380px" }}>
        <AdminLoginForm />
      </div>
    </div>
  );
}
