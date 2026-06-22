In `src/components/Nav.tsx`:

- Remove the standalone `Pricing` link from `navLinks`.
- Move `Partner with Us` out of the `For Providers` dropdown into a top-level link `{ label: "Partner with Us", href: "/partner-with-us" }`.

No other files affected. Mobile + desktop menus both render from `navLinks`, so they update together.