import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    const isPublicPath = path === '/login' || path === '/signup'

    const token = request.cookies.get('token')?.value || "";

    if(isPublicPath && token){
        return NextResponse.redirect(new URL('/ide',request.nextUrl))
    }
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/ide'
  ],
}