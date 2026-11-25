import type { Plugin } from 'vite'

// Serves /api/* in development through the same Hono app that Vercel runs, so
// `bun run dev` behaves like a deployment without needing the Vercel CLI.
export function devApi(): Plugin {
  return {
    name: 'studio-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Loosely typed so this file needs neither the Node nor the DOM type
        // packages: only the stream/response surface used below.
        const incoming = req as unknown as AsyncIterable<Uint8Array> & {
          url?: string
          method?: string
          headers: Record<string, string | string[] | undefined>
        }

        const url = incoming.url ?? '/'
        if (!url.startsWith('/api/')) return next()

        const outgoing = res as unknown as {
          statusCode: number
          setHeader(name: string, value: string): void
          end(body?: Uint8Array): void
        }

        const { app } = await server.ssrLoadModule('/src/server/app.ts')
        const body = await readAll(incoming)
        const method = incoming.method ?? 'GET'

        const response: Response = await app.fetch(
          new Request(new URL(url, 'http://localhost'), {
            method,
            headers: headersOf(incoming.headers),
            body: body && method !== 'GET' && method !== 'HEAD' ? (body as BodyInit) : undefined,
          }),
        )

        outgoing.statusCode = response.status
        response.headers.forEach((value, key) => outgoing.setHeader(key, value))
        outgoing.end(new Uint8Array(await response.arrayBuffer()))
      })
    },
  }
}

async function readAll(stream: AsyncIterable<Uint8Array>): Promise<Uint8Array | undefined> {
  const parts: Uint8Array[] = []
  let total = 0
  for await (const part of stream) {
    parts.push(part)
    total += part.byteLength
  }
  if (!total) return undefined

  const body = new Uint8Array(total)
  let offset = 0
  for (const part of parts) {
    body.set(part, offset)
    offset += part.byteLength
  }
  return body
}

function headersOf(headers: Record<string, string | string[] | undefined>): Headers {
  const out = new Headers()
  for (const [key, value] of Object.entries(headers)) {
    if (value === undefined) continue
    for (const part of Array.isArray(value) ? value : [value]) out.append(key, part)
  }
  return out
}
