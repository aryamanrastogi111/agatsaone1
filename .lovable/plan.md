
## Cursor Glow Tracker Effect

### What we're building
A soft radial glow that follows the user's cursor across the entire EasyTouch+ page hero section. It will be a very faint, blurred teal/cyan orb (~300–400px wide) that smoothly tracks mouse movement using `framer-motion`'s `useMotionValue` and `useSpring` for a buttery lag effect.

### How it works
- Track `mousemove` on the hero section container using a `useEffect` event listener
- Use `framer-motion`'s `useMotionValue` for raw x/y coordinates
- Apply `useSpring` with low stiffness for a smooth, slightly-delayed follow effect
- Render a `motion.div` absolutely positioned inside the hero with:
  - `pointer-events-none` so it never blocks clicks
  - `bg-teal-300/20` radial gradient
  - `blur-3xl` for the soft glow
  - `w-80 h-80` (~320px diameter)
  - `translate(-50%, -50%)` to centre on cursor

### Changes
Only `src/pages/products/EasyTouchPlusProduct.tsx`:
1. Import `useMotionValue`, `useSpring` from `framer-motion`
2. Add `useState` for tracking whether mouse is in the hero (fade in/out the glow)
3. Create `cursorX` / `cursorY` motion values + spring-smoothed versions
4. Add `onMouseMove` handler on the hero `<section>` that updates the values
5. Insert the glow `motion.div` as the first child inside the hero section, absolutely positioned

```text
<section onMouseMove={handleMouseMove} className="relative ...">
  {/* Cursor glow orb */}
  <motion.div
    className="pointer-events-none absolute w-80 h-80 rounded-full bg-teal-300/20 blur-3xl -translate-x-1/2 -translate-y-1/2"
    style={{ left: springX, top: springY, opacity: glowOpacity }}
  />
  ...existing content...
</section>
```

### Spring config
`stiffness: 120, damping: 20` — gives a subtle lag that feels premium, not jittery.
