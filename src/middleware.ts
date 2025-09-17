import { NextRequest, NextResponse } from 'next/server'
import auth from 'basic-auth'

export function middleware(request: NextRequest) {
  // 開発環境での簡易認証
  const basicAuth = request.headers.get('authorization')
  const url = request.nextUrl.clone()

  if (!basicAuth) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    })
  }

  const authValue = basicAuth.split(' ')[1]
  const [user, pwd] = atob(authValue).split(':')

  const validUser = process.env.DEV_USERNAME || 'daiki'
  const validPassword = process.env.DEV_PASSWORD || 'secret123'

  if (user !== validUser || pwd !== validPassword) {
    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}