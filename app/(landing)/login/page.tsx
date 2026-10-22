import type { Metadata } from "next";
import SignIn from "../../../components/book/account/SignIn";
import SiteFoot from "../../../components/book/SiteFoot";
import TopBar from "../../../components/book/TopBar";

export const metadata: Metadata = {
  title: "Sign in · Fovea",
  description: "Sign in to your Fovea account.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <>
      <TopBar />
      <SignIn />
      <SiteFoot />
    </>
  );
}
