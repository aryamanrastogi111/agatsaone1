# Architecture Decisions
- Publication PDFs added to page content are imported from `src/assets/publications` so Vite fingerprints and includes them in deployments.

- Keep Rhythm campaign selection and first-party interaction records in `src/lib/rhythmCampaign.ts`; campaign state must never change commerce or send health goals to advertising providers.
- Keep the Rhythm hero independent of goal selection; goal-specific benefits and linked research live in `src/data/rhythmGoals.ts` and render directly below the selector to avoid campaign-dependent banner changes.
- Keep published nutrition context and Agatsa research separate in the Rhythm research module; every study statistic must have a supplied source and its validation limits.
- Scope Rhythm editorial colors in `.rhythm-page` CSS variables so the shared Agatsa design is unchanged.
- Use supplied study counts for research graphs and original app recordings/screens for trend visuals; never invent customer measurement curves.
