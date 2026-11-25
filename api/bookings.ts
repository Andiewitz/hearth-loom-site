import { app } from '../src/server/app'

// POST /api/bookings
export default {
  fetch: (request: Request) => app.fetch(request),
}
