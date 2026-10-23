import type { Metadata } from "next";
import AuthCallback from "../../../../components/book/account/AuthCallback";
import SiteFoot from "../../../../components/book/SiteFoot";
import TopBar from "../../../../components/book/TopBar";

export const metadata: Metadata = { title: "Signing in · Fovea", robots: { index: false, follow: false } };

export default function AuthCallbackPage() {
  return (
    <>
      <TopBar />
      <AuthCallback />
      <SiteFoot />
    </>
  );
}
