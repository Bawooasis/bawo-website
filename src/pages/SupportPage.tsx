import LegalLayout, { LegalList, LegalSection } from "./LegalLayout";

export default function SupportPage() {
  return (
    <LegalLayout title="Support" activePath="/support">
      <p>
        Need help with BawoSocial? We are here to help you get the most out of
        the community. This page covers the BawoSocial iOS app and related
        services on joinbawo.com.
      </p>

      <LegalSection title="Frequently asked questions">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-[#FFBC42]">
              1. I cannot log in or sign up
            </h3>
            <LegalList
              items={[
                "Confirm you are using the correct email address.",
                "Check spam or junk for verification or magic link emails.",
                "Restart the app and try signing in again.",
                "If you use Apple or Google sign in, confirm you are using the same provider you used at signup.",
                "If the issue continues, email support with your device model and iOS version.",
              ]}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-[#FFBC42]">
              2. How do I edit my profile?
            </h3>
            <LegalList
              items={[
                "Open the Profile tab.",
                "Tap Edit Profile.",
                "Update your photo, bio, or preferences.",
                "Save your changes before leaving the screen.",
              ]}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-[#FFBC42]">
              3. How do Circles and community chats work?
            </h3>
            <LegalList
              items={[
                "Join Circles based on location, faith spaces, interests, or culture.",
                "Participate in posts and group conversations with other members.",
                "You can leave a Circle anytime from its settings.",
              ]}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-[#FFBC42]">
              4. How do I find or attend events?
            </h3>
            <LegalList
              items={[
                "Open Events or explore the map.",
                "Browse upcoming diaspora events near you.",
                "Tap an event to view details or RSVP. If you allow calendar access, BawoSocial can add the event to your calendar.",
              ]}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-[#FFBC42]">
              5. How do I report or block someone?
            </h3>
            <LegalList
              items={[
                "Open the user's profile or the chat menu.",
                "Choose Report or Block.",
                "Our team reviews reports and aims to act within 24 hours to help keep the community safe.",
              ]}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-[#FFBC42]">
              6. How do I delete my account?
            </h3>
            <LegalList
              items={[
                "In the app: open Profile, then Settings, then Delete Account.",
                "Confirm the deletion when prompted. This removes your profile and related account data from our active systems.",
                "You can also email support@bawosocial.com and ask us to delete your account.",
              ]}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-[#FFBC42]">
              7. Is my data safe?
            </h3>
            <p>
              We take privacy and security seriously. Your data is handled under
              our Privacy Policy and is never sold to third parties. Read the
              full{" "}
              <a
                href="/privacy"
                className="font-semibold text-[#E8B959] hover:text-[#FFBC42]"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-[#FFBC42]">
              8. How do business listings and claims work?
            </h3>
            <LegalList
              items={[
                "Browse businesses on the map or directory.",
                "Owners can claim a listing through the business flow on joinbawo.com/businesses.",
                "Ordering or reservation links may open a third party business site. That business handles its own orders.",
              ]}
            />
          </div>
        </div>
      </LegalSection>

      <LegalSection title="Contact support">
        <p>
          Primary email:{" "}
          <a
            href="mailto:support@bawosocial.com"
            className="font-semibold text-[#E8B959] hover:text-[#FFBC42]"
          >
            support@bawosocial.com
          </a>
        </p>
        <p>
          Secondary email:{" "}
          <a
            href="mailto:bawoapp1398@gmail.com"
            className="font-semibold text-[#E8B959] hover:text-[#FFBC42]"
          >
            bawoapp1398@gmail.com
          </a>
        </p>
        <p>When you write, please include:</p>
        <LegalList
          items={[
            "Your iPhone model",
            "iOS version",
            "A short description of the issue",
            "Screenshots if they help explain the problem",
          ]}
        />
      </LegalSection>

      <LegalSection title="Legal">
        <LegalList
          items={[
            <>
              <a
                href="/privacy"
                className="font-semibold text-[#E8B959] hover:text-[#FFBC42]"
              >
                Privacy Policy
              </a>
            </>,
            <>
              <a
                href="/terms"
                className="font-semibold text-[#E8B959] hover:text-[#FFBC42]"
              >
                Terms of Service
              </a>
            </>,
          ]}
        />
        <p className="pt-2 text-sm text-[#F7F3FA]/55">
          © 2026 BawoSocial. Support for the BawoSocial iOS app and joinbawo.com.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
