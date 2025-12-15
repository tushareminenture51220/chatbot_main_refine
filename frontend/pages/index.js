import Image from "next/image";
import { Inter } from "next/font/google";
import Script from "next/script";
import HomepageHero from "@/components/HomepageHero";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <main className="main-container">
        <div className="mt-18">
          <HomepageHero />
        </div>
      </main>
    </>
  );
}
