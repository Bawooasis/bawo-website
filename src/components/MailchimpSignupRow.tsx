import { useState } from "react";

type MailchimpSignupRowProps = {
  className?: string;
  buttonLabel?: string;
  compact?: boolean;
  /** Ghost outline — use for email list so paid CTAs stay visually primary. */
  variant?: "default" | "ghost";
};

export default function MailchimpSignupRow({
  className = "",
  buttonLabel = "Join Waitlist",
  compact = false,
  variant = "default",
}: MailchimpSignupRowProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const inputTypography = compact ? "py-3 text-base" : "py-4 text-lg";
  const btnPad = compact ? "px-6 py-3 text-sm min-h-[44px]" : "px-10 py-4 text-base min-h-[48px]";
  const ghostButton =
    variant === "ghost"
      ? "relative border-2 border-white/25 bg-white/[0.03] backdrop-blur-md text-white/90 " +
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.25)] " +
        "hover:bg-white/[0.08] hover:border-[#D4AF37]/50 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_6px_20px_rgba(0,0,0,0.3),0_0_40px_rgba(212,175,55,0.15)] " +
        "hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 " +
        "transition-[transform,box-shadow,border-color,background-color] duration-200"
      : "border-2 border-white text-white hover:bg-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)]";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("You're on the list! Check your inbox.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative ${className}`.trim()}
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 sm:items-end">
        <input
          id="waitlist-email-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email for launch updates"
          required
          autoComplete="email"
          disabled={status === "loading"}
          className={`flex-1 min-w-0 bg-transparent border-0 border-b-2 border-white/25 rounded-none shadow-none focus:ring-0 focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 font-museo-medium text-white placeholder:text-[#D4AF37] placeholder:opacity-90 ${inputTypography}`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`rounded-full font-bold flex items-center justify-center transition-[transform,background-color,border-color] duration-200 font-museo-bold shrink-0 disabled:opacity-60 ${btnPad} ${ghostButton}`}
        >
          {status === "loading" ? "Joining…" : buttonLabel}
        </button>
      </div>
      {message && (
        <p
          className={`mt-3 text-sm font-museo-medium ${
            status === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
