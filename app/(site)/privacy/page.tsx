import type { Metadata } from "next";
import { LegalPage } from "@/components/kv/LegalPage";
import { getCompany } from "@/lib/content";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Kalulu Vision collects, uses and protects personal information submitted through this website.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const c = await getCompany();
  return (
    <LegalPage
      title="Privacy Policy"
      updated="21 November 2026"
      intro={<p>This policy explains what personal information {c.name} collects through this website, why, and how it is handled. We collect only what we need to respond to you and to run our services.</p>}
      sections={[
        { id: "collect", title: "Information we collect", body: <>
          <p>We only collect information you choose to send us:</p>
          <ul>
            <li><strong>Contact, partnership and opportunity forms:</strong> your name, email address, organisation (if given), the subject or opportunity you select, any link you add, and your message.</li>
            <li><strong>Newsletter sign-up:</strong> your email address.</li>
            <li><strong>Tech Lessons enrolment:</strong> your name, phone number, email (if given), the course and plan you choose, and the payment reference you provide so we can verify your payment.</li>
          </ul>
        </> },
        { id: "use", title: "How we use it", body: <ul>
          <li>To reply to your enquiry or application.</li>
          <li>To send occasional updates if you subscribed (you can ask us to stop at any time).</li>
          <li>To verify payments and give enrolled learners access to their course.</li>
        </ul> },
        { id: "storage", title: "Storage and security", body: <p>Submissions are stored in a secured database used only to operate this website. Access is limited to authorised administrators who sign in with individual accounts. We do not sell or rent your information, and we do not share it with third parties except where needed to provide the service (for example our hosting provider) or where required by law.</p> },
        { id: "cookies", title: "Cookies and local storage", body: <p>The public website does not use advertising or tracking cookies. Your colour theme choice (light, dark or system) is saved in your browser&apos;s local storage on your device only. Administrators receive a secure session cookie when they sign in.</p> },
        { id: "retention", title: "How long we keep it", body: <p>We keep enquiries for as long as needed to deal with them and for reasonable follow-up, and enrolment and payment records as long as required for our records. You can ask us to delete your information at any time.</p> },
        { id: "rights", title: "Your choices", body: <p>You may ask to see, correct or delete the personal information we hold about you, or to unsubscribe from updates, by emailing {c.email ? <a href={`mailto:${c.email}`}>{c.email}</a> : "us"}.</p> },
        { id: "changes", title: "Changes to this policy", body: <p>We may update this policy as our services change. The date at the top shows when it was last revised.</p> },
      ]}
    />
  );
}
