# Workspace Guidelines for Antigravity

## UI & Frontend Stack Rules

When building or modifying UI components, Antigravity MUST adhere to the following UI stack standards:

### 1. Component Library & Styling
- **shadcn/ui Pattern**: Use `shadcn/ui` primitives built on Radix UI (`@radix-ui/react-*`), `class-variance-authority` (cva), `clsx`, and `tailwind-merge`.
- **Tailwind CSS**: Use Tailwind CSS for all utility styling (`dark:` variant support, flexbox/grid layouts, responsive breakpoints).
- **Icons**: Always use `lucide-react` for clean, modern icon sets.
- **Animations**: Use `framer-motion` for fluid page transitions, dropdown/modal overlays, and micro-interactions.

### 2. UI Component Architecture
- Place reusable shadcn UI primitives inside `src/components/ui/` (e.g., `button.tsx`, `dialog.tsx`, `card.tsx`, `badge.tsx`, `tabs.tsx`).
- Combine utility classes using `cn()` helper (`clsx` + `tailwind-merge`).
- Support both **Light** and **Dark** themes seamlessly using Tailwind `dark:` variants.

### 3. Design Aesthetics & Quality
- **Color Palette**: Curated dark modes (`dark:bg-slate-900`, `dark:bg-slate-950`, `dark:border-slate-800`), vibrant brand accents (Blue/Sky/Indigo), and crisp status indicators (Emerald for compliant, Rose for violation, Amber for review).
- **Typography**: Inter / Sans-serif clean typography hierarchy.
- **Interactive Feedback**: Hover states, smooth active states, subtle backdrops (`backdrop-blur-xs`), and toasts/notifications.
