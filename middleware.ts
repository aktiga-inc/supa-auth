import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'
import { UNAUTHENTICATED_ROUTES } from './utils/appRoutes'

export async function middleware(request: NextRequest) {
  const { supabase, response } = await createClient(request)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !isAllowedPath(request)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

const isAllowedPath = (request: NextRequest) => {
  return UNAUTHENTICATED_ROUTES.some(
    (path) => request.nextUrl.pathname === path,
  )
}
