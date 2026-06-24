import { auth } from "../../../../lib/auth"
import { toNextJsHandler } from "better-auth/next-js"
import { NextRequest, NextResponse } from "next/server"

const allowedOrigins = [
    'http://localhost:8081',
    'http://10.26.128.173:8081',
    process.env.BASE_URL ?? 'http://localhost:3000',
]

function corsHeaders(origin: string | null) {
    const allowed = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0]
    return {
        'Access-Control-Allow-Origin': allowed,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
    }
}

const handler = toNextJsHandler(auth)

export async function OPTIONS(req: NextRequest) {
    const origin = req.headers.get('origin')
    return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })
}

export async function GET(req: NextRequest) {
    const origin = req.headers.get('origin')
    const res = await handler.GET(req)
    Object.entries(corsHeaders(origin)).forEach(([k, v]) => res.headers.set(k, v))
    return res
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin')
    const res = await handler.POST(req)
    Object.entries(corsHeaders(origin)).forEach(([k, v]) => res.headers.set(k, v))
    return res
}
