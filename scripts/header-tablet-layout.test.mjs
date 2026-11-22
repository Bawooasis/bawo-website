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

async function countVisibleCtas(page) {
  return page.evaluate(() => {
    const visible = (el) => {
      if (!el) return false;
      const style = getComputedStyle(el);
      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        Number(style.opacity) === 0
      ) {
        return false;
      }
      let node = el.parentElement;
      while (node && node !== document.body) {
        const ps = getComputedStyle(node);
        if (ps.display === "none" || ps.visibility === "hidden") return false;
        node = node.parentElement;
      }
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };

    // Header chrome only (header + sticky + open sheet) — not hero/page CTAs.
    const roots = [
      document.querySelector("[data-bawo-header]"),
      document.querySelector("[data-bawo-mobile-sticky]"),
    ].filter(Boolean);

    const candidates = roots.flatMap((root) =>
      Array.from(
        root.querySelectorAll(
          "a, button, [data-bawo-menu-link], [data-bawo-header-partner]",
        ),
      ),
    );

    const partnerEls = candidates.filter((el) => {
      const t = (el.textContent || "").replace(/\s+/g, " ").trim();
      const aria = el.getAttribute("aria-label") || "";
      return /partner/i.test(t) || /partner/i.test(aria);
    });
    const joinEls = candidates.filter((el) => {
      const t = (el.textContent || "").replace(/\s+/g, " ").trim();
      return /join\s*bawosocial/i.test(t) || /^join$/i.test(t);
    });

    const visiblePartner = partnerEls.filter(visible);
    const visibleJoin = joinEls.filter(visible);

    const pillPartner = Array.from(
      document.querySelectorAll(".bawo-site-header__pill-item"),
    ).filter((el) => /partner/i.test(el.textContent || ""));

    return {
      partnerCount: visiblePartner.length,
      joinCount: visibleJoin.length,
      partnerLabels: visiblePartner.map((el) =>
        (el.textContent || el.getAttribute("aria-label") || "")
          .replace(/\s+/g, " ")
          .trim(),
      ),
      joinLabels: visibleJoin.map((el) =>
        (el.textContent || "").replace(/\s+/g, " ").trim(),
      ),
      pillPartnerVisible: pillPartner.some(visible),
      stickyVisible: visible(document.querySelector("[data-bawo-mobile-sticky]")),
      bodyMenuOpen: document.body.classList.contains("bawo-menu-open"),
    };
  });
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
    const vh = window.innerHeight;
    const barRect = bar.getBoundingClientRect();
    const leadingRect = leading.getBoundingClientRect();
    const actionsRect = actions.getBoundingClientRect();
    const logoRect = logo.getBoundingClientRect();
    const menuRect = menu?.getBoundingClientRect() ?? null;
    const partnerRect = partner?.getBoundingClientRect() ?? null;
    const stickyRect = sticky?.getBoundingClientRect() ?? null;
    const pillStyle = pill ? getComputedStyle(pill) : null;
    const menuStyle = menu ? getComputedStyle(menu) : null;
    const joinStyle = join ? getComputedStyle(join) : null;
    const stickyStyle = sticky ? getComputedStyle(sticky) : null;

    const overlaps = (a, b) =>
      Boolean(
        a &&
          b &&
          !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom),
      );

    return {
      viewportWidth: vw,
      viewportHeight: vh,
      barHeight: barRect.height,
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

async function measureOpenPanel(page) {
  return page.evaluate(() => {
    const panel = document.querySelector("[data-bawo-header-mobile-panel]");
    if (!panel) return { error: "panel missing" };
    const rect = panel.getBoundingClientRect();
    const style = getComputedStyle(panel);
    return {
      top: rect.top,
      bottom: rect.bottom,
      height: rect.height,
      width: rect.width,
      display: style.display,
      viewportHeight: window.innerHeight,
      coversBottom: rect.bottom >= window.innerHeight - 2,
      coversNearTop: rect.top <= 80,
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

        assert(!m.logoActionsOverlap, `${vp.label}: logo overlaps actions`);

        const minGap = isDesktop ? 24 : 40;
        assert(
          m.gapLeadingToActions >= minGap,
          `${vp.label}: leading/actions gap too small (${m.gapLeadingToActions}px)`,
        );
        assert(m.barHeight >= 44, `${vp.label}: bar height ${m.barHeight}px < 44`);

        // Closed-menu CTA uniqueness
        const closedCtas = await countVisibleCtas(page);
        assert(
          !closedCtas.pillPartnerVisible,
          `${vp.label}: Partner must not appear in the desktop pill`,
        );
        assert(
          closedCtas.partnerCount === 1,
          `${vp.label} closed: expected 1 Partner, got ${closedCtas.partnerCount} (${closedCtas.partnerLabels.join("|")})`,
        );
        assert(
          closedCtas.joinCount === 1,
          `${vp.label} closed: expected 1 Join, got ${closedCtas.joinCount} (${closedCtas.joinLabels.join("|")})`,
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
          near(m.logo.left - m.bar.left, 0, edgeSlack + 2, `${vp.label} desktop logo vs bar left`);
          near(
            m.bar.right - m.actions.right,
            0,
            edgeSlack + 2,
            `${vp.label} desktop actions vs bar right`,
          );
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

          near(m.logo.left, edgePad, edgeSlack + 4, `${vp.label} logo left inset`);
          const rightInset = m.viewportWidth - m.menu.right;
          near(rightInset, edgePad, edgeSlack, `${vp.label} hamburger right inset`);
          assert(
            rightInset < 48,
            `${vp.label}: hamburger inset ${rightInset.toFixed(1)}px looks container-centered`,
          );
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

          if (vp.width < 640) {
            assert(
              m.sticky && m.sticky.display !== "none",
              `${vp.label}: sticky CTA should show on phone when menu closed`,
            );
          } else if (m.sticky) {
            assert(
              m.sticky.display === "none",
              `${vp.label}: sticky should hide when header Join is visible (sm+)`,
            );
          }
        }

        let openNote = "n/a";
        if (!isDesktop && m.menu) {
          await page.click("[data-bawo-header-menu]");
          await page.waitForSelector("[data-bawo-header-mobile-panel]", {
            state: "visible",
            timeout: 5000,
          });
          assert(
            (await page.getAttribute("[data-bawo-header-menu]", "aria-expanded")) === "true",
            `${vp.label}: aria-expanded not true when open`,
          );

          const panel = await measureOpenPanel(page);
          if (panel.error) throw new Error(panel.error);

          // Full-height sheet: reaches (near) the viewport bottom under the bar.
          const bottomGap = panel.viewportHeight - panel.bottom;
          assert(
            bottomGap <= 8,
            `${vp.label}: open menu does not cover viewport bottom (gap=${bottomGap.toFixed(1)}, bottom=${panel.bottom}, vh=${panel.viewportHeight})`,
          );
          assert(
            panel.height >= panel.viewportHeight * 0.85,
            `${vp.label}: open menu height ${panel.height.toFixed(0)} too short vs vh ${panel.viewportHeight}`,
          );
          assert(
            panel.top <= m.barHeight + 8,
            `${vp.label}: open menu top ${panel.top.toFixed(1)} should sit under the bar (barH=${m.barHeight})`,
          );

          const openCtas = await countVisibleCtas(page);
          assert(
            openCtas.bodyMenuOpen,
            `${vp.label}: body.bawo-menu-open missing while menu open`,
          );
          assert(
            !openCtas.stickyVisible,
            `${vp.label}: sticky bar must hide while menu is open`,
          );
          assert(
            openCtas.partnerCount === 1,
            `${vp.label} open: expected 1 Partner, got ${openCtas.partnerCount} (${openCtas.partnerLabels.join("|")})`,
          );
          assert(
            openCtas.joinCount === 1,
            `${vp.label} open: expected 1 Join, got ${openCtas.joinCount} (${openCtas.joinLabels.join("|")})`,
          );

          openNote = `panelH=${panel.height.toFixed(0)}/${panel.viewportHeight} partner=${openCtas.partnerCount} join=${openCtas.joinCount} sticky=${openCtas.stickyVisible}`;

          await page.keyboard.press("Escape");
          await page.waitForSelector("[data-bawo-header-mobile-panel]", {
            state: "detached",
            timeout: 5000,
          });
          assert(
            (await page.getAttribute("[data-bawo-header-menu]", "aria-expanded")) === "false",
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
          closedPartner: closedCtas.partnerCount,
          closedJoin: closedCtas.joinCount,
          openNote,
        };
        report.push(line);
        console.log(
          `ok  ${vp.label} (${vp.width}) logoL=${line.logoLeft} menuRInset=${line.menuRightInset} P/J closed=${closedCtas.partnerCount}/${closedCtas.joinCount} [${openNote}]`,
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
