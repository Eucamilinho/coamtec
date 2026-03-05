import { NextResponse } from 'next/server'

export function middleware(request) {
  // Para webhooks, solo pasar la request sin modificaciones
  if (request.nextUrl.pathname.startsWith('/api/webhook')) {
    console.log(`[${new Date().toISOString()}] Webhook ${request.method} request`)
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/webhook/:path*'
  ]
}