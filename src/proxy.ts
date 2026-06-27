import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Exclude asset files, API routes, and Next.js internal paths from rewrites
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  // 2. Extract hostname and check for subdomain
  const hostname = request.headers.get('host') || request.nextUrl.host
  const cleanHost = hostname.split(':')[0]

  // Determine base host (e.g. localhost or projectminimo.com)
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  let baseHost = 'localhost'
  try {
    baseHost = new URL(serverUrl).hostname
  } catch (e) {
    // Fallback if URL is invalid
  }

  let subdomain: string | null = null

  if (cleanHost !== baseHost) {
    if (cleanHost.endsWith(`.${baseHost}`)) {
      subdomain = cleanHost.slice(0, -(baseHost.length + 1))
    } else if (cleanHost.endsWith('.localhost')) {
      subdomain = cleanHost.slice(0, -10)
    } else {
      // General subdomain fallback
      const parts = cleanHost.split('.')
      if (cleanHost.endsWith('.localhost') && parts.length > 1) {
        subdomain = parts.slice(0, -1).join('.')
      } else if (parts.length > 2) {
        subdomain = parts.slice(0, -2).join('.')
      }
    }
  }

  // 3. Routing rules based on subdomain
  if (subdomain) {
    // If the subdomain is admin, rewrite the internal URL to /admin
    if (subdomain === 'admin') {
      const url = request.nextUrl.clone()
      if (!pathname.startsWith('/admin')) {
        url.pathname = `/admin${pathname}`
      }
      return NextResponse.rewrite(url)
    }

    // If it's another subdomain, rewrite the internal path to /sites/[subdomain]${pathname}
    const url = request.nextUrl.clone()
    url.pathname = `/sites/${subdomain}${pathname}`
    return NextResponse.rewrite(url)
  }

  // 4. If request is for main site (no subdomain)
  // If request is for the main site and accesses /dashboard, let it pass through
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  // All other main site requests pass through normally
  return NextResponse.next()
}

// Config to specify matching paths
export const config = {
  matcher: [
    '/((?!api/|_next/static|_next/image|assets/|favicon.ico|favicon.png|robots.txt|sitemap.xml|manifest.json).*)',
  ],
}
