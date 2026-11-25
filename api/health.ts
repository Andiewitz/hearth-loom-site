import { app } from '../src/server/app'

// GET /api/health
export default {
  fetch: (request: Request) => app.fetch(request),
}
