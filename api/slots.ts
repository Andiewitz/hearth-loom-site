import { app } from '../src/server/app'

// GET /api/slots?date=YYYY-MM-DD
export default {
  fetch: (request: Request) => app.fetch(request),
}
