import { useI18n } from 'vue-i18n'

import { TABLE_HEADER_CLASSES, TABLE_SPAN_CONFIG } from '@/constants'
import type { TableHeaderRowConfig } from '@/types/client-report/ClientsByPeriodTable'

/**
 * Composable for creating table configurations
 */
export const useClientsByPeriodTableConfig = () => {
  const { t } = useI18n()

  /**
   * Get header configuration for visiting clients table
   */
  const getVisitingClientsHeaderConfig = (): TableHeaderRowConfig[] => {
    return [
      {
        columns: [
          {
            field: 'countingBasis',
            header: t('clients-by-period.label-counting-basis'),
            headerClass: TABLE_HEADER_CLASSES.GRAY_BACKGROUND,
            rowspan: TABLE_SPAN_CONFIG.VISITING_CLIENTS.COUNTING_BASIS_ROWSPAN,
          },
          {
            field: 'registeredClients',
            header: t('clients-by-period.label-registered-clients'),
            headerClass: `${TABLE_HEADER_CLASSES.GRAY_BACKGROUND} ${TABLE_HEADER_CLASSES.NO_BORDER_BOTTOM}`,
            colspan: TABLE_SPAN_CONFIG.VISITING_CLIENTS.REGISTERED_CLIENTS_COLSPAN,
          },
          {
            field: 'unregistered',
            header: `${t('clients-by-period.label-unregistered-clients')} (B)`,
            headerClass: TABLE_HEADER_CLASSES.GRAY_BACKGROUND,
            rowspan: TABLE_SPAN_CONFIG.VISITING_CLIENTS.UNREGISTERED_CLIENTS_ROWSPAN,
          },
          {
            field: 'grandTotal',
            header: `${t('clients-by-period.label-grand-total')} (A + B)`,
            headerClass: TABLE_HEADER_CLASSES.GRAY_BACKGROUND,
            rowspan: TABLE_SPAN_CONFIG.VISITING_CLIENTS.GRAND_TOTAL_ROWSPAN,
          },
        ],
      },
      {
        columns: [
          {
            field: 'new',
            header: t('clients-by-period.label-new'),
            headerClass: TABLE_HEADER_CLASSES.GRAY_BACKGROUND,
          },
          {
            field: 'revisit',
            header: t('clients-by-period.label-revisit'),
            headerClass: TABLE_HEADER_CLASSES.GRAY_BACKGROUND,
          },
          {
            field: 'total',
            header: `${t('clients-by-period.label-total')}(A)`,
            headerClass: TABLE_HEADER_CLASSES.GRAY_BACKGROUND,
          },
        ],
      },
    ]
  }

  /**
   * Get header configuration for visiting members table
   */
  const getVisitingMembersHeaderConfig = (): TableHeaderRowConfig[] => {
    return [
      {
        columns: [
          {
            field: 'countingBasis',
            header: t('clients-by-period.label-counting-basis'),
            headerClass: TABLE_HEADER_CLASSES.GRAY_BACKGROUND,
            rowspan: TABLE_SPAN_CONFIG.VISITING_MEMBERS.COUNTING_BASIS_ROWSPAN,
          },
          {
            field: 'prepaidSales',
            header: t('clients-by-period.label-prepaid-goods-sales'),
            headerClass: `${TABLE_HEADER_CLASSES.GRAY_BACKGROUND} ${TABLE_HEADER_CLASSES.NO_BORDER_BOTTOM}`,
            colspan: TABLE_SPAN_CONFIG.VISITING_MEMBERS.PREPAID_SALES_COLSPAN,
          },
          {
            field: 'deduction',
            header: t('clients-by-period.label-prepaid-goods-deduction'),
            headerClass: TABLE_HEADER_CLASSES.GRAY_BACKGROUND,
            rowspan: TABLE_SPAN_CONFIG.VISITING_MEMBERS.PREPAID_DEDUCTION_ROWSPAN,
          },
        ],
      },
      {
        columns: [
          {
            field: 'firstPurchase',
            header: t('clients-by-period.label-first-purchase'),
            headerClass: TABLE_HEADER_CLASSES.GRAY_BACKGROUND,
          },
          {
            field: 'repurchase',
            header: t('clients-by-period.label-repurchase'),
            headerClass: TABLE_HEADER_CLASSES.GRAY_BACKGROUND,
          },
          {
            field: 'total',
            header: t('clients-by-period.label-total'),
            headerClass: TABLE_HEADER_CLASSES.GRAY_BACKGROUND,
          },
        ],
      },
    ]
  }

  /**
   * Get body fields for visiting clients table
   */
  const getVisitingClientsBodyFields = (): string[] => {
    return ['countingBasis', 'new', 'revisit', 'total', 'unregistered', 'grandTotal']
  }

  /**
   * Get body fields for visiting members table
   */
  const getVisitingMembersBodyFields = (): string[] => {
    return ['countingBasis', 'firstPurchase', 'repurchase', 'total', 'deduction']
  }

  return {
    getVisitingClientsHeaderConfig,
    getVisitingMembersHeaderConfig,
    getVisitingClientsBodyFields,
    getVisitingMembersBodyFields,
  }
}
