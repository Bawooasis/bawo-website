/** Public legal / compliance copy for joinbawo.com */

export const SUPPORT_EMAIL = "hello@joinbawo.com";

export const AFFILIATE_DISCLOSURE_LINE =
  "BawoSocial may earn a commission when you buy tickets through links on this site or in the app.";

export const AFFILIATE_DISCLOSURE_PAGE = {
  title: "Affiliate disclosure",
  updated: "November 2026",
  intro:
    "BawoSocial sometimes partners with event organizers and ticketing platforms. When you buy tickets through links we share on joinbawo.com or in the BawoSocial app, BawoSocial may earn a commission.",
  sections: [
    {
      heading: "How it works",
      body: "Some event and ticket links on BawoSocial include tracking or promoter codes. If you complete a purchase through one of those links, the ticketing platform or organizer may pay BawoSocial a commission or referral fee. The ticket price you see is set by the organizer or platform, not by a BawoSocial markup for using our link.",
    },
    {
      heading: "What this covers",
      body: "This disclosure applies to ticket and event links published on joinbawo.com, in the BawoSocial mobile app, and in BawoSocial marketing messages that point to third party ticketing tools such as Posh, Eventbrite, Shotgun, Tixr, or similar platforms.",
    },
    {
      heading: "Editorial independence",
      body: "BawoSocial curates events for the Nigerian community in the diaspora, starting in NYC. Affiliate relationships do not change our commitment to featuring real community gatherings. We may still highlight events with no affiliate arrangement.",
    },
    {
      heading: "Questions",
      body: `If you have questions about this disclosure, email BawoSocial at ${SUPPORT_EMAIL}.`,
    },
  ],
} as const;

export type LegalSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export const PRIVACY_PAGE = {
  title: "Privacy Policy",
  updated: "November 2026",
  intro:
    "This Privacy Policy explains how BawoSocial Inc. (“BawoSocial”, “we”, “us”) collects, uses, stores, and shares information when you use joinbawo.com and the BawoSocial iOS app. BawoSocial is operated from the United States, with a New York focus for our NYC community launch.",
  sections: [
    {
      heading: "Who we are",
      paragraphs: [
        "BawoSocial is a Nigerian culture hub for the Afro community, starting across New York City. Our website and app help people discover Nigerian owned businesses, Community Circles, events, and community resources.",
        `Questions about privacy: ${SUPPORT_EMAIL}.`,
      ],
    },
    {
      heading: "Information we collect",
      paragraphs: [
        "Depending on how you use BawoSocial, we may collect the following categories of information.",
      ],
      bullets: [
        "Account details such as email address, phone number, and name",
        "Profile information such as a profile photo and public profile fields you choose to share",
        "Location information while the app is in use, when you allow location access, so we can show nearby places and local context",
        "Content you create or send, including posts, messages, comments, circle activity, and similar community content",
        "Saved places, favorites, and similar preferences you store in the app",
        "Support requests and emails you send to BawoSocial",
        "Device, usage, diagnostics, analytics, and crash data, including data collected through tools such as Sentry and PostHog when those tools are enabled in the app or site",
      ],
    },
    {
      heading: "How we use information",
      paragraphs: [
        "We use information to operate and improve BawoSocial, create and secure accounts, personalize local recommendations, enable community features, moderate safety issues, measure product performance, fix crashes, and communicate about the service.",
        "We do not sell your personal information.",
      ],
    },
    {
      heading: "Processors and service providers",
      paragraphs: [
        "We use trusted processors to run BawoSocial. Supabase provides authentication, database, and related backend processing for account and app data. Analytics and crash reporting providers such as Sentry and PostHog may process diagnostics and usage data when enabled. These providers act on our instructions and only as needed to provide their services.",
      ],
    },
    {
      heading: "Ticket links and affiliate tracking",
      paragraphs: [
        AFFILIATE_DISCLOSURE_LINE,
        "When you tap or click a ticket link, you leave BawoSocial and complete the purchase on a third party ticketing site. Those platforms have their own privacy policies. Tracking or promoter codes may be included so BawoSocial can receive a commission if you buy tickets. See our Affiliate disclosure for details.",
      ],
    },
    {
      heading: "Sharing",
      paragraphs: [
        "We may share information with processors who help us operate BawoSocial, when required by law, to protect users and the service, or with your direction (for example when you publish content to other people in the community).",
        "We do not sell personal information and we do not share personal information for cross context behavioral advertising as a sale.",
      ],
    },
    {
      heading: "Account deletion",
      paragraphs: [
        "You can delete your BawoSocial account in the app: open Profile, then Settings, then Delete Account. After deletion, we remove or de identify personal data we no longer need to retain for legal, security, or operational reasons.",
      ],
    },
    {
      heading: "Retention and security",
      paragraphs: [
        "We keep information only as long as needed for the purposes described here, unless a longer period is required by law. We use administrative, technical, and organizational safeguards appropriate to the sensitivity of the data. No method of transmission or storage is perfectly secure.",
      ],
    },
    {
      heading: "Children",
      paragraphs: [
        "BawoSocial is for users who are 18 or older. We do not knowingly collect personal information from children under 18.",
      ],
    },
    {
      heading: "United States and New York",
      paragraphs: [
        "BawoSocial is based in the United States and currently focuses on communities in New York, especially NYC. If you access BawoSocial from outside the United States, you understand that your information may be processed in the United States.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [
        `For privacy questions, email ${SUPPORT_EMAIL}. You can also visit joinbawo.com/support.`,
      ],
    },
  ] satisfies LegalSection[],
} as const;

export const TERMS_PAGE = {
  title: "Terms of Service",
  updated: "November 2026",
  intro:
    "These Terms of Service (“Terms”) govern your use of joinbawo.com and the BawoSocial iOS app operated by BawoSocial Inc. By creating an account or using BawoSocial, you agree to these Terms.",
  sections: [
    {
      heading: "The service",
      paragraphs: [
        "BawoSocial helps the Afro community discover Nigerian-owned businesses, Community Circles, events, and culture, starting in New York City. Features may change as we improve the product.",
      ],
    },
    {
      heading: "Eligibility",
      paragraphs: [
        "You must be 18 or older to use BawoSocial. By using the service, you confirm that you meet this age requirement and can enter a binding agreement.",
      ],
    },
    {
      heading: "Accounts",
      paragraphs: [
        "You are responsible for the accuracy of your account information and for keeping your login credentials secure. You are responsible for activity that happens under your account.",
      ],
    },
    {
      heading: "Zero tolerance for objectionable content and abuse",
      paragraphs: [
        "BawoSocial has zero tolerance for objectionable content and abusive users. You may not post, share, or send content that is illegal, hateful, harassing, threatening, sexually exploitative, graphic violence without a legitimate community purpose, fraudulent, or otherwise harmful.",
        "You may not stalk, bully, threaten, spam, or otherwise abuse other people. BawoSocial may remove content, restrict features, suspend accounts, or permanently ban users who violate this standard, with or without prior notice.",
        "If you see objectionable content or abusive behavior, report it in the app or email hello@joinbawo.com. We review reports and take action as needed to keep the community safe.",
      ],
    },
    {
      heading: "User content license",
      paragraphs: [
        "You keep ownership of content you create. By posting or uploading content to BawoSocial, you grant BawoSocial a worldwide, non exclusive, royalty free license to host, store, reproduce, display, distribute, and otherwise use that content as needed to operate, promote, and improve the service.",
        "You represent that you have the rights needed to grant this license and that your content does not violate these Terms or any law.",
      ],
    },
    {
      heading: "Ticket purchases and third party sites",
      paragraphs: [
        "Ticket purchases happen on third party sites, not inside BawoSocial checkout. When you follow a ticket link, the purchase is handled by the organizer or ticketing platform under their own terms and privacy policy.",
        AFFILIATE_DISCLOSURE_LINE,
        "Read the full Affiliate disclosure at joinbawo.com/affiliate-disclosure.",
      ],
    },
    {
      heading: "Acceptable use",
      paragraphs: [
        "Do not attempt to break, scrape without permission, reverse engineer, overload, or interfere with BawoSocial. Do not impersonate others or use the service for unlawful purposes.",
      ],
    },
    {
      heading: "Disclaimers",
      paragraphs: [
        "BawoSocial is provided on an “as is” and “as available” basis. We do not guarantee uninterrupted service or that listings, events, or community content will always be accurate or available.",
      ],
    },
    {
      heading: "Limitation of liability",
      paragraphs: [
        "To the fullest extent allowed by law, BawoSocial and its operators are not liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, data, or goodwill arising from your use of the service.",
      ],
    },
    {
      heading: "Governing law",
      paragraphs: [
        "These Terms are governed by the laws of the State of New York and applicable United States law, without regard to conflict of law rules. Courts located in New York will have exclusive jurisdiction for disputes that cannot be resolved informally, except where prohibited by law.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [
        `Questions about these Terms: ${SUPPORT_EMAIL}. Support hub: joinbawo.com/support.`,
      ],
    },
  ] satisfies LegalSection[],
} as const;

export const SUPPORT_PAGE = {
  title: "Support",
  updated: "November 2026",
  intro:
    "Need help with BawoSocial? Start here for account help, safety tools, and venue claims.",
  emailPrompt: `Email us anytime at ${SUPPORT_EMAIL}. We read every message.`,
  faqs: [
    {
      question: "How do I delete my account?",
      answer:
        "In the BawoSocial app, open Profile, then Settings, then Delete Account. Follow the confirmation steps. If you are stuck, email hello@joinbawo.com from the address on your account.",
    },
    {
      question: "How do I report content?",
      answer:
        "Use the report controls on the post, message, event, or profile in the app. You can also email hello@joinbawo.com with a link or screenshot and a short description of the issue. BawoSocial reviews reports and may remove content or restrict accounts.",
    },
    {
      question: "How do I block users?",
      answer:
        "Open the person’s profile in the BawoSocial app and choose Block. Blocked users should lose the ability to interact with you in the ways the current app version supports. Contact support if blocking does not work as expected.",
    },
    {
      question: "How do venue or business claims work?",
      answer:
        "Business owners can start from joinbawo.com/businesses or the in app business tools to submit or claim a listing. Our team reviews claims before publishing updates. Email hello@joinbawo.com if you need help with a claim.",
    },
    {
      question: "Where is the privacy policy and terms?",
      answer:
        "Read the Privacy Policy at joinbawo.com/privacy and the Terms of Service at joinbawo.com/terms. Ticket affiliate details are at joinbawo.com/affiliate-disclosure.",
    },
  ],
} as const;
