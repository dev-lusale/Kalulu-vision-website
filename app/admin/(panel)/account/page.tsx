import { AccountForm } from "@/components/cms/AccountForm";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const s = await getAdminSession();
  return <AccountForm email={s?.email ?? ""} />;
}
