# 🎨 Color Harmony Generator

A fast, elegant web application for generating beautiful and precise color harmony palettes from a single base color. 
No signups, no external APIs, just instantly shareable palettes.

---

## 🔥 Features
- **Dynamic Color Wheel:** Canvas-powered interactive color wheel for smooth visual color selection.
- **HEX Input & Syncing:** Type any valid HEX code to instantly generate palettes, fully synced with your input.
- **Eyedropper Tool:** Pick colors directly from your desktop or browser window (on supported browsers).
- **Comprehensive Harmonies:** Automatically calculates mathematical color relationships:
  - **Complementary** (180° opposite)
  - **Analogous** (±30° adjacent)
  - **Triadic** (120° spacing)
  - **Split Complementary** (150° & 210°)
  - **Square** (90° spacing)
  - **Tetradic** (Double complement pairs)
  - **Monochromatic** (Detailed light and dark variants)
- **Instant Copy Feedback:** One-tap copy to clipboard for any generated swatch or specific HSL/RGB/HEX values with visual "Copied!" feedback.
- **Shareable URLs:** The active color is stored directly in your URL hash (e.g., `/#ff5733`), allowing you to easily bookmark or share your exact palettes.
- **Recent Swatches:** Automatically tracks your most recently selected colors for quick reference as you design.
- **Premium UI:** Features a sleek, responsive, frosted-glass interface that looks beautiful on any device.

---

## 🛠️ Tech Stack
- **React 19** & **Vite**: For a lightning-fast modern development environment.
- **Tailwind CSS v4**: For the responsive, glassmorphism-inspired UI and layout framework.
- **HTML Canvas API**: Used to render the highly interactive, custom color wheel algorithm.
- **Lucide React**: For crisp, minimal iconography.

---

## ⚙️ How It Works
1. Select your base color using the visual wheel, typing a HEX code, or using the built-in eyedropper tool.
2. The application's core logic converts the HEX to the HSL color space.
3. Mathematic transformations shift the Hue (H), Saturation (S), and Lightness (L) to calculate perfect design harmonies.
4. The generated swatches immediately reflect the changes, and the URL hash updates so your exact palette is instantly shareable.

> **Note:** All color calculations occur entirely client-side for maximum performance.

---

## 🔒 Privacy Focused
Because all processing is done locally via Javascript within your browser, **no data is ever sent to a server**. Your color choices remain completely private.

---

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <YOUR_REPO_URL>
   ```

2. **Navigate to the project and install dependencies:**
   ```bash
   cd color_harmony
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
