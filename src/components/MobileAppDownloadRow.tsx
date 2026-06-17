import { ArrowUpRight, Download } from "lucide-react";
import { CONTENT } from "../constants/content";

type MobileAppDownloadRowProps = {
  className?: string;
};

/**
 * iOS / TestFlight (brand pill) + Android placeholder — reuse under hero mockup and in final CTA.
 */
export default function MobileAppDownloadRow({ className = "" }: MobileAppDownloadRowProps) {
  const { downloadIos, downloadIosSub, downloadAndroid, downloadAndroidSoon } = CONTENT.hero;

  return (
    <div className={`flex w-full max-w-[19.5rem] flex-col gap-2 sm:gap-2.5 ${className}`.trim()}>
      <a
        href={CONTENT.hero.testflightLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex min-h-[48px] w-full flex-row items-center gap-3 rounded-full border border-white/20 bg-transparent px-5 sm:px-6 py-2 font-semibold text-white no-underline outline-none transition-[border-color,transform] duration-150 ease-out hover:border-white/40 focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bawo-canvas,#06030C)] active:scale-[0.99] motion-reduce:transition-none"
        style={{ fontFamily: "Montserrat, system-ui, sans-serif" }}
      >
        <Download className="h-5 w-5 shrink-0 text-white/90" strokeWidth={2} aria-hidden />
        <span className="flex min-w-0 flex-1 flex-col items-start text-left leading-tight">
          <span className="text-[14px] sm:text-[15px] tracking-wide">{downloadIos}</span>
          <span className="text-[11px] sm:text-xs font-medium text-white/80">{downloadIosSub}</span>
        </span>
        <ArrowUpRight
          className="h-4 w-4 shrink-0 text-white/70 transition-opacity group-hover:text-white"
          strokeWidth={2}
          aria-hidden
        />
      </a>
      <div
        className="inline-flex min-h-[44px] w-full flex-row items-center justify-between gap-3 rounded-full border border-white/10 bg-transparent px-5 py-2 text-left text-[13px] sm:text-sm text-white/40"
        role="status"
        aria-label={`${downloadAndroid}, ${downloadAndroidSoon}`}
      >
        <span className="font-medium text-white/50">{downloadAndroid}</span>
        <span className="rounded-md bg-white/[0.07] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/35">
          {downloadAndroidSoon}
        </span>
      </div>
    </div>
  );
}
