Add the existing `/nera-ai` landing page as a standalone top-level item in the main navigation menu.

### What to change

- `src/components/Nav.tsx`: Insert `{ label: "NERA AI", href: "/nera-ai" }` into the `navLinks` array.
- Place it between "Devices" and "Programmes" (desktop + mobile).

### Result

Users will see "NERA AI" in the top nav bar, linking directly to the premium landing page. No other changes needed — the route already exists.