import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL || 'http://localhost:4000'

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Forward credentials to backend auth endpoint
  const resp = await fetch(`${BACKEND}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    // include credentials if backend expects cookies
    credentials: 'include',
  })

  let data: any = {}
  try {
    data = await resp.json()
  } catch (e) {
    // backend returned empty or non-JSON; attempt to read text for debugging
    try {
      const txt = await resp.text()
      data = { message: txt }
    } catch (e2) {
      data = {}
    }
  }

  // Expect backend to return { access_token, refresh_token }
  const { access_token, refresh_token, user } = data || {}

  const res = NextResponse.json({ ok: resp.ok, user: user ?? null })

  if (access_token) {
    res.cookies.set('access_token', access_token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 15, // 15 minutes
    })
  }

  if (refresh_token) {
    res.cookies.set('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
  }

  return res
}
