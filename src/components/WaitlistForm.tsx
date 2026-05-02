import { useState } from "react";
import { CONTENT } from "../constants/content";

interface WaitlistFormProps {
  onSuccess?: () => void;
}

export default function WaitlistForm({ onSuccess }: WaitlistFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Spam protection
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const cities = [
    "New York",
    "London",
    "Toronto",
    "Atlanta",
    "Los Angeles",
    "Houston",
    "Lagos",
    "Other"
  ];

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check
    if (honeypot) {
      return; // Bot detected, silently fail
    }

    // Validation
    if (!name.trim()) {
      setErrorMessage("Please enter your name");
      setStatus("error");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Please enter your email");
      setStatus("error");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      setStatus("error");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      // Replace with your actual API endpoint
      // For now, this will work if you set up a backend endpoint at /api/waitlist
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          city: city || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setCity("");
      setHoneypot("");

      // Track conversion
      const win = window as unknown as { gtag?: (...args: unknown[]) => void };
      if (typeof win.gtag !== "undefined") {
        win.gtag("event", "waitlist_signup", {
          event_category: "conversion",
          event_label: "waitlist",
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Waitlist submission error:", error);
      setStatus("error");
      setErrorMessage(CONTENT.waitlist.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4 border border-white/15">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="text-white text-lg font-medium">
          {CONTENT.waitlist.success}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot field - hidden from users */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute opacity-0 pointer-events-none h-0 w-0"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="sr-only">
            {CONTENT.waitlist.fields.name}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={CONTENT.waitlist.fields.name}
            required
            className="w-full px-4 py-3 bg-[var(--bawo-elevated)] border border-[var(--bawo-border-hairline)] rounded-bawo-md text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--bawo-brand-cta-orange)] focus:border-transparent transition-all font-medium"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="email" className="sr-only">
            {CONTENT.waitlist.fields.email}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={CONTENT.waitlist.fields.email}
            required
            className="w-full px-4 py-3 bg-[var(--bawo-elevated)] border border-[var(--bawo-border-hairline)] rounded-bawo-md text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--bawo-brand-cta-orange)] focus:border-transparent transition-all font-medium"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="city" className="sr-only">
            City
          </label>
          <select
            id="city"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--bawo-elevated)] border border-[var(--bawo-border-hairline)] rounded-bawo-md text-white focus:outline-none focus:ring-2 focus:ring-[var(--bawo-brand-cta-orange)] focus:border-transparent transition-all appearance-none cursor-pointer font-medium"
            disabled={isSubmitting}
          >
            <option value="">Select your city</option>
            {cities.map((cityOption) => (
              <option key={cityOption} value={cityOption} className="bg-[var(--bawo-canvas)]">
                {cityOption}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status === "error" && errorMessage && (
        <div className="text-[#ef4444] text-sm font-normal">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="liquid-glass-cta w-full disabled:cursor-not-allowed disabled:hover:transform-none"
      >
        <span className="liquid-glass-cta__label !px-4">
          {isSubmitting ? "Submitting..." : CONTENT.waitlist.button}
        </span>
      </button>

      <p className="text-white/60 text-sm text-center font-normal">
        {CONTENT.waitlist.helperText}
      </p>
    </form>
  );
}
