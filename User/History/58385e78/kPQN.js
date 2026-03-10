// Utils
import i18n from 'Translate'

// Models
import Model from 'Models/index'

// Payment method names from Backend
const PAYMENT_METHOD_NAME_TOTAL = 'TOTAL'
const PAYMENT_METHOD_NAME_OUTSTANDING = 'Outstanding'

class StaffSalesPaymentTotal extends Model {
  shopId = 0
  staffId = 0
  staffName = ''

  paymentMethodId = 0
  paymentAmountTotal = 0
  paymentMethodName = ''
  productPaymentAmount = 0
  servicesPaymentAmount = 0
  prepaidCardPaymentAmount = 0
  prepaidServicePaymentAmount = 0

  /**
   * @override
   */
  static fields = [
    ['shopId', 'shopId'],
    ['staffId', 'staffId'],
    ['staffName', 'staffName'],
    ['paymentMethodId', 'paymentMethodId'],
    ['paymentMethodName', 'paymentMethodName', { default: '' }],
    ['paymentAmountTotal', 'paymentAmountTotal', { default: 0 }],
    ['productPaymentAmount', 'productPaymentAmount', { default: 0 }],
    ['servicesPaymentAmount', 'servicesPaymentAmount', { default: 0 }],
    ['prepaidCardPaymentAmount', 'prepaidCardPaymentAmount', { default: 0 }],
    ['prepaidServicePaymentAmount', 'prepaidServicePaymentAmount', { default: 0 }],
  ]
}

export default class StaffSalesPaymentTotals extends Model {
  paymentTotals = []
  paymentTotalRow = {}

  get paymentTableRows() {
    return [
      ...this.paymentTotals,
      this.paymentTotalRow,
    ]
  }

  static getStaffPaymentTotals(payments) {
    const paymentTotals = []

    for (const payment of payments) {
      // Skip TOTAL row - it will be handled separately
      if (payment.paymentMethodName === PAYMENT_METHOD_NAME_TOTAL) {
        continue
      }

      // Handle Outstanding row (paymentMethodId = 0 and paymentMethodName = "Outstanding")
      if (!payment.paymentMethodId && payment.paymentMethodName === PAYMENT_METHOD_NAME_OUTSTANDING) {
        const hasOutstandingAmount = payment.paymentAmountTotal ||
          payment.productPaymentAmount ||
          payment.servicesPaymentAmount ||
          payment.prepaidCardPaymentAmount ||
          payment.prepaidServicePaymentAmount

        if (hasOutstandingAmount) {
          paymentTotals.push({
            ...StaffSalesPaymentTotal.build(payment),
            paymentMethodName: i18n.t('sales.outstanding-2'),
          })
        }
        continue
      }

      // Handle regular payment methods
      if (payment.paymentMethodId) {
        paymentTotals.push(StaffSalesPaymentTotal.build(payment))
      }
    }

    return paymentTotals
  }

  static getStaffPaymentTotalRow(payments) {
    const totalRow = payments.find(payment => payment.paymentMethodName === PAYMENT_METHOD_NAME_TOTAL)

    if (totalRow) {
      return {
        ...StaffSalesPaymentTotal.build(totalRow),
        paymentMethodName: i18n.t('sales.total'),
      }
    }

    // Fallback: calculate total if BE doesn't provide TOTAL row
    const staffSalesPaymentTotalRow = StaffSalesPaymentTotal.build({ paymentMethodName: i18n.t('sales.total') })

    return payments
      .filter(payment =>
        payment.paymentMethodName !== PAYMENT_METHOD_NAME_TOTAL &&
        payment.paymentMethodName !== PAYMENT_METHOD_NAME_OUTSTANDING,
      )
      .reduce((totalRowAcc, payment) => {
        totalRowAcc.paymentAmountTotal += payment.paymentAmountTotal || 0
        totalRowAcc.productPaymentAmount += payment.productPaymentAmount || 0
        totalRowAcc.servicesPaymentAmount += payment.servicesPaymentAmount || 0
        totalRowAcc.prepaidCardPaymentAmount += payment.prepaidCardPaymentAmount || 0
        totalRowAcc.prepaidServicePaymentAmount += payment.prepaidServicePaymentAmount || 0

        return totalRowAcc
      }, staffSalesPaymentTotalRow)
  }

  static fields = [
    ['paymentTotals', 'staffPaymentTotal', {
      build(paymentTotals = []) {
        return StaffSalesPaymentTotals.getStaffPaymentTotals(paymentTotals)
      },
    }],
    ['paymentTotalRow', 'staffPaymentTotal', {
      build(paymentTotals = []) {
        return StaffSalesPaymentTotals.getStaffPaymentTotalRow(paymentTotals)
      },
    }],
  ]
}
