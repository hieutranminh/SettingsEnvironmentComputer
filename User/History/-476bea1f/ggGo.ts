import { isEmpty, includes } from 'lodash'
export const useMenu = () => {
  const getMenuLabel = (code: string): string => {
    const labelMap: Record<string, string> = {
      SHQ_BMN_01: 'Branch Overview',
      SHQ_BMN_05: 'Branch Sales',
      SHQ_BMN_06: 'Branch Prepaid Goods',
      SHQ_BMN_07: 'Sales Total by Branch',
      SHQ_BMN_08: 'Report by Branch ádas',
      SHQ_BMN_09: 'Branches',
      SHQ_SET_01: 'Chain Logo',
      SHQ_SET_02: 'Configuration',
      SHQ_SET_03: 'System Settings',
      SHQ_SET_04: 'User Management',
      SHQ_SET_05: 'Role Management',
      SHQ_SET_06: 'Permission Settings',
      SHQ_SET_07: 'System Configuration',
      SHQ_SET_08: 'Advanced Settings',
      SHQ_SET_09: 'Backup & Restore',
      SHQ_SET_10: 'System Maintenance',
      SHQ_SUP_01: 'Contact Support',
      SHQ_SUP_02: 'FAQ',
      SHQ_SUP_03: 'Documentation',
      SHQ_SUP_04: 'Tutorial',
      SHQ_SUP_05: 'Video Guides',
      SHQ_SUP_06: 'Knowledge Base',
      SHQ_SUP_07: 'Remote Support',
      SHQ_SUP_08: 'Live Chat',
      SHQ_SUP_09: 'Help Center',
    }
    return labelMap[code] || code.replace('SHQ_', '').replace(/_/g, ' ')
  }

  const getMenuIcon = (code: string): string => {
    const iconMap: Record<string, string> = {
      SHQ_BMN_01: 'pi pi-home',
      SHQ_BMN_05: 'pi pi-chart-bar',
      SHQ_BMN_06: 'pi pi-desktop',
      SHQ_BMN_07: 'pi pi-chart-line',
      SHQ_BMN_08: 'pi pi-file',
      SHQ_BMN_09: 'pi pi-building',
      SHQ_SET_01: 'pi pi-cog',
      SHQ_SET_02: 'pi pi-home',
      SHQ_SET_03: 'pi pi-cog',
      SHQ_SET_04: 'pi pi-users',
      SHQ_SET_05: 'pi pi-shield',
      SHQ_SET_06: 'pi pi-lock',
      SHQ_SET_07: 'pi pi-cog',
      SHQ_SET_08: 'pi pi-cog',
      SHQ_SET_09: 'pi pi-database',
      SHQ_SET_10: 'pi pi-wrench',
      SHQ_SUP_01: 'pi pi-user',
      SHQ_SUP_02: 'pi pi-question-circle',
      SHQ_SUP_03: 'pi pi-book',
      SHQ_SUP_04: 'pi pi-play',
      SHQ_SUP_05: 'pi pi-video',
      SHQ_SUP_06: 'pi pi-info-circle',
      SHQ_SUP_07: 'pi pi-desktop',
      SHQ_SUP_08: 'pi pi-comments',
      SHQ_SUP_09: 'pi pi-question-circle',
    }
    return iconMap[code] || 'pi pi-circle'
  }

  const getMenuRoute = (code: string): string => {
    const routeMap: Record<string, string> = {
      SHQ_BMN_01: '/branch',
      SHQ_BMN_05: '/branch/sales',
      SHQ_BMN_06: '/branch/prepaid',
      SHQ_BMN_07: '/branch/sales-total',
      SHQ_BMN_08: '/branch/report',
      SHQ_BMN_09: '/branch/branches',
      SHQ_SET_01: '/setup',
      SHQ_SET_02: '/setup/config',
      SHQ_SET_03: '/setup/system',
      SHQ_SET_04: '/setup/users',
      SHQ_SET_05: '/setup/roles',
      SHQ_SET_06: '/setup/permissions',
      SHQ_SET_07: '/setup/system-config',
      SHQ_SET_08: '/setup/advanced',
      SHQ_SET_09: '/setup/backup',
      SHQ_SET_10: '/setup/maintenance',
      SHQ_SUP_01: '/support/contact',
      SHQ_SUP_02: '/support/faq',
      SHQ_SUP_03: '/support/docs',
      SHQ_SUP_04: '/support/tutorial',
      SHQ_SUP_05: '/support/videos',
      SHQ_SUP_06: '/support/kb',
      SHQ_SUP_07: '/support/remote',
      SHQ_SUP_08: '/support/chat',
      SHQ_SUP_09: '/support/help',
    }
    return routeMap[code] || '/'
  }

  const checkMenuRole = (menu: string[], code: string): boolean => {
    if (!Array.isArray(menu) || menu === undefined || (Array.isArray(menu) && menu.length === 0)) {
      return true
    }
    return (menu as string[]).includes(code)
  }

  return {
    getMenuIcon,
    getMenuLabel,
    getMenuRoute,
    checkMenuRole,
  }
}
