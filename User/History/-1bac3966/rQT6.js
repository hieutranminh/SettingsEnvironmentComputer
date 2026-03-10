// Utilities
import salesUtils from 'Utils/sales-utils.js'

// Models
import Model from 'Models/index'

// Constants
import { options } from 'OptionsHelpers'

export default class ClientPrepaidCard extends Model {
  id = 0
  shopId = 0
  balance = 0
  chainId = 0
  clientId = 0
  shopName = ''
  salesPrice = 0
  clientName = ''
  salesAmount = 0
  expiryDateTS = 0
  branchNumber = 0
  clientShopId = 0
  prepaidCardId = 0
  isExpired = false
  initialBalance = 0
  prepaidCardType = 0
  clientShopName = ''
  prepaidCardName = ''
  invoiceDateTimeTS = 0
  discountForService = 0
  discountForProduct = 0
  discountForClient = false
  isHeadquarterGoods = false
  isCustomizePrepaidGoods = false

  get isNoLimit() {
    return this.expiryDateTS === options.enum_no_limit
  }

  get status() {
    const isCardEmptyBalance = this.balance <= 0
    const isCardExpired = salesUtils.isExpiredCard(this.expiryDateTS)

    const isCardInactive = (() => {
      if (this.prepaidCardType === options.prepaid_card_type.deposit_card) {
        return isCardExpired || isCardEmptyBalance
      }

      if (this.prepaidCardType === options.prepaid_card_type.discount_card) {
        return isCardExpired
      }

      return false
    })()

    return isCardInactive ? options.good_status.inactive : options.good_status.active
  }

  /**@overrite */
  static fields = [
    ['id', 'id'],
    ['shopId', 'shopId'],
    ['balance', 'balance'],
    ['chainId', 'chainId'],
    ['clientId', 'clientId'],
    ['shopName', 'shopName'],
    ['isExpired', 'isExpired'],
    ['salesPrice', 'salesPrice'],
    ['clientName', 'clientName'],
    ['salesAmount', 'salesAmount'],
    ['expiryDateTS', 'expiryDateTS'],
    ['branchNumber', 'branchNumber'],
    ['clientShopId', 'clientShopId'],
    ['prepaidCardId', 'prepaidCardId'],
    ['initialBalance', 'initialBalance'],
    ['clientShopName', 'clientShopName'],
    ['prepaidCardType', 'prepaidCardType'],
    ['prepaidCardName', 'prepaidCardName'],
    ['invoiceDateTimeTS', 'invoiceDateTimeTS'],
    ['discountForClient', 'discountForClient'],
    ['discountForService', 'discountForService'],
    ['discountForProduct', 'discountForProduct'],
    ['isHeadquarterGoods', 'isHeadquarterGoods'],
    ['isCustomizePrepaidGoods', 'isCustomizePrepaidGoods'],
  ]
}
