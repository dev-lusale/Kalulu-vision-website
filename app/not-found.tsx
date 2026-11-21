import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <Image src="/brand/logo-256.webp" alt="" width={120} height={120} className="mx-auto size-28 " />
        <p className="mt-8 font-display text-sm font-semibold tracking-[0.2em] text-accent-ink">404</p>
        <h1 className="mt-3 text-[clamp(2rem,1.5rem+2.5vw,3.4rem)] font-bold">Even kalulu can&apos;t find this page.</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">The link may be old, or the page may have moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex min-h-12 items-center rounded-lg bg-primary px-6 font-display font-semibold text-on-primary">Go to the homepage</Link>
          <Link href="/contact" className="inline-flex min-h-12 items-center rounded-lg border border-line-strong px-6 font-display font-semibold hover:border-primary">Contact us</Link>
        </div>
      </div>
    </main>
  );
}
