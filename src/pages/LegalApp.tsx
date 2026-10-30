import PrivacyPage from "./PrivacyPage";
import SupportPage from "./SupportPage";
import TermsPage from "./TermsPage";

type LegalPath = "/privacy" | "/terms" | "/support";

type LegalAppProps = {
  path: LegalPath;
};

export default function LegalApp({ path }: LegalAppProps) {
  switch (path) {
    case "/terms":
      return <TermsPage />;
    case "/support":
      return <SupportPage />;
    case "/privacy":
    default:
      return <PrivacyPage />;
  }
}

export function resolveLegalPath(pathname: string): LegalPath | null {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/privacy") return "/privacy";
  if (path === "/terms") return "/terms";
  if (path === "/support") return "/support";
  return null;
}
