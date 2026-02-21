import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL || 'http://localhost:4000'

export async function GET(req: NextRequest) {
  // Call backend refresh endpoint which should validate refresh_token cookie and return new tokens
  const resp = await fetch(`${BACKEND}/auth/refresh`, {
    method: 'GET',
    headers: { accept: 'application/json' },
    credentials: 'include',
  })

  let data: any = {}
  try {
    data = await resp.json()
  } catch (e) {
    try {
      const txt = await resp.text()
      data = { message: txt }
    } catch (e2) {
      data = {}
    }
  }
  const { access_token, refresh_token, user } = data || {}

  const res = NextResponse.json({ ok: resp.ok, user: user ?? null })

  if (access_token) {
    res.cookies.set('access_token', access_token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 15,
    })
  }

  if (refresh_token) {
    res.cookies.set('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    })
  }

  return res
}
