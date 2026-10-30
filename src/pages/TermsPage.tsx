import LegalLayout, { LegalList, LegalSection } from "./LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" activePath="/terms">
      <p>
        Welcome to BawoSocial. These Terms of Service ("Terms") govern your
        access to and use of the BawoSocial mobile app, joinbawo.com, and related
        services (together, the "Service"). By using BawoSocial, you agree to
        these Terms. If you do not agree, do not use the Service.
      </p>

      <LegalSection title="1. Eligibility">
        <LegalList
          items={[
            "You must be 18 years or older to use BawoSocial.",
            "By creating an account or using the Service, you confirm that you meet this age requirement.",
            "We may remove accounts if we learn a user is under 18.",
          ]}
        />
      </LegalSection>

      <LegalSection title="2. Your account">
        <LegalList
          items={[
            "You are responsible for keeping your login credentials secure.",
            "You agree to provide accurate information and keep it updated.",
            "You may maintain only one personal account unless we approve otherwise.",
            "We may suspend or terminate accounts that violate these Terms or that are inactive.",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. User content and community rules">
        <p>
          You retain rights to content you create, such as photos, posts, and
          messages. You grant BawoSocial a non exclusive, worldwide,
          royalty free license to host, display, and distribute that content as
          needed to operate the Service.
        </p>
        <p>You agree not to:</p>
        <LegalList
          items={[
            "Harass, threaten, harm, or impersonate others",
            "Post illegal, misleading, violent, hateful, or sexually explicit content",
            "Spam, solicit, or promote unrelated products without permission",
            "Share private information about others without consent",
            "Attempt to hack, scrape, or disrupt the Service",
            "Use BawoSocial for anything other than respectful community, friendship, culture, networking, and related social engagement",
          ]}
        />
        <p>
          BawoSocial has zero tolerance for objectionable content and abusive
          behavior. We may remove content or accounts that violate these rules,
          at our discretion.
        </p>
      </LegalSection>

      <LegalSection title="4. Reporting and blocking">
        <p>
          You can report or block another user from their profile, chat, or
          related menus in the app. Our team reviews reports and aims to act
          within 24 hours. Blocking helps prevent further contact from that user
          inside BawoSocial.
        </p>
      </LegalSection>

      <LegalSection title="5. Business listings and claims">
        <p>
          BawoSocial may display business listings for restaurants, markets,
          services, and other venues. Business owners or authorized
          representatives may claim a listing and keep information accurate.
          False claims, fake ownership documents, or misleading listing details
          are prohibited and may lead to removal or account action.
        </p>
      </LegalSection>

      <LegalSection title="6. Ordering and third party businesses">
        <p>
          Some listings may include ordering or reservation links that take you
          to a third party business website or ordering tool. Those businesses
          are responsible for their own menus, pricing, orders, delivery,
          payments, and customer service. BawoSocial is not a party to those
          transactions and is not responsible for third party order fulfillment
          or disputes.
        </p>
      </LegalSection>

      <LegalSection title="7. Privacy">
        <p>
          Your privacy matters to us. Please read our{" "}
          <a href="/privacy" className="font-semibold text-[#E8B959] hover:text-[#FFBC42]">
            Privacy Policy
          </a>{" "}
          to understand how we collect and use your data. We do not sell your
          personal data.
        </p>
      </LegalSection>

      <LegalSection title="8. Subscriptions and payments">
        <LegalList
          items={[
            "Some features may be paid (for example, premium access).",
            "Payments are handled securely by Stripe or the applicable app store billing system.",
            "By purchasing, you agree to the stated pricing, renewal, and cancellation terms shown at checkout.",
          ]}
        />
      </LegalSection>

      <LegalSection title="9. Termination">
        <LegalList
          items={[
            "You may delete your account anytime in Profile, then Settings, then Delete Account, or by emailing support.",
            "We may suspend or terminate your account for Terms violations, illegal activity, or behavior that harms the community.",
            "After termination, provisions that should reasonably survive (such as disclaimers, limitation of liability, and governing law) remain in effect.",
          ]}
        />
      </LegalSection>

      <LegalSection title="10. Disclaimers">
        <LegalList
          items={[
            'BawoSocial is provided "as is." We make no guarantees of matches, friendships, event outcomes, or business results.',
            "We are not responsible for the actions of other users or third party businesses.",
            "Always use care when meeting people online or in person and when visiting venues.",
            "We do not guarantee uninterrupted Service availability.",
          ]}
        />
      </LegalSection>

      <LegalSection title="11. Limitation of liability">
        <p>
          To the fullest extent permitted by law, BawoSocial is not liable for
          any indirect, incidental, special, or consequential damages arising
          from your use of the Service.
        </p>
      </LegalSection>

      <LegalSection title="12. Governing law">
        <p>
          These Terms are governed by the laws of the State of New York, without
          regard to conflict of law rules. Courts located in New York will have
          exclusive jurisdiction over disputes arising from these Terms, except
          where applicable law requires otherwise.
        </p>
      </LegalSection>

      <LegalSection title="13. Changes to these Terms">
        <p>
          We may update these Terms. When we do, we will update the date at the
          top of this page and notify you when changes are significant.
          Continued use of BawoSocial after an update means you accept the
          revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="14. Contact">
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
          <a href="/privacy" className="font-semibold text-[#E8B959] hover:text-[#FFBC42]">
            Privacy Policy
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
