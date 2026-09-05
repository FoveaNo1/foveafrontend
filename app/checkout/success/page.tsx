import Link from "next/link";
import Image from "next/image";
import CheckoutSuccessActions from "../../../components/CheckoutSuccessActions";
import SiteFooter from "../../../components/SiteFooter";

export const metadata = { robots: { index: false, follow: false } };

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string | string[] }> }) {
  const params = await searchParams;
  const raw = params.session_id;
  const sessionId = typeof raw === "string" && /^cs_(live|test)_[A-Za-z0-9_]+$/.test(raw) && raw.length <= 255 ? raw : null;
  return (
    <main className="min-h-screen bg-[#F7F8F4] px-5 py-5 text-[#111315] selection:bg-[#12B886]/20 selection:text-[#111315] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-40px)] max-w-4xl flex-col">
        <header className="flex items-center justify-between gap-4 rounded-2xl border border-[#DDE4DC] bg-white/85 px-4 py-3 shadow-[0_10px_30px_rgba(17,19,21,0.05)] backdrop-blur">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/fovea-logo.png"
              alt="Fovea"
              width={36}
              height={36}
              className="rounded-xl"
            />
            <span className="text-sm font-semibold text-[#111315]">Fovea</span>
          </Link>
          <Link
            href="/download"
            className="text-sm font-medium text-[#5E6861] transition hover:text-[#111315]"
          >
            Download
          </Link>
        </header>

        <section className="flex flex-1 items-center justify-center py-20">
          <div className="max-w-xl rounded-[28px] border border-[#DDE4DC] bg-white p-8 text-center shadow-[0_24px_70px_rgba(37,48,41,0.08)]">
            <CheckoutSuccessActions sessionId={sessionId} />
          </div>
        </section>

        <SiteFooter text="© 2026 FOVEA AI. ALL RIGHTS RESERVED." variant="light" />
      </div>
    </main>
  );
}
