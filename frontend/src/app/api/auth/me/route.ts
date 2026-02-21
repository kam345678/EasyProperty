import { NextRequest, NextResponse } from 'next/server'

function parseJwt(token: string | undefined) {
  if (!token) return null
  try {
    const [, payload] = token.split('.')
    const decoded = Buffer.from(payload, 'base64').toString('utf8')
    return JSON.parse(decoded)
  } catch (e) {
    return null
  }
}

export async function GET(req: NextRequest) {
  const access = req.cookies.get('access_token')?.value

  const payload = parseJwt(access)

  if (!payload) {
    return NextResponse.json({ ok: false, user: null })
  }

  // return minimal user info from token payload
  const user = {
    id: payload.sub ?? payload.id,
    name: payload.name ?? payload.username ?? null,
    email: payload.email ?? null,
  }

  return NextResponse.json({ ok: true, user })
}
