/**
 * Asserts SiteHeader geometry across phone / iPad / laptop widths (no screenshots).
 * Requires a running preview server (default http://127.0.0.1:4173).
 *
 * Usage:
 *   npx playwright install chromium
 *   npm run preview -- --host 127.0.0.1 --port 4173
 *   node scripts/header-tablet-layout.test.mjs
 */
import { chromium } from "playwright";

const BASE_URL = process.env.HEADER_TEST_URL || "http://127.0.0.1:4173/";
/** Matches CSS/Tailwind xl — full pill nav, hamburger hidden. */
const DESKTOP_MIN = 1280;

const VIEWPORTS = [
  { width: 390, height: 844, label: "iphone-390" },
  { width: 744, height: 1133, label: "ipad-mini-744" },
  { width: 820, height: 1180, label: "ipad-air-820" },
  { width: 1024, height: 1366, label: "ipad-pro-1024-portrait" },
  { width: 1194, height: 834, label: "ipad-pro-11-1194-landscape" },
  { width: 1280, height: 800, label: "laptop-1280" },
  { width: 1440, height: 900, label: "laptop-1440" },
  { width: 1920, height: 1080, label: "desktop-1920" },
];

/** Expected header edge padding (matches .bawo-site-header__inner). */
function expectedEdgePad(width) {
  if (width >= 768) return 32;
  if (width >= 640) return 24;
  return 16;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function near(actual, expected, slack, label) {
  assert(
    Math.abs(actual - expected) <= slack,
    `${label}: expected ~${expected}, got ${actual.toFixed(1)} (slack ${slack})`,
  );
}

async function measureHeader(page) {
  return page.evaluate(() => {
    const header = document.querySelector("[data-bawo-header]");
    const inner = document.querySelector("[data-bawo-header-inner]");
    const bar = document.querySelector("[data-bawo-header-bar]");
    const leading = document.querySelector("[data-bawo-header-leading]");
    const actions = document.querySelector("[data-bawo-header-actions]");
    const menu = document.querySelector("[data-bawo-header-menu]");
    const pill = document.querySelector("[data-bawo-header-pill]");
    const logo = document.querySelector(".bawo-site-header__logo");
    const partner = document.querySelector("[data-bawo-header-partner]");
    const join = document.querySelector(".bawo-site-header__join-btn");
    const sticky = document.querySelector("[data-bawo-mobile-sticky]");

    if (!header || !inner || !bar || !leading || !actions || !logo) {
      return { error: "missing header nodes" };
    }

    const vw = window.innerWidth;
    const barRect = bar.getBoundingClientRect();
    const innerRect = inner.getBoundingClientRect();
    const leadingRect = leading.getBoundingClientRect();
    const actionsRect = actions.getBoundingClientRect();
    const logoRect = logo.getBoundingClientRect();
    const menuRect = menu?.getBoundingClientRect() ?? null;
    const partnerRect = partner?.getBoundingClientRect() ?? null;
    const joinRect = join?.getBoundingClientRect() ?? null;
    const stickyRect = sticky?.getBoundingClientRect() ?? null;
    const pillStyle = pill ? getComputedStyle(pill) : null;
    const menuStyle = menu ? getComputedStyle(menu) : null;
    const joinStyle = join ? getComputedStyle(join) : null;
    const stickyStyle = sticky ? getComputedStyle(sticky) : null;
    const headerStyle = getComputedStyle(header);

    const overlaps = (a, b) =>
      Boolean(a && b && !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom));

    return {
      viewportWidth: vw,
      headerHeight: parseFloat(headerStyle.minHeight) || barRect.height,
      barHeight: barRect.height,
      inner: {
        left: innerRect.left,
        right: innerRect.right,
        width: innerRect.width,
        padLeft: logoRect.left - 0, // measured vs viewport via logo
      },
      bar: { left: barRect.left, right: barRect.right, width: barRect.width },
      leading: {
        left: leadingRect.left,
        right: leadingRect.right,
        width: leadingRect.width,
      },
      actions: {
        left: actionsRect.left,
        right: actionsRect.right,
        width: actionsRect.width,
      },
      logo: { left: logoRect.left, right: logoRect.right },
      menu: menuRect
        ? {
            left: menuRect.left,
            right: menuRect.right,
            width: menuRect.width,
            height: menuRect.height,
            display: menuStyle?.display ?? null,
          }
        : null,
      partner: partnerRect
        ? { left: partnerRect.left, right: partnerRect.right, height: partnerRect.height }
        : null,
      join: join
        ? {
            display: joinStyle?.display ?? null,
            left: joinRect?.left ?? null,
            right: joinRect?.right ?? null,
            height: joinRect?.height ?? null,
          }
        : null,
      sticky: sticky
        ? {
            display: stickyStyle?.display ?? null,
            top: stickyRect?.top ?? null,
            bottom: stickyRect?.bottom ?? null,
            height: stickyRect?.height ?? null,
          }
        : null,
      pillDisplay: pillStyle?.display ?? "none",
      menuAriaExpanded: menu?.getAttribute("aria-expanded") ?? null,
      menuAriaControls: menu?.getAttribute("aria-controls") ?? null,
      gapLeadingToActions: actionsRect.left - leadingRect.right,
      logoActionsOverlap: overlaps(logoRect, actionsRect),
      partnerMenuOverlap: partnerRect && menuRect ? overlaps(partnerRect, menuRect) : false,
    };
  });
}

async function measureOpenMenuCtas(page) {
  return page.evaluate(() => {
    const panel = document.querySelector("[data-bawo-header-mobile-panel]");
    if (!panel) return { error: "panel missing" };

    const isVisible = (el) => {
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") return false;
      // Ancestors with display:none (e.g. sm+ mobile CTA wrapper)
      let node = el.parentElement;
      while (node && node !== panel) {
        if (getComputedStyle(node).display === "none") return false;
        node = node.parentElement;
      }
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };

    const texts = Array.from(
      panel.querySelectorAll("a, button, [data-bawo-menu-link]"),
    )
      .filter(isVisible)
      .map((el) => (el.textContent || "").replace(/\s+/g, " ").trim());

    const partnerMatches = texts.filter((t) => /partner/i.test(t));
    const joinMatches = texts.filter((t) =>
      /join\s*bawosocial|^\s*join\s*$/i.test(t),
    );

    const headerJoin = document.querySelector(".bawo-site-header__join-btn");
    const headerJoinVisible =
      headerJoin && getComputedStyle(headerJoin).display !== "none";

    const mobileCta = document.querySelector("[data-bawo-header-mobile-cta]");
    const mobileCtaVisible =
      mobileCta && getComputedStyle(mobileCta).display !== "none";

    const menuLinks = Array.from(
      panel.querySelectorAll("[data-bawo-menu-link]"),
    ).map((el) => el.getAttribute("data-bawo-menu-link"));

    return {
      texts,
      partnerCount: partnerMatches.length,
      joinCount: joinMatches.length,
      headerJoinVisible: Boolean(headerJoinVisible),
      mobileCtaVisible: Boolean(mobileCtaVisible),
      menuLinks,
      hasPartnerLink: menuLinks.includes("Partner with us"),
      hasJoinLink: menuLinks.some((l) => /join/i.test(l || "")),
    };
  });
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const failures = [];
  const report = [];

  try {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
      });
      try {
        await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 60000 });
        await page.waitForSelector("[data-bawo-header-bar]", { timeout: 15000 });

        const m = await measureHeader(page);
        if (m.error) {
          failures.push(`${vp.label}: ${m.error}`);
          continue;
        }

        const isDesktop = vp.width >= DESKTOP_MIN;
        const edgePad = expectedEdgePad(vp.width);
        const edgeSlack = 6;

        // No logo/actions overlap.
        assert(!m.logoActionsOverlap, `${vp.label}: logo overlaps actions`);

        // Comfortable separation.
        const minGap = isDesktop ? 24 : 40;
        assert(
          m.gapLeadingToActions >= minGap,
          `${vp.label}: leading/actions gap too small (${m.gapLeadingToActions}px)`,
        );

        // Consistent bar height (≥ 44px for tap rhythm).
        assert(
          m.barHeight >= 44,
          `${vp.label}: bar height ${m.barHeight}px < 44`,
        );

        if (isDesktop) {
          assert(
            m.pillDisplay !== "none",
            `${vp.label}: pill nav should be visible at ≥${DESKTOP_MIN}`,
          );
          assert(
            !m.menu || m.menu.display === "none",
            `${vp.label}: hamburger should be hidden at ≥${DESKTOP_MIN}`,
          );
          // Logo / actions sit on the max-width inner edges (not viewport when centered).
          near(
            m.logo.left - m.bar.left,
            0,
            edgeSlack + 2,
            `${vp.label} desktop logo vs bar left`,
          );
          near(
            m.bar.right - m.actions.right,
            0,
            edgeSlack + 2,
            `${vp.label} desktop actions vs bar right`,
          );
          // Inner uses max-width 80rem + 32px pad — actions inset from viewport ≥ pad.
          assert(
            m.viewportWidth - m.actions.right >= edgePad - 1,
            `${vp.label}: desktop actions inset too tight`,
          );
          assert(
            !m.sticky || m.sticky.display === "none",
            `${vp.label}: sticky bottom bar should be hidden`,
          );
        } else {
          assert(
            m.pillDisplay === "none",
            `${vp.label}: pill nav should collapse below ${DESKTOP_MIN}`,
          );
          assert(m.menu, `${vp.label}: hamburger missing`);
          assert(
            m.menu.display !== "none",
            `${vp.label}: hamburger should be visible below ${DESKTOP_MIN}`,
          );

          // Full-bleed: logo + hamburger within true edge padding of the viewport.
          near(m.logo.left, edgePad, edgeSlack + 4, `${vp.label} logo left inset`);
          const rightInset = m.viewportWidth - m.menu.right;
          near(rightInset, edgePad, edgeSlack, `${vp.label} hamburger right inset`);

          // Must NOT sit ~100px+ inset like a centered 960/1024 container.
          assert(
            rightInset < 48,
            `${vp.label}: hamburger inset ${rightInset.toFixed(1)}px looks container-centered`,
          );

          // 44px tap target.
          assert(
            m.menu.width >= 44 && m.menu.height >= 44,
            `${vp.label}: menu tap target ${m.menu.width}x${m.menu.height} < 44`,
          );

          assert(
            m.menu.left - m.logo.right >= minGap,
            `${vp.label}: hamburger too close to logo`,
          );
          assert(!m.partnerMenuOverlap, `${vp.label}: partner overlaps hamburger`);
          assert(
            m.menuAriaExpanded === "false",
            `${vp.label}: aria-expanded should start false`,
          );
          assert(Boolean(m.menuAriaControls), `${vp.label}: missing aria-controls`);

          // Sticky bar only below sm; must not cover header.
          if (vp.width < 640) {
            assert(
              m.sticky && m.sticky.display !== "none",
              `${vp.label}: sticky CTA should show on phone`,
            );
            assert(
              m.sticky.top >= m.barHeight,
              `${vp.label}: sticky overlaps header (sticky.top=${m.sticky.top})`,
            );
          } else if (m.sticky) {
            assert(
              m.sticky.display === "none",
              `${vp.label}: sticky should hide when header Join is visible (sm+)`,
            );
          }
        }

        let ctaNote = "n/a";
        if (!isDesktop && m.menu) {
          await page.click("[data-bawo-header-menu]");
          await page.waitForSelector("[data-bawo-header-mobile-panel]", {
            state: "visible",
            timeout: 5000,
          });
          const expanded = await page.getAttribute(
            "[data-bawo-header-menu]",
            "aria-expanded",
          );
          assert(expanded === "true", `${vp.label}: aria-expanded not true when open`);

          const ctas = await measureOpenMenuCtas(page);
          if (ctas.error) throw new Error(ctas.error);

          assert(
            !ctas.hasPartnerLink,
            `${vp.label}: Partner must not appear as a menu link`,
          );
          assert(!ctas.hasJoinLink, `${vp.label}: Join must not appear as a menu link`);
          assert(
            ctas.partnerCount === 0,
            `${vp.label}: Partner repeated in open menu (${ctas.partnerCount})`,
          );

          if (vp.width < 640) {
            assert(
              ctas.mobileCtaVisible,
              `${vp.label}: phone menu should show one Join CTA block`,
            );
            assert(
              ctas.joinCount === 1,
              `${vp.label}: expected exactly one Join in open phone menu, got ${ctas.joinCount}`,
            );
          } else {
            assert(
              !ctas.mobileCtaVisible,
              `${vp.label}: sm+ menu must not duplicate header Join CTA`,
            );
            assert(
              ctas.joinCount === 0,
              `${vp.label}: Join duplicated in open menu (${ctas.joinCount})`,
            );
          }

          ctaNote = `partner=${ctas.partnerCount} join=${ctas.joinCount} mobileCta=${ctas.mobileCtaVisible}`;

          await page.keyboard.press("Escape");
          await page.waitForSelector("[data-bawo-header-mobile-panel]", {
            state: "detached",
            timeout: 5000,
          });
          const collapsed = await page.getAttribute(
            "[data-bawo-header-menu]",
            "aria-expanded",
          );
          assert(
            collapsed === "false",
            `${vp.label}: aria-expanded not false after Esc`,
          );
        }

        const line = {
          label: vp.label,
          width: vp.width,
          logoLeft: Number(m.logo.left.toFixed(1)),
          menuRightInset: m.menu
            ? Number((m.viewportWidth - m.menu.right).toFixed(1))
            : null,
          actionsRightInset: Number((m.viewportWidth - m.actions.right).toFixed(1)),
          gap: Number(m.gapLeadingToActions.toFixed(1)),
          barHeight: Number(m.barHeight.toFixed(1)),
          edgePad,
          ctaNote,
        };
        report.push(line);
        console.log(
          `ok  ${vp.label} (${vp.width}) logoL=${line.logoLeft} menuRInset=${line.menuRightInset} actionsRInset=${line.actionsRightInset} gap=${line.gap} barH=${line.barHeight} pad=${edgePad} [${ctaNote}]`,
        );
      } catch (err) {
        failures.push(`${vp.label}: ${err.message}`);
        console.error(`FAIL ${vp.label}: ${err.message}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  console.log("\n--- measured positions ---");
  for (const row of report) {
    console.log(JSON.stringify(row));
  }

  if (failures.length) {
    console.error(`\n${failures.length} failure(s):`);
    for (const f of failures) console.error(` - ${f}`);
    process.exit(1);
  }

  console.log(`\nAll ${VIEWPORTS.length} header layout checks passed.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
