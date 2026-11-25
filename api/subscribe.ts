import { app } from '../src/server/app'

// POST /api/subscribe
export default {
  fetch: (request: Request) => app.fetch(request),
}
