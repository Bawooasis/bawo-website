import { useCallback, useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { AppleIcon, BellIcon, LinkIcon, WhatsAppIcon, XIcon } from "./icons/BrandIcons";
import { CONTENT } from "../constants/content";

type HeroSecondaryBarProps = {
  className?: string;
  /** Single horizontal row — used in hero footer strip. */
  layout?: "strip" | "stacked";
};

type ActionTileProps = {
  label: string;
  shortLabel?: string;
  icon: ReactNode;
  iconTone?: "whatsapp" | "x" | "neutral" | "apple" | "accent";
  href?: string;
  external?: boolean;
  onClick?: () => void;
  compactLabel?: boolean;
};

function ActionTile({
  label,
  shortLabel,
  icon,
  iconTone = "neutral",
  href,
  external,
  onClick,
  compactLabel,
}: ActionTileProps) {
  const iconClass = `bawo-action-tile__icon bawo-action-tile__icon--${iconTone}`;
  const content = (
    <>
      <span className={iconClass}>{icon}</span>
      <span
        className={`bawo-action-tile__label${compactLabel ? " bawo-action-tile__label--compact" : ""}`}
      >
        {shortLabel && compactLabel ? (
          <>
            <span className="bawo-action-tile__label-full">{label}</span>
            <span className="bawo-action-tile__label-short">{shortLabel}</span>
          </>
        ) : (
          label
        )}
        {external && (
          <ArrowUpRight className="bawo-action-tile__arrow" strokeWidth={2} aria-hidden />
        )}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="bawo-action-tile"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className="bawo-action-tile" onClick={onClick}>
      {content}
    </button>
  );
}

export default function HeroSecondaryBar({
  className = "",
  layout = "stacked",
}: HeroSecondaryBarProps) {
  const [copied, setCopied] = useState(false);
  const {
    shareWhatsApp,
    shareLink,
    shareTweet,
    shareCopy,
    shareCopied,
    testflightLink,
    knowWhenLaunch,
    knowWhenLaunchShort,
  } = CONTENT.hero;

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", shareLink);
    }
  }, [shareLink]);

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTweet)}&url=${encodeURIComponent(shareLink)}`;

  const isStrip = layout === "strip";

  const actionTiles = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: <WhatsAppIcon className="w-[18px] h-[18px]" />,
      iconTone: "whatsapp" as const,
      href: `https://wa.me/?text=${encodeURIComponent(shareWhatsApp)}`,
      external: true,
    },
    {
      key: "copy",
      label: copied ? shareCopied : shareCopy,
      icon: <LinkIcon className="w-[17px] h-[17px]" />,
      iconTone: "neutral" as const,
      onClick: copyLink,
    },
    {
      key: "x",
      label: "Post on X",
      icon: <XIcon className="w-[15px] h-[15px]" />,
      iconTone: "x" as const,
      href: tweetUrl,
      external: true,
    },
    {
      key: "ios",
      label: "iOS beta",
      icon: <AppleIcon className="w-[18px] h-[18px]" />,
      iconTone: "apple" as const,
      href: testflightLink,
      external: true,
    },
    {
      key: "launch",
      label: knowWhenLaunch,
      shortLabel: knowWhenLaunchShort,
      icon: <BellIcon className="w-[17px] h-[17px]" />,
      iconTone: "accent" as const,
      href: "#email-section",
    },
  ];

  if (isStrip) {
    return (
      <div
        className={`bawo-secondary-bar bawo-secondary-bar--strip ${className}`.trim()}
        aria-label="Share and explore"
      >
        <div className="bawo-secondary-bar__row bawo-secondary-bar__row--five">
          {actionTiles.map((tile) => (
            <ActionTile
              key={tile.key}
              label={tile.label}
              shortLabel={tile.shortLabel}
              icon={tile.icon}
              iconTone={tile.iconTone}
              href={tile.href}
              external={tile.external}
              onClick={tile.onClick}
              compactLabel
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bawo-secondary-bar ${className}`} aria-label="Share and explore">
      <div className="bawo-secondary-bar__row">
        {actionTiles.slice(0, 3).map((tile) => (
          <ActionTile
            key={tile.key}
            label={tile.label}
            icon={tile.icon}
            iconTone={tile.iconTone}
            href={tile.href}
            external={tile.external}
            onClick={tile.onClick}
          />
        ))}
      </div>
      <div className="bawo-secondary-bar__row bawo-secondary-bar__row--two">
        {actionTiles.slice(3).map((tile) => (
          <ActionTile
            key={tile.key}
            label={tile.label}
            icon={tile.icon}
            iconTone={tile.iconTone}
            href={tile.href}
            external={tile.external}
            onClick={tile.onClick}
          />
        ))}
      </div>
    </div>
  );
}
