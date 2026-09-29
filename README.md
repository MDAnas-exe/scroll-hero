# Scroll-Driven Hero Section (Next.js + GSAP + Tailwind CSS)

A high-performance, responsive, scroll-driven hero section inspired by automotive engineering. Built with **Next.js (App Router)**, **Tailwind CSS**, and **GSAP ScrollTrigger** (`useGSAP`).

**Live:** `<URL>`

---

## 🏎️ Features & Architecture

### 1. Pinned Scroll-Driven Sequence (Scrub-Based)
* **Pinned Viewport**: The hero section pins (`pin: true`) and scrubs (`scrub: 1`) smoothly on scroll.
* **Inline SVG Sports Car**: Translates along the X-axis (`transform: translateX(...)`) across the road track with `will-change: transform`. Starts at `x = 0` and exits fully outside the right edge, smoothly clipped by the road container's `overflow-hidden`.
* **Dynamic Trail Effect**: Scales directly behind the car using `transform: scaleX(...)` with `transform-origin: left`. Its right edge cleanly tracks the car's rear.
* **Whole-Car Pass Letter Reveal**: Headline `"W E L C O M E   I T Z F I Z Z"` features each character in its own `<span>`. A letter illuminates only after the **WHOLE car has passed it** (car's rear edge crosses the letter's cached center X: `currentCarX >= letterCenterX`). Scrolling backwards smoothly un-reveals the letters.
* **Scrub Lag Mitigation**: The letter update loop is encapsulated in an `updateLetters` function called on both `onUpdate` and `onScrubComplete`. An `activeStates[]` cache prevents redundant DOM operations, ensuring trailing letters never get stuck unlit during fast scrolls.

### 2. Time-Based Load Animation
* **Headline Letters**: Staggered fade-in to base dormant state (`opacity: 0.25`, `power3.out`).
* **Stat Boxes**: 4 metric cards appear one-by-one with 0.15s stagger (`power3.out`).
* **Road & Car**: Fade in smoothly before the scroll phase begins.
* **FOUC Prevention**: Initial `opacity-0` utility classes applied to prevent any load flash before GSAP initializes.

### 3. Dynamic Scroll Distance (Never Fixed 200vh)
* Scroll travel distance is dynamically computed from road width:
  $$\text{travelDistance} = \text{road.clientWidth}$$
* Recalculates dynamically on window resize and font load via `invalidateOnRefresh: true` and `end: () => "+=" + travelDistance * 1.5`.

### 4. Zero Layout Thrashing & 60fps Performance
* **Zero reflows**: Animates **strictly** `transform` (`x`, `y`, `scaleX`) and `opacity`.
* **Cached Measurements**: `roadRect` and letter coordinates are measured **strictly once** inside ScrollTrigger's `refreshInit` callback, **never** inside the high-frequency scroll loop.
* **Font-Ready Refresh**: Automatically triggers `ScrollTrigger.refresh()` after `document.fonts.ready` resolves to ensure 100% accurate text bounding boxes.
* **Refresh Reset**: On refresh, `active[]` resets to false and letter classes/opacity cleanly revert to their dim state.

### 5. Responsive Mobile Experience
* Handled cleanly via `gsap.matchMedia()`:
  * **Desktop & Tablet (`>= 768px`)**: Full interactive car, trail, pinned scrub sequence (`end: "+=travelDistance * 1.5"`), telemetry labels, scroll hint, and 4-column metric cards (`grid-cols-2 md:grid-cols-4`).
  * **Mobile (`< 768px`)**: Features an optimized pinned scrub sequence (`pin: true`, `end: "+=100%"`, `scrub: 1`). The road track (`h-14`) and scaled sports car (`w-20`) drive across the viewport with the glowing trail. Letters light identically to desktop when the car's rear edge passes each letter's center (`currentCarX >= letterCenterX`), while telemetry labels and scroll hint stay hidden to conserve mobile screen space.

---

## 📁 Project Structure

```text
scroll-hero/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions CI/CD workflow for GitHub Pages
├── app/
│   ├── globals.css           # Tailwind CSS imports & base styles
│   ├── layout.jsx            # Next.js root layout with Geist fonts
│   └── page.jsx              # Main page rendering Hero and showcase section
├── components/
│   ├── Car.jsx               # Inline SVG hypercar with forward headlight beam
│   ├── Hero.jsx              # Pinned GSAP ScrollTrigger hero section
│   └── StatBox.jsx           # Metric card component with responsive Tailwind styling
├── public/
│   └── .nojekyll             # Prevents GitHub Pages from ignoring _next directories
├── jsconfig.json             # Path alias configuration (@/* -> ./*)
├── next.config.mjs           # Static export & conditional basePath config
├── package.json              # Scripts & dependencies
└── README.md
```

---

## 🛠️ Stack

* **Framework**: Next.js (App Router, JavaScript `.jsx`)
* **Styling**: Tailwind CSS
* **Animation**: GSAP + ScrollTrigger + `@gsap/react` (`useGSAP`)
* **Deployment Target**: GitHub Pages (`output: 'export'`)
* **Dependencies**: Zero external scroll libraries (no Lenis, no Framer Motion, no Locomotive).

---

## 🚀 Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note on `basePath`**: In development (`NODE_ENV !== 'production'`), the app runs seamlessly at root `/`. When built for production, `basePath` and `assetPrefix` automatically configure to `/scroll-hero` for GitHub Pages.

---

## 📦 Production Build & Static Export

To verify the static HTML export:

```bash
npm run build
```
This generates the standalone static build inside the `out/` directory.

---

## 🌐 Deploying to GitHub Pages

### Option 1: Automatic Deployment via GitHub Actions (Recommended)
This repository includes a pre-configured workflow at `.github/workflows/deploy.yml`:
1. Push your repository to GitHub (`main` or `master` branch).
2. In your repository on GitHub, navigate to:
   **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Every push will automatically build and publish the static site to:
   `https://<your-username>.github.io/scroll-hero/`

### Option 2: Deploy using the `gh-pages` CLI
Run the automated predeploy & deploy script:
```bash
npm run deploy
```
This script compiles the static export (`npm run build`) and publishes the `out/` directory directly to the `gh-pages` branch with `.nojekyll` and dotfiles included.
