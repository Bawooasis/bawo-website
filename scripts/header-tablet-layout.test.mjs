/**
 * Asserts SiteHeader geometry at iPad/tablet widths without screenshots.
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
  { width: 743, height: 1133, label: "just-below-744-portrait" },
  { width: 744, height: 1133, label: "ipad-mini-portrait" },
  { width: 768, height: 1024, label: "ipad-portrait" },
  { width: 820, height: 1180, label: "ipad-air-portrait" },
  { width: 834, height: 1194, label: "ipad-pro-11-portrait" },
  { width: 1023, height: 1366, label: "just-below-1024" },
  { width: 1024, height: 1366, label: "ipad-pro-12-portrait" },
  { width: 1024, height: 768, label: "ipad-landscape" },
  { width: 1180, height: 820, label: "ipad-air-landscape" },
  { width: 1279, height: 800, label: "just-below-xl" },
  { width: 1280, height: 800, label: "xl-desktop" },
  { width: 1281, height: 800, label: "just-above-xl" },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function measureHeader(page) {
  return page.evaluate(() => {
    const header = document.querySelector("[data-bawo-header]");
    const bar = document.querySelector("[data-bawo-header-bar]");
    const leading = document.querySelector("[data-bawo-header-leading]");
    const actions = document.querySelector("[data-bawo-header-actions]");
    const menu = document.querySelector("[data-bawo-header-menu]");
    const pill = document.querySelector("[data-bawo-header-pill]");
    const logo = document.querySelector(".bawo-site-header__logo");

    if (!header || !bar || !leading || !actions || !logo) {
      return { error: "missing header nodes" };
    }

    const barRect = bar.getBoundingClientRect();
    const leadingRect = leading.getBoundingClientRect();
    const actionsRect = actions.getBoundingClientRect();
    const logoRect = logo.getBoundingClientRect();
    const menuRect = menu?.getBoundingClientRect() ?? null;
    const pillStyle = pill ? getComputedStyle(pill) : null;
    const menuStyle = menu ? getComputedStyle(menu) : null;

    return {
      viewportWidth: window.innerWidth,
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
            display: menuStyle?.display ?? null,
          }
        : null,
      pillDisplay: pillStyle?.display ?? "none",
      menuAriaExpanded: menu?.getAttribute("aria-expanded") ?? null,
      menuAriaControls: menu?.getAttribute("aria-controls") ?? null,
      gapLeadingToActions: actionsRect.left - leadingRect.right,
    };
  });
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const failures = [];

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
        const edgeSlack = 24;

        // Logo stays on the far left of the bar.
        assert(
          m.logo.left - m.bar.left < edgeSlack,
          `${vp.label}: logo not near left edge (logo.left=${m.logo.left}, bar.left=${m.bar.left})`,
        );

        // Actions cluster flush to the right.
        assert(
          m.bar.right - m.actions.right < edgeSlack,
          `${vp.label}: actions not near right edge (bar.right=${m.bar.right}, actions.right=${m.actions.right})`,
        );

        // Comfortable separation — never crowded against the logo.
        const minGap = isDesktop ? 24 : 48;
        assert(
          m.gapLeadingToActions >= minGap,
          `${vp.label}: leading/actions gap too small (${m.gapLeadingToActions}px < ${minGap}px)`,
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
          // Hamburger is the rightmost control in the actions cluster.
          assert(
            m.bar.right - m.menu.right < edgeSlack + 4,
            `${vp.label}: hamburger not at far right (menu.right=${m.menu.right}, bar.right=${m.bar.right})`,
          );
          // Hamburger must not sit beside the logo (mid/near-logo placement).
          assert(
            m.menu.left - m.logo.right >= minGap,
            `${vp.label}: hamburger too close to logo (gap=${m.menu.left - m.logo.right}px)`,
          );
          assert(
            m.menuAriaExpanded === "false",
            `${vp.label}: aria-expanded should start false`,
          );
          assert(
            Boolean(m.menuAriaControls),
            `${vp.label}: menu button missing aria-controls`,
          );
        }

        // Mobile menu open/close + Esc + aria-expanded (tablet/phone only).
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

        console.log(`ok  ${vp.label} (${vp.width}x${vp.height}) gap=${m.gapLeadingToActions.toFixed(1)}px`);
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
