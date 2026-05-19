import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Routes publiques (pas besoin d'etre connecte)
    const publicRoutes = [
        '/login',
        '/sign-up',
        '/api/auth',
        '/images',
        '/_next',
        '/favicon.ico',
    ]

    const isPublicRoute = publicRoutes.some(route =>
        pathname.startsWith(route)
    )

    // Si c'est une route publique, laisser passer
    if (isPublicRoute) {
        return NextResponse.next()
    }

    // Verifier une session Better Auth valide (pas juste la presence d'un cookie)
    const session = await auth.api.getSession({
        headers: request.headers,
    })

    if (!session?.user?.id) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
