
import {NextRequest} from 'next/server';

/**
 * These rewrites are used to pass the session cookie to the server-side
 * actions. This is necessary because the browser does not send cookies
 * with `fetch` requests by default.
 */
export const headerRewrites = [
  {
    source: '/:path*',
    has: [
      {
        type: 'header',
        key: 'x-action',
        value: 'true',
      },
      {
        type: 'cookie',
        key: 'session',
      },
    ],
    destination: '/:path*',
  },
];

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-action', 'true');
  const session = request.cookies.get('session')?.value;
  if (session) {
    requestHeaders.set('x-session-cookie', session);
  }
}
