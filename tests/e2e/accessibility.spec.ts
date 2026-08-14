import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function expectNoSeriousViolations(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const serious = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );
  expect(serious, serious.map((violation) => `${violation.id}: ${violation.help}`).join("\n")).toEqual([]);
}

// Overlays fade in over ~220ms; axe must not sample colors mid-animation,
// or semi-transparent surfaces get blended and falsely fail contrast checks.
async function expectOverlaySettled(overlay: import("@playwright/test").Locator) {
  await expect
    .poll(() => overlay.evaluate((el) => el.getAnimations({ subtree: true }).length), { timeout: 3000 })
    .toBe(0);
}

test("showcase and modal pass automated accessibility checks", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Interfaces with/ })).toBeVisible();
  await expectNoSeriousViolations(page);

  const trigger = page.getByRole("button", { name: "Open modal" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Save this design system?" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Cancel" })).toBeFocused();
  await expectOverlaySettled(page.locator(".modal-layer"));
  await expectNoSeriousViolations(page);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("legacy library URL is the canonical page and focuses the reference section", async ({ page }) => {
  await page.goto("/library");

  await expect(page.getByRole("heading", { name: /Interfaces with/ })).toBeVisible();
  await expect(page.locator("#reference")).toBeVisible();
  await expect(page.locator(".catalog-shell")).toBeVisible();
  await expect(page.locator("#reference")).toHaveJSProperty("id", "reference");
  await expect
    .poll(() => page.locator("#reference").evaluate((element) => element.getBoundingClientRect().top), {
      timeout: 3000,
    })
    .toBeLessThan(180);

  if ((page.viewportSize()?.width ?? 1280) < 981) {
    await page.getByRole("button", { name: "Toggle sidebar" }).click();
  }
  const overview = page.locator("#main-sidebar").getByRole("link", { name: "Overview" });
  await overview.click();
  await expect(page.locator("#overview")).toBeVisible();
  await expect(overview).toHaveClass(/active/);
});

test("sidebar menus map to real sections and track the active destination", async ({ page }) => {
  test.skip(
    (page.viewportSize()?.width ?? 1280) < 981,
    "The desktop sidebar is collapsed on smaller viewports.",
  );
  await page.goto("/");
  const sidebar = page.locator("#main-sidebar");
  const hrefs = await sidebar
    .locator("nav a")
    .evaluateAll((links) =>
      links.map((link) => link.getAttribute("href")).filter((href): href is string => Boolean(href)),
    );

  for (const href of hrefs) {
    const link = sidebar.locator(`a[href$="${href}"]`);
    await link.click();
    const section = page.locator(href);
    await expect(section).toBeVisible();
    await expect(link).toHaveClass(/active/);
  }
});

test("responsive overlay gallery opens an accessible edit surface", async ({ page }) => {
  await page.goto("/#overlays");
  const gallery = page.locator('[aria-label="Responsive modal and drawer examples"]');
  await expect(gallery).toBeVisible();
  await gallery.getByRole("button", { name: "Open edit" }).click();

  const dialog = page.getByRole("dialog", { name: "Edit" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel("Module name")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("command menu traps focus and closes with Escape", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /Open command menu/ });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Command menu" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByPlaceholder("Type a command or search...")).toBeFocused();
  await expectOverlaySettled(page.locator(".command-layer"));
  await expectNoSeriousViolations(page);
  await page.keyboard.press("Shift+Tab");
  await expect
    .poll(() =>
      page.evaluate(() => document.querySelector('[role="dialog"]')?.contains(document.activeElement)),
    )
    .toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("view density controls update, persist, and support arrow keys", async ({ page }) => {
  await page.goto("/");
  const density = page.getByRole("radiogroup", { name: "View density" });
  const compact = density.getByRole("radio", { name: "Compact" });
  const comfortable = density.getByRole("radio", { name: "Comfortable" });
  const spacious = density.getByRole("radio", { name: "Spacious" });

  await expect(compact).toBeChecked();
  await comfortable.click();
  await expect(comfortable).toBeChecked();
  await expect(page.locator(".ui-kit")).toHaveClass(/density-comfortable/);

  await comfortable.press("ArrowRight");
  await expect(spacious).toBeChecked();
  await expect(spacious).toBeFocused();

  await page.reload();
  await expect(density.getByRole("radio", { name: "Spacious" })).toBeChecked();
});

test("schedule calendar changes months and selects dates", async ({ page }) => {
  await page.goto("/");
  const calendar = page.getByRole("article", { name: "Schedule calendar" });

  await expect(calendar.getByText("August 2026")).toBeVisible();
  await calendar.getByRole("button", { name: "Next calendar month" }).click();
  await expect(calendar.getByText("September 2026")).toBeVisible();

  const selectedDate = calendar.getByRole("button", { name: "2026-09-18" });
  await selectedDate.click();
  await expect(selectedDate).toHaveAttribute("aria-pressed", "true");
  await expect(selectedDate).toHaveClass(/selected/);
});

test("table row actions open a tactile action menu", async ({ page }) => {
  await page.goto("/");
  const table = page.locator(".table-panel");
  const trigger = table.getByRole("button", { name: "Actions for Control Surface" });

  await trigger.click();

  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "View" })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Edit" })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Delete" })).toHaveAttribute("data-variant", "destructive");
  await menu.getByRole("menuitem", { name: "View" }).hover();
  await expect(menu.getByRole("menuitem", { name: "View" }).locator("svg path").first()).toHaveCSS(
    "stroke",
    "rgb(159, 48, 8)",
  );
  await menu.getByRole("menuitem", { name: "Edit" }).click();
  await expect(trigger).toBeFocused();
  await expect(page.locator("[data-sonner-toast]")).toContainText("Edit module");
});

test("navigation preview controls update its mini workspace", async ({ page }) => {
  await page.goto("/");
  const preview = page.getByRole("article", { name: "Interactive navigation preview" });

  const settings = preview.getByRole("button", { name: "Settings", exact: true });
  if (await settings.isVisible()) {
    await settings.click();
    await expect(settings).toHaveAttribute("aria-current", "page");
    await expect(preview.getByText("Workspace settings")).toBeVisible();
  }

  await preview.getByRole("button", { name: "Open preview profile" }).click();
  const profileMenu = preview.getByRole("menu", { name: "Preview profile" });
  await expect(profileMenu.getByRole("menuitem", { name: "View team" })).toBeFocused();
  await profileMenu.getByRole("menuitem", { name: "View team" }).click();
  await expect(preview.getByText("Team workspace")).toBeVisible();

  await preview.getByRole("button", { name: "Search preview" }).click();
  await preview.getByRole("textbox", { name: "Search preview cards" }).fill("Members");
  const memberCard = preview.getByRole("button", { name: /Members 18/ });
  await memberCard.click();
  await expect(memberCard).toHaveAttribute("aria-pressed", "true");
  const searchPreview = preview.getByRole("button", { name: "Close preview search" });
  await searchPreview.click();
  await expect(preview.getByRole("button", { name: "Search preview" })).toBeFocused();

  const previewNotification = preview.locator(".mini-notification-button");
  await previewNotification.click();
  const notificationMenu = preview.getByRole("dialog", { name: "Preview notifications" });
  await expect(notificationMenu.getByRole("button", { name: "Mark all as read" })).toBeFocused();
  await notificationMenu.getByRole("button", { name: "Mark all as read" }).click();
  await expect(preview.getByRole("button", { name: "0 preview notifications" })).toBeVisible();
  await notificationMenu.getByRole("button", { name: "Close notifications" }).click();
  await expect(previewNotification).toBeFocused();

  await preview.getByRole("button", { name: "Collapse preview menu" }).click();
  await expect(preview).toHaveClass(/sidebar-collapsed/);
  await expect(preview).toHaveCSS("transition-duration", "0.32s");
});

test("main hamburger smoothly toggles the sidebar at every viewport", async ({ page }) => {
  await page.goto("/");
  const shell = page.locator(".ui-kit");
  const sidebar = page.locator("#main-sidebar");
  const content = page.locator(".app-column");
  const toggle = page.getByRole("button", { name: "Toggle sidebar" });

  await expect(toggle).toBeVisible();
  await expect(sidebar).toHaveCSS("transition-duration", /0\.32s/);
  await toggle.click();

  if ((page.viewportSize()?.width ?? 1280) >= 981) {
    await expect(shell).toHaveClass(/sidebar-collapsed/);
    await expect(sidebar).toHaveCSS("width", "76px");
    await expect(content).toHaveCSS("margin-left", "76px");
    await expect(sidebar.getByRole("button", { name: "Toggle sidebar" })).toBeVisible();
    await expect(sidebar.getByRole("img", { name: "Alvin de Mesa avatar" })).toBeVisible();
    await expect(sidebar.locator(".sidebar-nav")).toHaveCSS("overflow-x", "hidden");
    await toggle.click();
    await expect(shell).not.toHaveClass(/sidebar-collapsed/);
    await expect(content).toHaveCSS("margin-left", "248px");
  } else {
    await expect(sidebar).toHaveClass(/is-open/);
    await expect(sidebar.getByRole("button", { name: "Close sidebar" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(sidebar).not.toHaveClass(/is-open/);
    await expect(toggle).toBeFocused();
  }
});

test("navbar notification bell opens, reads, and dismisses its notification card", async ({ page }) => {
  await page.goto("/");
  const bell = page.locator(".notification-button");
  await bell.click();

  const card = page.getByRole("dialog", { name: "Notifications" });
  await expect(card).toBeVisible();
  await expect(card.getByRole("button", { name: "Mark all read" })).toBeFocused();
  await expect(card.getByText("Component review ready", { exact: true })).toBeVisible();
  await card.getByRole("button", { name: "Mark all read" }).click();
  await expect(page.getByRole("button", { name: "0 notifications" })).toBeVisible();

  await card.getByRole("button", { name: "Close notifications" }).click();
  await expect(card).toBeHidden();
  await expect(bell).toBeFocused();
});

test("light mode keeps action and checkbox foregrounds readable", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("kinetic-theme", "light"));
  await page.goto("/");

  const create = page.locator("#controls .button-demo-row .button-primary");
  const remove = page.locator("#controls").getByRole("button", { name: "Delete", exact: true });
  const checkbox = page.getByRole("checkbox", { name: /Launch at startup/ });

  await expect(create).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(remove).toHaveCSS("color", "rgb(255, 246, 246)");
  await expect(checkbox).toHaveCSS("color", "rgb(255, 255, 255)");
  await expectNoSeriousViolations(page);
});

test("sidebar profile menu exposes profile settings and logout", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Profile menu", exact: true });
  if ((page.viewportSize()?.width ?? 1280) < 980) {
    await page.getByRole("button", { name: "Toggle sidebar" }).click();
  }
  await expect(trigger).toBeVisible();

  await trigger.click();
  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Profile" })).toBeFocused();
  await expect(menu.getByText("Alvin de Mesa")).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Profile" })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Settings" })).toBeVisible();

  await menu.getByRole("menuitem", { name: "Settings" }).click();
  if ((page.viewportSize()?.width ?? 1280) < 980) {
    const toggle = page.getByRole("button", { name: "Toggle sidebar" });
    await expect(toggle).toBeFocused();
    await toggle.click();
    await expect(trigger).toBeVisible();
  } else {
    await expect(trigger).toBeFocused();
  }

  await trigger.click();
  const reopenedMenu = page.getByRole("menu");
  await reopenedMenu.getByRole("menuitem", { name: "Log out" }).click();
  await expect(page.getByText("Signed out", { exact: true })).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText("Logged out of the preview", { exact: true })).toBeHidden({ timeout: 10_000 });
  await page.locator(".sidebar-profile").getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("button", { name: "Profile menu", exact: true })).toBeVisible();
});

test("navbar profile avatar opens its profile card", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Navbar profile menu" });
  await trigger.click();

  const menu = page.getByRole("menu", { name: "Navbar profile" });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Profile" })).toBeFocused();
  await expect(menu.getByText("Alvin de Mesa")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(menu).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("profile card avatar can be changed from its Skeuomorphic picker", async ({ page }) => {
  await page.goto("/");
  const profileCard = page.locator(".profile-card").first();
  const trigger = profileCard.getByRole("button", { name: "Change Alvin de Mesa avatar" });
  await trigger.click();

  const picker = profileCard.getByRole("dialog", { name: "Change avatar" });
  await expect(picker).toBeVisible();
  await picker.getByRole("option", { name: "Use KM avatar" }).click();
  await picker.getByRole("button", { name: "Save avatar" }).click();
  await expect(profileCard.getByRole("img", { name: "Alvin de Mesa avatar" })).toHaveText("KM");
  await expect(trigger).toBeFocused();
});

test("collapsed sidebar profile menu hides its duplicate tooltip", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1280) < 981, "The collapsed sidebar is a desktop behavior.");
  await page.goto("/");

  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  const overview = page.locator("#main-sidebar").getByRole("link", { name: "Overview" });
  await overview.hover();
  await expect(page.locator(".sidebar-tooltip")).toHaveText("Overview");
  const trigger = page.getByRole("button", { name: "Profile menu", exact: true });
  await trigger.hover();
  await expect(page.locator(".sidebar-tooltip")).toHaveText("Profile");
  await trigger.click();

  await expect(page.getByRole("menu")).toBeVisible();
  await expect(trigger).not.toHaveAttribute("data-tooltip");
  await expect(page.locator(".sidebar-tooltip")).toHaveCount(0);
});

test("reference form primitives stay unique and use the shared controls", async ({ page }) => {
  await page.goto("/library");
  const library = page.getByLabel("Skeuomorphic component library");
  await expect(library).toBeVisible({ timeout: 10_000 });
  const formCard = library.locator('[data-slot="card"]').filter({ hasText: "Form controls" });
  await expect(formCard.getByLabel("Project name")).toHaveCSS("font-size", "14px");
  await expect(formCard.getByRole("checkbox")).toHaveCount(0);
  await expect(formCard.getByRole("switch")).toHaveCount(0);
  await expect(formCard.getByRole("radio")).toHaveCount(0);

  const completion = formCard.getByRole("slider", { name: "Completion" });
  await completion.focus();
  await completion.press("ArrowRight");
  await expect(formCard.locator("output")).toHaveText("63%");
});

test("custom popovers move focus in and restore it when closed", async ({ page }) => {
  await page.goto("/#controls");
  const controls = page.locator("#controls");

  const dateField = controls.locator(".custom-control").filter({ hasText: "Date picker" });
  const dateTrigger = dateField.getByRole("button", { name: /Date picker/i });
  await dateTrigger.click();
  const dateDialog = dateField.getByRole("dialog", { name: "Choose a date" });
  await expect(dateDialog.locator('button[role="gridcell"][tabindex="0"]')).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dateTrigger).toBeFocused();

  const timeField = controls.locator(".custom-control").filter({ hasText: "Time picker" });
  const timeTrigger = timeField.getByRole("button", { name: /Time picker/i });
  await timeTrigger.click();
  const timeDialog = timeField.getByRole("dialog", { name: "Choose a time" });
  await expect(timeDialog.locator('input[aria-label="Hour"]')).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(timeTrigger).toBeFocused();

  await timeTrigger.click();
  await timeDialog.getByRole("button", { name: "Done" }).click();
  await expect(timeTrigger).toBeFocused();

  const dateTimeField = controls.locator(".custom-control").filter({ hasText: "Date & time" });
  const dateTimeTrigger = dateTimeField.getByRole("button", { name: /Date and time picker/i });
  await dateTimeTrigger.click();
  const dateTimeDialog = dateTimeField.getByRole("dialog", { name: "Choose date and time" });
  await expect(dateTimeDialog).toBeVisible();
  await dateTimeDialog.getByRole("gridcell", { name: "2026-08-13" }).click();
  await dateTimeDialog.getByRole("button", { name: "Apply date & time" }).click();
  await expect(dateTimeTrigger).toBeFocused();

  const styleField = controls.locator(".custom-control").filter({ hasText: "Dropdown" });
  const styleTrigger = styleField.getByRole("combobox", { name: /Interface style/i });
  await styleTrigger.click();
  const styleListbox = styleField.getByRole("listbox", { name: "Interface style" });
  await expect(styleListbox.locator('[role="option"][aria-selected="true"]')).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(styleTrigger).toBeFocused();

  const framework = controls.getByRole("combobox", { name: "Framework" });
  await framework.click();
  await page.keyboard.press("Escape");
  await expect(framework).toBeFocused();

  await framework.fill("V");
  const frameworkOption = controls.getByRole("option", { name: "Vue" });
  await frameworkOption.click();
  await expect(framework).toHaveValue("Vue");
  await expect(framework).toBeFocused();
});

test("component library renders working examples inside its reference section", async ({ page }) => {
  await page.goto("/library");
  const section = page.locator("#reference");
  const library = section.getByLabel("Skeuomorphic component library");

  await expect(library).toBeVisible({ timeout: 10_000 });
  await expect(library).toHaveCSS("margin-top", "0px");
  await expect(library.locator('[data-slot="card"]')).toHaveCount(11);
  const registrySearch = library.getByRole("searchbox", { name: "Search components" });
  await registrySearch.fill("calendar");
  await expect(library.getByRole("link", { name: "Calendar content" })).toHaveAttribute("href", "#calendar");
  await registrySearch.fill("");
  await expect(page.getByText("Full shadcn-style catalog", { exact: true })).toHaveCount(0);
  await expect(page.locator(".catalog-registry-item")).toHaveCount(0);
  const boldToggle = library.getByRole("button", { name: "Bold" });
  await expect(boldToggle).toBeVisible();
  await expect(boldToggle.locator("svg")).toBeVisible();
  const disclosureCard = library.locator('[data-slot="card"]').filter({ hasText: "Disclosure & selection" });
  await expect(disclosureCard.locator('[data-slot="accordion-content"]').first()).toHaveCSS(
    "padding-top",
    "10px",
  );
  const disclosureTrigger = disclosureCard.getByRole("button", { name: "Accessible behavior" });
  await disclosureTrigger.click();
  await expect(disclosureTrigger).toHaveCSS("border-bottom-left-radius", "0px");
  await expect(disclosureTrigger).toHaveCSS("border-bottom-right-radius", "0px");

  const formCard = library.locator('[data-slot="card"]').filter({ hasText: "Form controls" });
  await expect(formCard.getByLabel("Project name")).toHaveCSS("font-size", "14px");
  await expect(formCard.locator("select")).toHaveCount(0);
  const framework = formCard.getByRole("combobox", { name: "Framework" });
  await expect(framework).toHaveCSS("font-size", "14px");
  await framework.click();
  await page.getByRole("option", { name: "Vue" }).click();
  await expect(framework).toContainText("Vue");
  const catalogEmail = library.getByRole("textbox", { name: "Email address" });
  await catalogEmail.focus();
  await expect(catalogEmail).toHaveCSS("outline-style", "none");

  const otpCard = library.locator('[data-slot="card"]').filter({ hasText: "OTP & popover" });
  await expect(otpCard.getByRole("textbox", { name: "Verification code" })).toBeVisible();
  await expect(otpCard.getByRole("button", { name: "Details" })).toBeVisible();

  const command = library.locator(".catalog-command");
  const commandBox = await command.boundingBox();
  expect(commandBox).not.toBeNull();
  expect(commandBox!.height).toBeLessThan(180);
  await expect(command.locator('[data-slot="command-input-wrapper"]')).toHaveCSS("border-top-width", "0px");
  const commandSearch = command.getByPlaceholder("Search commands...");
  await commandSearch.fill("settings");
  await expect(command.getByText("Open settings", { exact: true })).toBeVisible();
  await expect(command.getByText("Search components", { exact: true })).toHaveCount(0);

  await library.getByRole("button", { name: "Edit profile", exact: true }).click();
  const dialog = page.locator('[data-slot="dialog-content"]');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS("border-radius", "18px");
  await expect(dialog).not.toHaveCSS("box-shadow", "none");
  await expect(dialog.getByLabel("Display name")).toBeVisible();
  const readButtonMetrics = async (button: import("@playwright/test").Locator) =>
    button.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        height: style.height,
        minHeight: style.minHeight,
        paddingInline: style.paddingInline,
        borderRadius: style.borderRadius,
        fontSize: style.fontSize,
      };
    });
  const normalButtonMetrics = await readButtonMetrics(
    page.locator("#controls .button-demo-row .button-primary").first(),
  );
  expect(await readButtonMetrics(dialog.getByRole("button", { name: "Save changes" }))).toEqual(
    normalButtonMetrics,
  );
  await dialog.getByRole("button", { name: "Save changes" }).click();
  await expect(dialog).toBeHidden();

  await library.getByRole("button", { name: "Open settings" }).click();
  const sheet = page.locator('[data-slot="sheet-content"]');
  await expect(sheet).toBeVisible();
  if ((page.viewportSize()?.width ?? 1280) >= 981) {
    await expect(sheet).not.toHaveCSS("border-top-right-radius", "0px");
    await expect(sheet).not.toHaveCSS("border-bottom-right-radius", "0px");
  }
  await expect(sheet.getByText("Automatic updates", { exact: true })).toBeVisible();
  await expect(sheet.getByRole("button", { name: "Save settings" })).toBeVisible();
  expect(await readButtonMetrics(sheet.getByRole("button", { name: "Save settings" }))).toEqual(
    normalButtonMetrics,
  );
  await sheet.getByRole("button", { name: "Save settings" }).click();
  await expect(sheet).toBeHidden();

  const drawerTrigger = library.getByRole("button", { name: "Open drawer" });
  await drawerTrigger.click();
  const drawer = page.locator('[data-slot="drawer-content"]');
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("button", { name: "New project" })).toBeFocused();
  expect(await readButtonMetrics(drawer.getByRole("button", { name: "Done" }))).toEqual(normalButtonMetrics);
  expect(await readButtonMetrics(drawer.getByRole("button", { name: "New project" }))).toEqual(
    normalButtonMetrics,
  );
  await drawer.getByRole("button", { name: "Done" }).click();
  await expect(drawer).toBeHidden();
  await expect(drawerTrigger).toBeFocused();

  await expect(library.getByText("Table & structured data", { exact: true })).toHaveCount(0);
  await expect(library.getByText("Content, messages & empty states", { exact: true })).toHaveCount(0);
});

test("foundation carousel uses smooth directional transitions", async ({ page }) => {
  await page.goto("/");
  const carousel = page.locator(".carousel-card");
  const next = carousel.getByRole("button", { name: "Next slide" });
  const previous = carousel.getByRole("button", { name: "Previous slide" });

  await next.click();
  await expect(carousel.getByRole("heading", { name: "Feedback you can feel" })).toBeVisible();
  await expect(carousel.locator(".carousel-slide-next")).toHaveCSS(
    "animation-name",
    "carousel-slide-in-next",
  );

  await previous.click();
  await expect(carousel.getByRole("heading", { name: "Tactile by default" })).toBeVisible();
  await expect(carousel.locator(".carousel-slide-previous")).toHaveCSS(
    "animation-name",
    "carousel-slide-in-previous",
  );
  await expect(carousel.getByRole("button", { name: "Go to slide 1" })).toHaveAttribute(
    "aria-current",
    "true",
  );
});

test("infinite logo carousel moves continuously and can be paused", async ({ page }) => {
  await page.goto("/");
  const carousel = page.getByRole("region", { name: "Featured technologies" });
  const track = carousel.locator(".infinite-logo-track");

  await expect(track).toHaveCSS("animation-name", "infinite-logo-scroll");
  await expect(carousel.getByText("React", { exact: true }).first()).toBeVisible();
  await carousel.getByRole("button", { name: "Pause logos" }).click();
  await expect(carousel).toHaveClass(/is-paused/);
  await expect(carousel.getByRole("button", { name: "Resume logos" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("login and signup cards validate and submit", async ({ page }) => {
  await page.goto("/");
  const login = page.locator('[data-slot="auth-card"]').filter({ hasText: "Welcome back" });
  await login.getByLabel("Email address").fill("alvin@example.com");
  await login.getByLabel("Password", { exact: true }).fill("kinetic12");
  await login.getByRole("checkbox", { name: "Remember me" }).check();
  await login.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Signed in to the demo workspace")).toBeVisible();

  const signup = page.locator('[data-slot="auth-card"]').filter({ hasText: "Create your workspace" });
  await signup.getByLabel("Full name").fill("Alvin de Mesa");
  await signup.getByLabel("Email address").fill("alvin@example.com");
  await signup.getByLabel("Password", { exact: true }).fill("kinetic12");
  await signup.getByLabel("Confirm password").fill("different12");
  await signup.getByRole("checkbox", { name: "I agree to the terms" }).check();
  await signup.getByRole("button", { name: "Create account" }).click();
  await expect(signup.getByRole("alert")).toHaveText("Passwords do not match.");
});

test("forgot password card completes its email, code, and reset steps", async ({ page }) => {
  await page.goto("/");
  const card = page.locator('[data-slot="forgot-password-card"]');

  await card.getByLabel("Email address").fill("alvin@example.com");
  await card.getByRole("button", { name: "Send reset code" }).click();
  await expect(card.getByText("Verification code")).toBeVisible();

  await card.getByLabel("Verification code").fill("123456");
  await card.getByRole("button", { name: "Verify code" }).click();
  await expect(card.getByRole("textbox", { name: "New password", exact: true })).toBeVisible();

  await card.getByRole("textbox", { name: "New password", exact: true }).fill("kinetic123");
  await card.getByRole("textbox", { name: "Confirm new password", exact: true }).fill("kinetic123");
  await card.getByRole("button", { name: "Reset password" }).click();
  await expect(card.getByRole("status")).toContainText("Password reset complete");
});

test("text-bearing buttons use the shared readable type scale", async ({ page }) => {
  await page.goto("/");

  const actionSizes = await page
    .locator("#controls .button-demo-row .button")
    .evaluateAll((buttons) => buttons.map((button) => getComputedStyle(button).fontSize));
  expect(new Set(actionSizes)).toEqual(new Set(["13px"]));

  const authSizes = await page
    .locator(".auth-submit")
    .evaluateAll((buttons) => buttons.map((button) => getComputedStyle(button).fontSize));
  expect(new Set(authSizes)).toEqual(new Set(["13px"]));

  const compactSizes = await page
    .locator("#controls .button-group button")
    .evaluateAll((buttons) => buttons.map((button) => getComputedStyle(button).fontSize));
  expect(new Set(compactSizes)).toEqual(new Set(["12px"]));
});

test("shared components follow the Skeuomorphic radius scale", async ({ page }) => {
  await page.goto("/");

  const radii = await page
    .locator("#controls .button-primary, #controls .icon-button, .chat-input, .message-bubble, .panel")
    .evaluateAll((elements) => elements.map((element) => getComputedStyle(element).borderRadius));

  expect(radii).toContain("10px");
  expect(radii).toContain("18px");
  expect(radii.every((radius) => radius === "10px" || radius === "18px")).toBe(true);
});

test("only asynchronous actions expose loading states", async ({ page }) => {
  await page.goto("/");
  const create = page.locator("#controls .button-demo-row .button-primary");
  await create.click();
  await expect(create).toBeEnabled();
  await expect(create).not.toHaveAttribute("aria-busy", "true");
  await expect(page.getByText("Component created")).toBeVisible();

  await page.getByRole("button", { name: "Open component", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Save this design system?" });
  const save = dialog.getByRole("button", { name: "Save template" });
  await save.click();
  await expect(dialog.getByRole("button", { name: "Saving" })).toBeDisabled();
  await expect(dialog).toBeHidden();
  await expect(page.getByText("Template saved")).toBeVisible();
});

test("button state specimen exposes every documented state", async ({ page }) => {
  await page.goto("/");
  const specimen = page.getByRole("article", { name: "Button state system" });

  await expect(specimen.getByRole("button")).toHaveCount(10);
  await expect(specimen.getByRole("button", { name: "Creating" })).toHaveAttribute("aria-busy", "true");
  await expect(specimen.getByRole("button", { name: "Try again" })).toHaveAttribute("aria-invalid", "true");

  const live = specimen.locator(".panel-heading .button-primary");
  await live.click();
  await expect(live).toBeDisabled();
  await expect(live).toHaveAttribute("aria-busy", "true");
  await expect(page.getByText("Button state completed")).toBeVisible();
});

test("chart tooltip stays at the hovered point and clicks have no black outline", async ({ page }) => {
  await page.goto("/");
  await page.locator("#data").scrollIntoViewIfNeeded();
  const chart = page.locator(".tooltip-chart-card");
  await expect(chart).toBeVisible({ timeout: 15_000 });
  const bar = chart.locator(".recharts-bar-rectangle path").first();

  await bar.hover();
  const tooltip = chart.locator(".recharts-tooltip-wrapper");
  await expect(chart.locator(".chart-tooltip")).toBeVisible();
  await expect(tooltip).toHaveCSS("transition-duration", "0s");

  const surface = chart.locator(".recharts-surface");
  await surface.click({ position: { x: 180, y: 120 } });
  await expect(surface).toHaveCSS("outline-style", "none");
});
