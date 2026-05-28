import { ROUTE_TITLES } from '../data/navigation'

export function getRouteTitle(pathname) {
  if (pathname.startsWith('/meetings/') && pathname !== '/meetings') {
    return 'Meeting Details'
  }
  return ROUTE_TITLES[pathname] ?? 'Dashboard'
}
