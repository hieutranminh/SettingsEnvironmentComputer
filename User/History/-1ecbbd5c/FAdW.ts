import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { ClientSummary, MemberSummary } from '@/types/client-report/ClientsByPeriod'
import type { VisitingClientsRowData, VisitingMembersRowData } from '@/types/client-report/ClientsByPeriodTable'

/**
 * Composable for transforming clients by period data for table display
 */
export const useClientsByPeriodTableData = () => {
  const { t } = useI18n()

  /**
   * Transform client summary data for visiting clients table
   */
  const transformVisitingClientsData = (clientSummary: ClientSummary): VisitingClientsRowData[] => {
    if (!clientSummary) return []

    const {
      newClient = 0,
      revisitClient = 0,
      unregisteredClient = 0,
      newSale = 0,
      revisitSale = 0,
      unregisteredSale = 0,
    } = clientSummary

    const clientTotal = calculateTotal(newClient, revisitClient)
    const clientGrandTotal = calculateGrandTotal(clientTotal, unregisteredClient)
    const saleTotal = calculateTotal(newSale, revisitSale)
    const saleGrandTotal = calculateGrandTotal(saleTotal, unregisteredSale)

    return [
      createVisitingClientsRow({
        countingBasis: t('clients-by-period.label-number-of-clients'),
        new: newClient,
        revisit: revisitClient,
        total: clientTotal,
        unregistered: unregisteredClient,
        grandTotal: clientGrandTotal,
      }),
      createVisitingClientsRow({
        countingBasis: t('clients-by-period.label-number-of-sales'),
        new: newSale,
        revisit: revisitSale,
        total: saleTotal,
        unregistered: unregisteredSale,
        grandTotal: saleGrandTotal,
      }),
    ]
  }

  /**
   * Transform member summary data for visiting members table
   */
  const transformVisitingMembersData = (memberSummary: MemberSummary): VisitingMembersRowData[] => {
    if (!memberSummary) return []

    const {
      firstPurchaseClient = 0,
      repurchaseClient = 0,
      deductionClient = 0,
      firstPurchaseSale = 0,
      repurchaseSale = 0,
      deductionSale = 0,
    } = memberSummary

    const clientTotal = calculateTotal(firstPurchaseClient, repurchaseClient)
    const saleTotal = calculateTotal(firstPurchaseSale, repurchaseSale)

    return [
      createVisitingMembersRow({
        countingBasis: t('clients-by-period.label-number-of-clients'),
        firstPurchase: firstPurchaseClient,
        repurchase: repurchaseClient,
        total: clientTotal,
        deduction: deductionClient,
      }),
      createVisitingMembersRow({
        countingBasis: t('clients-by-period.label-number-of-sales'),
        firstPurchase: firstPurchaseSale,
        repurchase: repurchaseSale,
        total: saleTotal,
        deduction: deductionSale,
      }),
    ]
  }

  /**
   * Create computed properties for transformed data
   */
  const createTransformedVisitingClientsData = (clientSummary: ClientSummary) => {
    return computed(() => transformVisitingClientsData(clientSummary))
  }

  const createTransformedVisitingMembersData = (memberSummary: MemberSummary) => {
    return computed(() => transformVisitingMembersData(memberSummary))
  }

  return {
    transformVisitingClientsData,
    transformVisitingMembersData,
    createTransformedVisitingClientsData,
    createTransformedVisitingMembersData,
  }
}

// ===============================
// HELPER FUNCTIONS
// ===============================

/**
 * Calculate total from two numbers
 */
const calculateTotal = (value1: number, value2: number): number => {
  return value1 + value2
}

/**
 * Calculate grand total from total and additional value
 */
const calculateGrandTotal = (total: number, additional: number): number => {
  return total + additional
}

/**
 * Create visiting clients row data
 */
const createVisitingClientsRow = (data: VisitingClientsRowData): VisitingClientsRowData => {
  return {
    countingBasis: data.countingBasis,
    new: data.new,
    revisit: data.revisit,
    total: data.total,
    unregistered: data.unregistered,
    grandTotal: data.grandTotal,
  }
}

/**
 * Create visiting members row data
 */
const createVisitingMembersRow = (data: VisitingMembersRowData): VisitingMembersRowData => {
  return {
    countingBasis: data.countingBasis,
    firstPurchase: data.firstPurchase,
    repurchase: data.repurchase,
    total: data.total,
    deduction: data.deduction,
  }
}
