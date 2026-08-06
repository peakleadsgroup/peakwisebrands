# Peak Wise Brands — Page Instructions (for AI agents)

## Hard rules

1. **Never edit** `landertemplate.html` or `redirecttemplate.html` in place. Always **copy** a template into a new brand file, then edit the copy. You **may** update `landingpageinstructions.md` when the human asks for instruction changes (keep templates pristine).
2. **Always create both pages together** for a brand:
   - Lander → `{slug}.html` (from `landertemplate.html`)
   - Thank-you → `{slug}-redirect.html` (from `redirecttemplate.html`)
3. Replace every `[[...]]` placeholder in each copy. For **colors**, replace the hex next to the `[[24_…]]` / `[[25_…]]` comments (do not put tokens into the CSS value). For everything else, replace the `[[…]]` token itself. Search for `[[` when done — **zero** matches left in content (color comment markers may remain, or delete them after swapping hexes).
4. Do not remove Meta Pixel, Airtable tracking, or Stripe session lookup code.

| Template | Copy to |
|---|---|
| `landertemplate.html` | `{slug}.html` (e.g. `soovi.html`) |
| `redirecttemplate.html` | `{slug}-redirect.html` (e.g. `soovi-redirect.html`) |

`[[8_BRAND_SLUG]]` = lowercase slug, no spaces (hyphens ok). Must match both filenames and `images/[[8_BRAND_SLUG]]/`.

### Live brands (keep current)

| Brand | Slug | Lander | Thank-you |
|---|---|---|---|
| Nibs | `nibs` | `nibs.html` | `nibs-redirect.html` |
| Purus | `purus` | `purus.html` | `purus-redirect.html` |
| Alder | `alder` | `alder.html` | `alder-redirect.html` |
| Dan's Dry | `dans-dry` | `dans-dry.html` | `dans-dry-redirect.html` |

When you ship a new brand, add a row here.

---

## Required inputs (ask the human if missing)

Agents need these before building. **Do not ask for brand colors** — infer primary / primary-dark / secondary from the logo and packaging / hero images provided.

| Input | Required? | Notes |
|---|---|---|
| Brand display name | Yes | → `[[8_BRAND_NAME]]` |
| Brand slug | Yes (or derive) | Lowercase; → `[[8_BRAND_SLUG]]`, filenames, image folder |
| Favicon / logo (square, transparent PNG) | Yes | → `images/{slug}/` |
| Hero / packaging image | Yes | Lander hero; also used to infer colors |
| Benefit icons (×4) | Yes | Or generate simple icons that match the brand |
| All lander copy (header, bullets, subheader, buttons, section, benefits) | Yes | See placeholder map |
| Product price + short Stripe description | Yes | Used when agent creates the Payment Link (e.g. `$49.99` — box of 28 / 4-week supply) |
| Live site origin / domain | Default OK | **Default:** `https://peakwisebrands.com` unless human specifies another host |
| Thank-you / redirect **page** | Agent creates | Not a separate domain — create `{slug}-redirect.html` and point Stripe after-payment redirect there |
| Stripe Payment Link | Create if missing | See **Stripe Payment Link** below → `[[26_CHECKOUT_URL]]` |

Colors: pick hex values from the imagery (`[[24_PRIMARY_COLOR]]`, `[[24_PRIMARY_COLOR_DARK]]`, `[[25_SECONDARY_COLOR]]`) and use the **same** three on both pages.

---

## Stripe Payment Link (agents create this)

Create a **live reusable** Payment Link (not a one-time Checkout Session) when the brand does not already have one.

When creating the Payment Link for the brand, configure:

1. **Product + price** — product name = brand/offer name; amount from human; include a short description (servings / supply length) when provided.
2. **Collect shipping address** — required (thank-you page writes Street / City / State / Zip). Default allowed country: **US** unless told otherwise.
3. **Collect phone number** — required (thank-you page writes Phone).
4. **Billing address** — required when the API allows (helps complete customer details).
5. **After payment → Redirect** to the thank-you **page** (same site, not a new domain) with session id:

```
https://{LIVE_DOMAIN}/{slug}-redirect.html?session_id={CHECKOUT_SESSION_ID}
```

`{LIVE_DOMAIN}` defaults to `https://peakwisebrands.com`.

6. Put the Payment Link URL into the lander as `[[26_CHECKOUT_URL]]` (`window.CHECKOUT_URL`).

The lander appends `client_reference_id={Meta ID}` automatically so the thank-you page can update the same Airtable user and dedupe Meta Purchase.

### Example brand: Nibs (shipped)

| Field | Value |
|---|---|
| Slug | `nibs` |
| Pages | `nibs.html`, `nibs-redirect.html` |
| Price | `$49.99` (28 servings / 4-week supply) |
| Payment Link | set in `nibs.html` → `window.CHECKOUT_URL` |
| Success URL | `https://peakwisebrands.com/nibs-redirect.html?session_id={CHECKOUT_SESSION_ID}` |
| Assets | `images/nibs/` |

---

# Lander (`landertemplate.html`)

## Images

**Every brand gets its own subfolder under `images/`.** Create `images/[[8_BRAND_SLUG]]/` and put **all** of that brand’s assets there — do not leave brand images loose in `images/` or elsewhere.

```
images/
  [[8_BRAND_SLUG]]/
    [[1_FAVICON]]              ← favicon / logo (square, transparent PNG)
    [[2_HERO_IMAGE]]           ← header / hero image
    [[12_SECTION_1_BENEFIT_1_ICON]]
    [[15_SECTION_1_BENEFIT_2_ICON]]
    [[18_SECTION_1_BENEFIT_3_ICON]]
    [[21_SECTION_1_BENEFIT_4_ICON]]
```

Example for brand slug `soovi`:

```
images/soovi/favicon.png
images/soovi/hero.png
images/soovi/icon-1.png
images/soovi/icon-2.png
images/soovi/icon-3.png
images/soovi/icon-4.png
```

| Image | Specs |
|---|---|
| Favicon / logo | Square PNG, transparent background |
| Hero / header image | Top-of-page product visual (may include text/badges baked into the image). **Do not force square crop** — template uses full natural aspect with `object-fit: contain` so banners/packaging edges are not cut off. |
| Benefit icons (×4) | PNG or SVG; shown at 48×48 — keep simple and clear |

Template paths look like: `images/[[8_BRAND_SLUG]]/[[1_FAVICON]]`

## How to swap

1. **Copy** `landertemplate.html` → `{slug}.html` (never edit the template).
2. Create `images/[[8_BRAND_SLUG]]/` and add all brand images.
3. In the **copy**, search for each token (e.g. `[[1_FAVICON]]`) and replace.
4. Filenames only for image tokens — keep the `images/[[8_BRAND_SLUG]]/` prefix.
5. Search the copy for `[[` — **zero** matches left.

## Placeholder map (lander)

| # | What | Placeholder token | Where in `landertemplate.html` |
|---|---|---|---|
| 1 | Favicon filename | `[[1_FAVICON]]` | `images/[[8_BRAND_SLUG]]/[[1_FAVICON]]` |
| 2 | Hero image filename | `[[2_HERO_IMAGE]]` | `images/[[8_BRAND_SLUG]]/[[2_HERO_IMAGE]]` |
| 3 | Hero header | `[[3_HERO_HEADER]]` | `<h1>` in `.value` (and used in `<title>`) |
| 4 | Hero bullet 1 | `[[4_HERO_BULLET_1]]` | First `<li>` in `.benefits` |
| 4 | Hero bullet 2 | `[[4_HERO_BULLET_2]]` | Second `<li>` in `.benefits` |
| 4 | Hero bullet 3 | `[[4_HERO_BULLET_3]]` | Third `<li>` in `.benefits` |
| 5 | Hero subheader | `[[5_HERO_SUBHEADER]]` | `<p class="punchline">` under the bullets |
| 6 | Button 1 main text | `[[6_BUTTON_1_MAIN_TEXT]]` | Primary CTA `<a class="btn">` in `.cta-block` |
| 7 | Button 1 helper text | `[[7_BUTTON_1_HELPER_TEXT]]` | Secondary-color badge `<span class="btn-badge">` above button 1 |
| 8 | Brand name (display) | `[[8_BRAND_NAME]]` | Title, hero `alt`, footer brand + copyright, guarantee modal — replace **every** occurrence |
| 8 | Brand slug (folder / filename) | `[[8_BRAND_SLUG]]` | Image paths + must match `{slug}.html` |
| 9 | Section 1 header | `[[9_SECTION_1_HEADER]]` | `<h2>` in `.features-head` |
| 10 | Section 1 subheader | `[[10_SECTION_1_SUBHEADER]]` | `<p>` in `.features-head` |
| 11 | Benefit #1 title | `[[11_SECTION_1_BENEFIT_1_TITLE]]` | First `.feature` `<h3>` |
| 12 | Benefit #1 icon filename | `[[12_SECTION_1_BENEFIT_1_ICON]]` | `images/[[8_BRAND_SLUG]]/[[12_…]]` in first `.feature-icon` |
| 13 | Benefit #1 subheader | `[[13_SECTION_1_BENEFIT_1_SUBHEADER]]` | First `.feature` `<p>` |
| 14 | Benefit #2 title | `[[14_SECTION_1_BENEFIT_2_TITLE]]` | Second `.feature` `<h3>` |
| 15 | Benefit #2 icon filename | `[[15_SECTION_1_BENEFIT_2_ICON]]` | Second `.feature-icon` `<img>` |
| 16 | Benefit #2 subheader | `[[16_SECTION_1_BENEFIT_2_SUBHEADER]]` | Second `.feature` `<p>` |
| 17 | Benefit #3 title | `[[17_SECTION_1_BENEFIT_3_TITLE]]` | Third `.feature` `<h3>` |
| 18 | Benefit #3 icon filename | `[[18_SECTION_1_BENEFIT_3_ICON]]` | Third `.feature-icon` `<img>` |
| 19 | Benefit #3 subheader | `[[19_SECTION_1_BENEFIT_3_SUBHEADER]]` | Third `.feature` `<p>` |
| 20 | Benefit #4 title | `[[20_SECTION_1_BENEFIT_4_TITLE]]` | Fourth `.feature` `<h3>` |
| 21 | Benefit #4 icon filename | `[[21_SECTION_1_BENEFIT_4_ICON]]` | Fourth `.feature-icon` `<img>` |
| 22 | Benefit #4 subheader | `[[22_SECTION_1_BENEFIT_4_SUBHEADER]]` | Fourth `.feature` `<p>` |
| 23 | Button 2 main text | `[[23_BUTTON_2_MAIN_TEXT]]` | Bottom CTA `<a class="btn">` in `.bottom-cta` |
| 24 | Primary color | `[[24_PRIMARY_COLOR]]` | Comment beside `--primary` hex in `:root` — replace the hex |
| 24b | Primary color dark | `[[24_PRIMARY_COLOR_DARK]]` | Comment beside `--primary-dark` hex |
| 25 | Secondary color | `[[25_SECONDARY_COLOR]]` | Comment beside `--secondary` hex |
| 26 | Stripe Payment Link URL | `[[26_CHECKOUT_URL]]` | `window.CHECKOUT_URL` — full `https://buy.stripe.com/…` link |

## Colors (items 24–25)

Swap brand colors on the **hex values** in `:root` (both lander and thank-you). Search for `[[24_PRIMARY_COLOR]]` etc. — they live in comments on the same line as the hex.

```css
--primary: #5c2d91; /* [[24_PRIMARY_COLOR]] */
--primary-dark: #451f6e; /* [[24_PRIMARY_COLOR_DARK]] */
--secondary: #6bbf45; /* [[25_SECONDARY_COLOR]] */
```

Replace `#5c2d91` / `#451f6e` / `#6bbf45` with the brand hexes (inferred from logo/packaging). Do **not** put `[[…]]` tokens in the CSS value itself — that breaks the page colors.

| Role | Token (in comment) | Used for | Default example |
|---|---|---|---|
| Primary | `[[24_PRIMARY_COLOR]]` | Buttons, headings, checkmarks, footer brand, accents | `#5c2d91` |
| Primary dark | `[[24_PRIMARY_COLOR_DARK]]` | Button hover + button drop shadow | `#451f6e` |
| Secondary | `[[25_SECONDARY_COLOR]]` | Helper-text badge, guarantee / thank-you check | `#6bbf45` |

## Also update (lander)

- `<title>` and `<meta name="description">` — rewrite for the product (brand + offer). Already include `[[8_BRAND_NAME]]` / header tokens where present.
- **Guarantee modal** — title and body are fixed template copy; only `[[8_BRAND_NAME]]` inside the body is swapped. Do not invent a new guarantee unless the human asks.
- Hero header formatting: for a two-line headline with a primary-colored second line, use:

```html
<h1 class="reveal">
  First line here.
  <span class="accent">Second line here.</span>
</h1>
```

## Lander checklist

- [ ] Copied from `landertemplate.html` → `{slug}.html` (template file untouched)
- [ ] Matching `{slug}-redirect.html` created in the same pass
- [ ] Every `[[...]]` placeholder replaced (including `[[26_CHECKOUT_URL]]`)
- [ ] Colors inferred from brand imagery; same hexes on thank-you page
- [ ] `images/[[8_BRAND_SLUG]]/` exists with favicon, hero, and 4 benefit icons
- [ ] Stripe Payment Link collects shipping + phone; success URL → thank-you with `session_id={CHECKOUT_SESSION_ID}`
- [ ] Page opens and CTAs open the checkout link

---

# Redirect / Thank You (`redirecttemplate.html`)

Stripe post-purchase confirmation page. Shows fixed copy (do not change):

- **Header:** `Thank You!`
- **Subheader:** `We'll let you know as soon as the product ships`

Uses the **same brand colors** as the lander (`[[24_PRIMARY_COLOR]]`, `[[24_PRIMARY_COLOR_DARK]]`, `[[25_SECONDARY_COLOR]]`) and the brand favicon/logo from `images/[[8_BRAND_SLUG]]/`.

## Output filename

`{slug}-redirect.html` (e.g. `soovi-redirect.html`).

## Stripe success URL setup

Set on the Payment Link (see **Stripe Payment Link** above):

```
https://{LIVE_DOMAIN}/{slug}-redirect.html?session_id={CHECKOUT_SESSION_ID}
```

The page calls `/api/stripe/checkout-session?session_id=…` to load name, email, phone, and address from Stripe, then **updates** the existing Airtable Users row (matched by Meta ID).

Requires Cloudflare secrets **`STRIPE_SECRET_KEY`** and **`AIRTABLE_API_KEY`** (or `Airtable`) on the peakwisebrands Pages project.

The lander appends `client_reference_id={Meta ID}` to the checkout URL so Meta ID continuity works.

## Fixed UI copy (not placeholders)

| Element | Text |
|---|---|
| Header (`h1`) | Thank You! |
| Subheader (`p`) | We'll let you know as soon as the product ships |

## Placeholder map (redirect)

| # | What | Placeholder token | Where in `redirecttemplate.html` |
|---|---|---|---|
| 1 | Favicon / logo filename | `[[1_FAVICON]]` | `images/[[8_BRAND_SLUG]]/[[1_FAVICON]]` (tab icon + page logo) |
| 8 | Brand name (display) | `[[8_BRAND_NAME]]` | Title, alt, Airtable `Product` — replace **every** occurrence |
| 8 | Brand slug | `[[8_BRAND_SLUG]]` | Image paths |
| 24 | Primary color | `[[24_PRIMARY_COLOR]]` | Comment beside `--primary` hex (same as lander) |
| 24b | Primary color dark | `[[24_PRIMARY_COLOR_DARK]]` | Comment beside `--primary-dark` hex |
| 25 | Secondary color | `[[25_SECONDARY_COLOR]]` | Comment beside `--secondary` hex |

## Airtable write on purchase (`tblGM0stPl82MxKkv`)

On load (after Stripe session lookup when `session_id` is present):

1. Resolve **Meta ID** (Stripe `client_reference_id`, or `?meta_id=`, else new UUID).
2. **Find** the Users row where `{Meta ID}` matches (created on lander Page Load).
3. **PATCH / update** that row with checkout fields below — do **not** create a second user when the lander row exists.
4. Create a Peak Wise Actions row with `Action` = `Purchase` linked to that same user.

Only create a new Users row if no Meta ID match exists (rare edge case).

| Airtable field | Source |
|---|---|
| `ATID` | Formula — do **not** write |
| `Product` | `[[8_BRAND_NAME]]` |
| `First Name` | Stripe `customer_details` / `shipping_details` name (first word), or `?first_name=` |
| `Last Name` | Rest of name, or `?last_name=` |
| `Email` | Stripe customer email, or `?email=` |
| `Phone` | Stripe customer phone, or `?phone=` |
| `Meta ID` | Lander Meta ID via Stripe `client_reference_id`, or `?meta_id=` |
| `Street Address` | Shipping address (fallback billing), or `?street=` / `?address=` |
| `City` | Stripe address city, or `?city=` |
| `State` | Stripe address state, or `?state=` |
| `Zip` | Stripe postal code (sent as number when possible), or `?zip=` |
| `Peak Wise Actions` | Filled by linking from the Actions table |

Then create a **Peak Wise Actions** row (`tbls0h1LzvL3YKFtZ`):

| Field | Value |
|---|---|
| `Action` | `Purchase` (single select) |
| `Users` | Linked to the **same** Users row |

Query-param fallbacks (for testing without Stripe): `first_name`, `last_name`, `email`, `phone`, `street` / `address`, `city`, `state`, `zip`, `meta_id`, `session_id`.


### Thank-you idempotency (do not regress)

The thank-you page must **not** create duplicate Users / Purchase actions on refresh.

1. Prefer Stripe `session_id` as the lock key (`sessionStorage`: `pwb_purchase_done:{session_id}`).
2. In-memory flags alone are **not** enough (they reset every reload).
3. Meta ID continuity comes from lander → Payment Link `client_reference_id` → Stripe session → thank-you. It is **not** the Stripe Customer ID (`cus_…`). Missing `session_id` or `client_reference_id` makes the page mint a new Meta ID and can create extra Users rows.
4. After a successful write, mark the session complete before allowing another Airtable POST.

## Redirect checklist

- [ ] Copied from `redirecttemplate.html` → `{slug}-redirect.html` (template file untouched)
- [ ] Built together with `{slug}.html`
- [ ] Every `[[...]]` placeholder replaced (colors match the lander)
- [ ] Favicon exists in `images/[[8_BRAND_SLUG]]/`
- [ ] Payment Link: shipping + phone on; success URL includes `session_id={CHECKOUT_SESSION_ID}`
- [ ] Page shows “Thank You!” / shipping subheader
- [ ] Purchase **updates** existing Users row by Meta ID + logs `Purchase` action

---

# Shared: Meta Pixel (do not remove)

Pixel ID `1152306306722430` is already installed on both templates. Leave it as-is unless told otherwise.

| Event | When it fires | `eventID` |
|---|---|---|
| `PageView` | Lander: every page load. Thank-you: after Meta ID is finalized | Lander: `{Meta ID}`. Thank-you: `{Meta ID}_ThankYou` |
| `ViewContent` | Lander page load | `{Meta ID}_ViewContent` |
| `InitiateCheckout` | Lander: CTA 1 or CTA 2 click | `{Meta ID}_cta1` or `{Meta ID}_cta2` |
| `Purchase` | Thank-you page after Stripe (once Meta ID is resolved) | **`{Meta ID}` exactly** — must match Airtable `Meta ID` and any CAPI `event_id` for deduplication |

### Purchase deduplication (important)

On the thank-you page, `Purchase` is fired with:

```js
fbq('track', 'Purchase', { … }, { eventID: metaId });
```

Where `metaId` is the same value stored in Airtable **Meta ID** (from the lander via Stripe `client_reference_id`).

If you also send Purchase via Meta Conversions API, use that **same** string as `event_id`. Meta will dedupe browser + server events within ~48 hours when `event_name` + `event_id` match.

The thank-you page waits for Stripe session lookup before firing `Purchase`, so the Meta ID is correct before the pixel fires. It also re-inits the pixel with advanced matching (`em`, `ph`, `fn`, `ln`, `external_id`, etc.) when those fields are available.

# Shared: Airtable tracking (do not remove)

Already wired in `landertemplate.html` and `redirecttemplate.html`. Uses the same Cloudflare `/api/airtable` proxy pattern as thelocalpick / landing-pages (base `appmBb0lzqRK9dI8v`). Requires Cloudflare secret `AIRTABLE_API_KEY` or `Airtable` on the peakwisebrands Pages project. Thank-you page also needs `STRIPE_SECRET_KEY`.

On each lander visit a unique **Meta ID** (`window.PWB_META_ID`) is created and used for both the Meta pixel and Airtable. The lander passes it to Stripe as `client_reference_id` so the thank-you page can reuse it.

### Users table — `tblGM0stPl82MxKkv`

| Field | Type | Written by |
|---|---|---|
| `ATID` | Formula | Airtable only |
| `Product` | Single line text | Lander (create) + thank-you (update) |
| `First Name` | Single line text | Thank-you (update from Stripe/URL) |
| `Last Name` | Single line text | Thank-you |
| `Email` | Email | Thank-you |
| `Phone` | Phone | Thank-you |
| `Meta ID` | Single line text | Lander create; thank-you match key |
| `Street Address` | Single line text | Thank-you |
| `City` | Single line text | Thank-you |
| `State` | Single line text | Thank-you |
| `Zip` | Number | Thank-you |
| `Peak Wise Actions` | Linked record → Peak Wise Actions | Via Actions.`Users` link |

One visitor = **one Users row**: lander creates it on Page Load; thank-you **PATCHes** it on Purchase (lookup by `Meta ID`).

### Peak Wise Actions table — `tbls0h1LzvL3YKFtZ`

| Field | Type | Notes |
|---|---|---|
| `Users` | Linked record → Users | Always set when logging an action |
| `Action` | Single select | Options: `Page Load`, `Click CTA 1`, `Click CTA 2`, `Purchase` |

| When | `Action` value |
|---|---|
| Lander page load | `Page Load` |
| Lander top CTA | `Click CTA 1` |
| Lander bottom CTA | `Click CTA 2` |
| Thank-you / Stripe success | `Purchase` |

Do not rename lander CTA classes `js-checkout-1` / `js-checkout-2` or `data-cta` — they drive which Action is logged.
