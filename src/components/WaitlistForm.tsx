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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F37021]/20 mb-4">
          <svg
            className="w-8 h-8 text-[#F37021]"
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
        <p className="text-[#FAF9F6] text-lg font-museo-medium">
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
            className="w-full px-4 py-3 bg-[#161820] border border-[rgba(255,255,255,0.14)] rounded-lg text-[#FAF9F6] placeholder:text-[rgba(250,249,246,0.5)] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:border-transparent transition-all"
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
            className="w-full px-4 py-3 bg-[#161820] border border-[rgba(255,255,255,0.14)] rounded-lg text-[#FAF9F6] placeholder:text-[rgba(250,249,246,0.5)] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:border-transparent transition-all"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="city" className="sr-only">
            {CONTENT.waitlist.fields.city}
          </label>
          <select
            id="city"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-3 bg-[#161820] border border-[rgba(255,255,255,0.14)] rounded-lg text-[#FAF9F6] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:border-transparent transition-all appearance-none cursor-pointer"
            disabled={isSubmitting}
          >
            <option value="">{CONTENT.waitlist.fields.city}</option>
            {cities.map((cityOption) => (
              <option key={cityOption} value={cityOption} className="bg-[#161820]">
                {cityOption}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status === "error" && errorMessage && (
        <div className="text-[#ef4444] text-sm font-museo-regular">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#F37021] hover:bg-[#FF8A42] text-[#FAF9F6] px-6 py-3 rounded-[100px] font-museo-semibold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:ring-offset-2 focus:ring-offset-[#101114]"
      >
        {isSubmitting ? "Submitting..." : CONTENT.waitlist.button}
      </button>

      <p className="text-[rgba(250,249,246,0.6)] text-sm text-center font-museo-regular">
        {CONTENT.waitlist.helperText}
      </p>
    </form>
  );
}

