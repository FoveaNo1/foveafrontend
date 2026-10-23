import { Cormorant_Garamond, EB_Garamond, Mrs_Saint_Delafield } from "next/font/google";

// The landing page's faces (components/book/BookShell.tsx).
export const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["300", "400", "600", "700"], style: ["normal", "italic"], display: "swap" });
export const eb = EB_Garamond({ variable: "--font-eb", subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], display: "swap" });
export const signature = Mrs_Saint_Delafield({ variable: "--font-signature", subsets: ["latin"], weight: "400", display: "swap", preload: false });
