import { ROUTE_PATHS } from '@/constants'

export interface NavigationItem {
  labelKey: string
  icon: string
  route: string
  exact?: boolean
}

export interface NavigationGroup {
  labelKey: string
  items: NavigationItem[]
}

export const sidebarNavigation: NavigationGroup[] = [
  {
    labelKey: 'menu.general',
    items: [
      { labelKey: 'menu.dashboard', icon: 'pi pi-home', route: ROUTE_PATHS.ROOT, exact: true },
      { labelKey: 'menu.releasePlan', icon: 'pi pi-box', route: ROUTE_PATHS.RELEASE },
      { labelKey: 'menu.myIssues', icon: 'pi pi-flag', route: ROUTE_PATHS.MY_ISSUES },
      { labelKey: 'menu.mergeRequests', icon: 'pi pi-code', route: ROUTE_PATHS.MERGE_REQUESTS },
    ],
  },
  {
    labelKey: 'menu.userSettings',
    items: [{ labelKey: 'menu.preferences', icon: 'pi pi-cog', route: ROUTE_PATHS.PREFERENCES }],
  },
]
