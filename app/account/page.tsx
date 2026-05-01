import type { Metadata } from "next";
import AccountPageContent from "../../components/AccountPageContent";

export const metadata: Metadata = {
  title: "Account — Fovea",
  description: "Manage your Fovea account, devices, and subscription.",
};

export default function AccountPage() {
  return <AccountPageContent />;
}
