"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/content/projects", label: "Projects" },
  { href: "/admin/content/products", label: "Products" },
  { href: "/admin/content/services", label: "Services" },
  { href: "/admin/content/posts", label: "Articles & research" },
  { href: "/admin/content/opportunities", label: "Opportunities" },
  { href: "/admin/media", label: "Media library" },
  { href: "/admin/settings", label: "Company info" },
  { href: "/admin/training", label: "Tech Lessons" },
  { href: "/admin/account", label: "Account" },
];

export function Shell({ email, newEnquiries, children }: { email: string; newEnquiries: number; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const active = (h: string) => (h === "/admin" ? pathname === "/admin" : pathname.startsWith(h));

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const nav = (
    <nav aria-label="Admin">
      <ul className="grid gap-0.5">
        {NAV.map((n) => (
          <li key={n.href}>
            <Link href={n.href} onClick={() => setOpen(false)} aria-current={active(n.href) ? "page" : undefined}
              className={`flex min-h-10 items-center justify-between rounded-lg px-3 text-sm font-medium transition-colors ${active(n.href) ? "bg-orange-50 text-orange-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
              {n.label}
              {n.href === "/admin/enquiries" && newEnquiries > 0 && <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">{newEnquiries}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <div className="kv-admin min-h-dvh bg-slate-50 text-slate-900" style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="admin-nav" className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm font-medium">Menu</button>
        <span className="font-semibold">Kalulu Vision admin</span>
      </header>
      <div className="flex">
        <aside id="admin-nav" className={`${open ? "block" : "hidden"} fixed inset-0 top-14 z-20 overflow-y-auto border-r border-slate-200 bg-white p-4 lg:sticky lg:top-0 lg:block lg:h-dvh lg:w-64 lg:shrink-0`}>
          <Link href="/admin" className="mb-6 hidden items-center gap-3 px-2 lg:flex">
            <Image src="/brand/logo-96.webp" alt="" width={36} height={36} />
            <span className="font-semibold leading-tight">Kalulu Vision<span className="block text-xs font-normal text-slate-500">Admin</span></span>
          </Link>
          {nav}
          <div className="mt-6 grid gap-2 border-t border-slate-200 pt-4 text-sm">
            <div className="px-1 pb-2"><ThemeSwitcher compact /></div>
            <Link href="/" target="_blank" className="min-h-10 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">View website ↗</Link>
            <p className="truncate px-3 text-xs text-slate-500" title={email}>{email}</p>
            <button type="button" onClick={logout} className="min-h-10 rounded-lg px-3 text-left font-medium text-red-700 hover:bg-red-50">Sign out</button>
          </div>
        </aside>
        <main id="main" className="min-w-0 flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
