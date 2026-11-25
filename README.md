# Interior design studio

Hearth & Loom: a service-led interior design studio site. A full-bleed hero
with the wordmark set huge across the photograph, an intro collage, fixed-fee
packages, a room-by-room portfolio with an ideas board, a five-phase process,
a style quiz, the team, and a four-step consultation booking flow.

Screens: home, services and packages (with a fee estimator), portfolio (filter
by room, save to the ideas board), project pages (room by room, palette, a
before and after slider), process, style quiz (result saved on the device),
the studio and team, booking, ideas board, a 404 and the live style guide at
`/styleguide`.

## Run it

```sh
bun install
bun run dev        # http://localhost:5319 (Vite, with /api served in-process)
bun run build      # dist/ (static site)
```

## Edit it

- `src/content.ts` holds every string, price, package, project, room, quiz
  question and team member. Start there.
- Photography: every image goes through `IMAGES` in `src/content.ts`. The
  files in `public/images/` were generated for this template; replace them with
  your own photographs (same names) or point the keys at your CDN.
- `src/styles.css` holds the design tokens (colours, type, radii, shadows,
  motion). `/styleguide` renders all of them with the real components; link it
  from the footer.
- `src/components/` is the design system; `src/pages/` are the screens.
- State lives in `localStorage` (`src/lib/store.ts`): the ideas board and its
  notes, the quiz result, the booking draft and the confirmed booking.

## API routes

`src/server/app.ts` validates with the same rules as the forms
(`src/shared/validation.ts`). It runs two ways: in-process through
`scripts/dev-api.ts` during `bun run dev`, and as the Vercel Functions in `api/`
when deployed.

| Route | Does |
| --- | --- |
| `GET /api/health` | `{ ok: true }` |
| `GET /api/slots?date=YYYY-MM-DD` | Open consultation times for that day (400 on a bad date) |
| `POST /api/bookings` | Validates a booking: 201 with a reference, 422 with field errors, 409 if the time is taken |
| `POST /api/subscribe` | Newsletter email: 201 or 422 |

Nothing is stored server-side. Connect `/api/bookings` to email, a CRM or a
database to keep requests.

## Deploy to Vercel

Import the repo into Vercel and deploy: the **Vite** preset is detected, and
`vercel.json` sets the output to `dist` and rewrites unmatched paths to
`index.html` so client-side routes such as `/portfolio` survive a hard refresh.
The files in `api/` become Vercel Functions behind `/api/health`, `/api/slots`,
`/api/bookings` and `/api/subscribe`.

To run the deployed setup locally instead of Vite, use the Vercel CLI
(`vercel dev`); `bun run dev` already serves the same API routes.
