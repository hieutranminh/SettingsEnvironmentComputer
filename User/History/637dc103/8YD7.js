// Utilities
import Joi from 'joi'
import moment from 'moment'
import Validator from 'Validators/index.js'

export default class BookingListValidator extends Validator {
  /**
   * @override
   * @description Using with date type
   */
  schema = Joi.object({
    fromBookingDate: Joi.date().required()
      .error((errors) => {
        errors.forEach(error => error.message = this._common.i18n.t('validate-message.require', {
          field: this._common.i18n.t('clients.day'),
        }))

        return errors
      }),

    toBookingDate: Joi.date().required()
      .min(Joi.ref('fromBookingDate'))
      .custom((value, helpers) => {
        const dateRage = helpers?.state?.ancestors?.[0]

        const toDate = moment(dateRage.toBookingDate).startOf('day')
        const fromDate = moment(dateRage.fromBookingDate).startOf('day')

        if(toDate.diff(fromDate, 'months', true) > 3) {
          return helpers.message(this._common.i18n.t('validate-message.specification.date-range-can-not-exceed-3-months'))
        }

        return value
      })
      .error((errors) => {
        errors.forEach(error => {
          switch (error.code) {
            case 'date.min':
              error.message = this._common.i18n.t('validate-message.specification.from-to-time')
              break

            case 'custom':
              break

            default:
              error.message = this._common.i18n.t('validate-message.require', {
                field: this._common.i18n.t('clients.day'),
              })
              break
          }
        })

        return errors
      })
    ,
  })
    .unknown()

  /**
   * @description Using with timestamp type
   */
  schemaTS = Joi.object({
    fromBookingDateTS: Joi.date().timestamp('unix').required()
      .error((errors) => {
        errors.forEach(error => error.message = this._common.i18n.t('validate-message.require', {
          field: this._common.i18n.t('clients.day'),
        }))

        return errors
      }),

    toBookingDateTS: Joi.date().timestamp('unix').required()
      .min(Joi.ref('fromBookingDateTS'))
      .custom((value, helpers) => {
        const dateRage = helpers?.state?.ancestors?.[0]

        const toDate = moment(value).startOf('day')
        const fromDate = moment(dateRage.fromBookingDateTS).startOf('day')

        if(toDate.diff(fromDate, 'months', true) > 3) {
          return helpers.message(this._common.i18n.t('validate-message.specification.date-range-can-not-exceed-3-months'))
        }

        return value
      })
      .error((errors) => {
        errors.forEach(error => {
          switch (error.code) {
            case 'date.min':
              error.message = this._common.i18n.t('validate-message.specification.from-to-time')
              break

            case 'custom':
              break

            default:
              error.message = this._common.i18n.t('validate-message.require', {
                field: this._common.i18n.t('clients.day'),
              })
              break
          }
        })

        return errors
      })
    ,
  })
    .unknown()

  /**
   * @override
   */
  validate(data) {
    const { error } = this.schema.validate(data, { abortEarly: false })
    if(error) {
      return [...new Set(error.details.map(errorDetail => errorDetail.message))]
    }

    return []
  }
}
