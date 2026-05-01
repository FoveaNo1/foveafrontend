import type { Metadata } from "next";
import LoginPageContent from "../../components/LoginPageContent";

export const metadata: Metadata = {
  title: "Sign In — Fovea",
  description: "Sign in to your Fovea account.",
};

export default function LoginPage() {
  return <LoginPageContent />;
}
