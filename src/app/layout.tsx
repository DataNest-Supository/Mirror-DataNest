import {
  Inter,
  Inter_Tight,
  Instrument_Serif,
  JetBrains_Mono
} from "next/font/google";
import ThemeBootstrapScript from "@/components/platform/ThemeBootstrapScript";
import CinematicRuntime from "@/components/platform/CinematicRuntime";
import ThemeControl from "@/components/platform/ThemeControl";
import "./resonance-design-system.css";
import "./globals.css";
import "./external-auditor.css";
import "./entry.css";
import "./datanest-ai-optimized.css";
import "./datanest-ai-command-center.css";
import "./datanest-ai-zoom.css";
import "./cinematic-workspaces.css";
import type { ReactNode } from "react";

const interTight=Inter_Tight({
  subsets:["latin"],
  variable:"--font-inter-tight",
  display:"swap"
});

const inter=Inter({
  subsets:["latin"],
  variable:"--font-inter",
  display:"swap"
});

const instrumentSerif=Instrument_Serif({
  subsets:["latin"],
  weight:"400",
  style:"italic",
  variable:"--font-instrument-serif",
  display:"swap"
});

const jetBrainsMono=JetBrains_Mono({
  subsets:["latin"],
  variable:"--font-jetbrains-mono",
  display:"swap"
});

// Keep focused DataNest AI refinements last so UX overrides remain authoritative.
export const metadata = {
  title: "Mirror-DataNest · Resonance R&D",
  description: "Single-owner R&D workspace for developing Resonance DataNest and related products and tools."
};

export default function RootLayout({children}:{children:ReactNode}) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const forceHttpsSource=basePath + "/force-https.js";
  const releaseSha = process.env.DATANEST_UI_RELEASE_SHA ?? process.env.GITHUB_SHA ?? "";
  const runtimeConfigSource=basePath + "/runtime-config.js" + (releaseSha ? `?v=${releaseSha.slice(0,12)}` : "");
  const fontVariables=[
    interTight.variable,
    inter.variable,
    instrumentSerif.variable,
    jetBrainsMono.variable
  ].join(" ");

  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <ThemeBootstrapScript />
        <script src={forceHttpsSource} />
        <script src={runtimeConfigSource} />
      </head>
      <body>
        <CinematicRuntime/>
        {children}
        <div className="themeControlDock"><ThemeControl compact /></div>
      </body>
    </html>
  );
}
