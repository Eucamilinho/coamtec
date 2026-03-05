import { NextResponse } from 'next/server'

export function middleware(request) {
  // Solo loggear las requests al webhook para debugging
  if (request.nextUrl.pathname === '/api/webhook') {
    console.log('=== MIDDLEWARE WEBHOOK DEBUG ===')
    console.log('Method:', request.method)
    console.log('URL:', request.url)
    console.log('Headers:', Object.fromEntries(request.headers.entries()))
    console.log('================================')
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/webhook/:path*'
}