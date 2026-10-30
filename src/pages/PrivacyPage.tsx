import LegalLayout, { LegalList, LegalSection } from "./LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" activePath="/privacy">
      <p>
        Welcome to BawoSocial ("we", "our", or "us"). Your privacy matters to us.
        This Privacy Policy explains how we collect, use, store, and share your
        information when you use the BawoSocial mobile app, joinbawo.com, and
        related services.
      </p>

      <LegalSection title="1. Information we collect">
        <p>We collect the following types of information:</p>
        <LegalList
          items={[
            <>
              <strong className="text-[#F7F3FA]">Account data:</strong> Name,
              email address, phone number (optional), date of birth (to confirm
              you are 18 or older), and login credentials.
            </>,
            <>
              <strong className="text-[#F7F3FA]">Profile data:</strong> Photos,
              bio, age, gender, height, profession, cultural heritage or tribe,
              languages, interests, relationship intentions (such as friendship,
              community, or professional networking), and answers to prompts.
            </>,
            <>
              <strong className="text-[#F7F3FA]">Location (while in use):</strong>{" "}
              When you allow location access, we use your location while the app
              is in use to power the map and show nearby events, hosts, venues,
              and groups. You can deny location and still browse curated content.
            </>,
            <>
              <strong className="text-[#F7F3FA]">
                Camera, photos, and microphone:
              </strong>{" "}
              Used when you take or upload profile photos, posts, event flyers,
              voice notes, Go Live audio or video, or join voice and video calls.
              We only access these when you choose to use those features.
            </>,
            <>
              <strong className="text-[#F7F3FA]">Contacts (hashed):</strong> If
              you allow contacts access, we use it only to help you find friends
              already on BawoSocial. Contact numbers are hashed on your device
              and are not sent to our servers in plain form.
            </>,
            <>
              <strong className="text-[#F7F3FA]">Calendar:</strong> If you allow
              calendar access, we can add events you RSVP to onto your calendar,
              with reminders so you do not miss meetups.
            </>,
            <>
              <strong className="text-[#F7F3FA]">Notifications:</strong> Device
              push tokens and notification preferences so we can send messages,
              event reminders, and community updates you opt into. You can change
              these in Profile Settings and in your device settings.
            </>,
            <>
              <strong className="text-[#F7F3FA]">
                Faith or religion preference (optional):
              </strong>{" "}
              You may choose to share a faith or religion preference. This is
              opt in, treated as sensitive personal information, never sold, and
              never used for advertising. You can clear it anytime in your
              profile.
            </>,
            <>
              <strong className="text-[#F7F3FA]">
                Business listing and claim data:
              </strong>{" "}
              If you claim or manage a business listing, we collect business
              name, category, address, contact details, hours, media, ownership
              proof you submit, and related claim status.
            </>,
            <>
              <strong className="text-[#F7F3FA]">User content:</strong> Messages,
              reactions, posts, group chat messages, event tips, and other
              content you submit in the app.
            </>,
            <>
              <strong className="text-[#F7F3FA]">Device and crash data:</strong>{" "}
              Device type, operating system, and crash diagnostics via Sentry.
              Crash reports are configured to avoid including personal
              information such as your name, email, or message contents.
            </>,
            <>
              <strong className="text-[#F7F3FA]">Payment info:</strong> If you
              make purchases, payment details are handled securely by Stripe. We
              do not store full card numbers ourselves.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection title="2. How we use your information">
        <LegalList
          items={[
            "To create and personalize your profile and experience",
            "To show the map, nearby events, and local community recommendations",
            "To connect you with friends, Circles, and community members",
            "To facilitate chats, posts, events, and business discovery",
            "To process business claims and keep directory listings accurate",
            "To send notifications you have enabled",
            "To improve app performance, fix crashes, and protect against abuse",
            "To process payments and offer premium features when applicable",
            "To respond to support requests and enforce our Terms of Service",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. How we share information">
        <p>
          We do not sell your personal data. We do not sell faith or religion
          preferences, and we do not use that data for ads.
        </p>
        <p>We may share limited information with:</p>
        <LegalList
          items={[
            <>
              <strong className="text-[#F7F3FA]">Supabase:</strong> Our primary
              processor for authentication, database, storage, and related
              backend services.
            </>,
            <>
              <strong className="text-[#F7F3FA]">Sentry:</strong> Crash and error
              monitoring without personal profile content.
            </>,
            <>
              <strong className="text-[#F7F3FA]">Stripe:</strong> Secure payment
              processing when you make a purchase.
            </>,
            <>
              <strong className="text-[#F7F3FA]">Service providers:</strong>{" "}
              Partners who help us operate BawoSocial under confidentiality
              obligations.
            </>,
            <>
              <strong className="text-[#F7F3FA]">Legal authorities:</strong> When
              required by law or to protect safety and rights.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Your rights and account deletion">
        <p>
          Depending on where you live, you may have rights to access, update,
          delete, or receive a copy of your information, and to withdraw consent.
        </p>
        <p>
          You can delete your account in the app at any time: open Profile, then
          Settings, then Delete Account. That removes your profile and related
          account data from our active systems, subject to limited records we may
          keep for legal, safety, or fraud prevention reasons.
        </p>
        <p>
          You can also request deletion by emailing{" "}
          <a
            href="mailto:support@bawosocial.com"
            className="font-semibold text-[#E8B959] hover:text-[#FFBC42]"
          >
            support@bawosocial.com
          </a>{" "}
          or{" "}
          <a
            href="mailto:bawoapp1398@gmail.com"
            className="font-semibold text-[#E8B959] hover:text-[#FFBC42]"
          >
            bawoapp1398@gmail.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="5. Data storage and security">
        <p>
          We use modern security practices such as encryption in transit and
          access controls. No method of storage or transmission is 100 percent
          secure, and we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="6. Children">
        <p>
          BawoSocial is for users 18 years or older. We do not knowingly collect
          data from anyone under 18. If we learn that someone under 18 created an
          account, we will remove it.
        </p>
      </LegalSection>

      <LegalSection title="7. Changes to this policy">
        <p>
          We may update this Privacy Policy. When we do, we will update the date
          at the top of this page. If changes are significant, we will notify you
          in the app or by email when practical. Continued use of BawoSocial
          after an update means you accept the revised policy.
        </p>
      </LegalSection>

      <LegalSection title="8. Contact">
        <p>
          Primary:{" "}
          <a
            href="mailto:support@bawosocial.com"
            className="font-semibold text-[#E8B959] hover:text-[#FFBC42]"
          >
            support@bawosocial.com
          </a>
        </p>
        <p>
          Secondary:{" "}
          <a
            href="mailto:bawoapp1398@gmail.com"
            className="font-semibold text-[#E8B959] hover:text-[#FFBC42]"
          >
            bawoapp1398@gmail.com
          </a>
        </p>
        <p>
          Related pages:{" "}
          <a href="/terms" className="font-semibold text-[#E8B959] hover:text-[#FFBC42]">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/support" className="font-semibold text-[#E8B959] hover:text-[#FFBC42]">
            Support
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
