import { yupResolver } from '@primevue/forms/resolvers/yup'
import * as yup from 'yup'

import i18n from '@/plugins/i18n'

// Basic Information Form Schema - All fields are optional
export const basicInformationSchema = () => {
  const { t } = i18n.global

  return yup.object({
    shopName: yup
      .string()
      .optional()
      .min(2, t('validation_messages.shop_name.min_length', { min: 2 }))
      .max(100, t('validation_messages.shop_name.max_length', { max: 100 })),

    phoneNumber: yup
      .string()
      .optional()
      .matches(/^[+]?[\d\s\-()]{10,15}$/, t('validation_messages.phone_number.invalid')),

    postCode: yup
      .string()
      .optional()
      .matches(/^[\d\-]{5,10}$/, t('validation_messages.postcode.invalid')),

    address1: yup
      .string()
      .optional()
      .min(5, t('validation_messages.address1.min_length', { min: 5 }))
      .max(200, t('validation_messages.address1.max_length', { max: 200 })),

    address2: yup.string().max(200, t('validation_messages.address2.max_length', { max: 200 })),

    ownerName: yup
      .string()
      .optional()
      .min(2, t('validation_messages.owner_name.min_length', { min: 2 }))
      .max(50, t('validation_messages.owner_name.max_length', { max: 50 })),

    ownerMobileNumber: yup
      .string()
      .optional()
      .matches(/^[+]?[\d\s\-()]{10,15}$/, t('validation_messages.owner_mobile_number.invalid')),

    email: yup.string().optional().email(t('validation_messages.email.invalid')),

    managerName: yup
      .string()
      .optional()
      .min(2, t('validation_messages.manager_name.min_length', { min: 2 }))
      .max(50, t('validation_messages.manager_name.max_length', { max: 50 })),

    managerTitle: yup
      .string()
      .max(100, t('validation_messages.manager_title.max_length', { max: 100 })),

    mobileNumber: yup
      .string()
      .optional()
      .matches(/^[+]?[\d\s\-()]{10,15}$/, t('validation_messages.mobile_number.invalid')),
  })
}

// Tax Invoice Information Form Schema
export const taxInvoiceInformationSchema = () => {
  const { t } = i18n.global

  return yup.object({
    issueStatus: yup
      .string()
      .oneOf(['required', 'not-required'], t('validation_messages.issue_status.invalid'))
      .required(t('validation_messages.issue_status.required')),

    businessNumber: yup.string().when('issueStatus', {
      is: 'required',
      then: (schema) =>
        schema
          .required(t('validation_messages.business_number.required'))
          .matches(/^[\d\-]{10,12}$/, t('validation_messages.business_number.invalid')),
      otherwise: (schema) => schema.optional(),
    }),

    subBusinessNumber: yup
      .string()
      .optional()
      .test(
        'sub-business-number-format',
        t('validation_messages.sub_business_number.invalid'),
        (value) => {
          if (!value || value.trim() === '') {
            return true // Skip validation if empty
          }
          return /^[\d\-]{1,4}$/.test(value)
        },
      ),

    shopName: yup.string().when('issueStatus', {
      is: 'required',
      then: (schema) =>
        schema
          .required(t('validation_messages.tax_shop_name.required'))
          .min(2, t('validation_messages.tax_shop_name.min_length', { min: 2 }))
          .max(100, t('validation_messages.tax_shop_name.max_length', { max: 100 })),
      otherwise: (schema) => schema.optional(),
    }),

    ownerName: yup.string().when('issueStatus', {
      is: 'required',
      then: (schema) =>
        schema
          .required(t('validation_messages.tax_owner_name.required'))
          .min(2, t('validation_messages.tax_owner_name.min_length', { min: 2 }))
          .max(50, t('validation_messages.tax_owner_name.max_length', { max: 50 })),
      otherwise: (schema) => schema.optional(),
    }),

    postcode: yup.string().when('issueStatus', {
      is: 'required',
      then: (schema) =>
        schema
          .required(t('validation_messages.tax_postcode.required'))
          .matches(/^[\d\-]{5,10}$/, t('validation_messages.tax_postcode.invalid')),
      otherwise: (schema) => schema.optional(),
    }),

    address1: yup.string().when('issueStatus', {
      is: 'required',
      then: (schema) =>
        schema
          .required(t('validation_messages.tax_address1.required'))
          .min(5, t('validation_messages.tax_address1.min_length', { min: 5 }))
          .max(200, t('validation_messages.tax_address1.max_length', { max: 200 })),
      otherwise: (schema) => schema.optional(),
    }),

    address2: yup
      .string()
      .optional()
      .test(
        'address2-max-length',
        t('validation_messages.tax_address2.max_length', { max: 200 }),
        (value) => {
          if (!value || value.trim() === '') {
            return true // Skip validation if empty
          }
          return value.length <= 200
        },
      ),

    businessType: yup.string().when('issueStatus', {
      is: 'required',
      then: (schema) =>
        schema
          .required(t('validation_messages.business_type.required'))
          .min(2, t('validation_messages.business_type.min_length', { min: 2 }))
          .max(100, t('validation_messages.business_type.max_length', { max: 100 })),
      otherwise: (schema) => schema.optional(),
    }),

    businessItem: yup.string().when('issueStatus', {
      is: 'required',
      then: (schema) =>
        schema
          .required(t('validation_messages.business_item.required'))
          .min(2, t('validation_messages.business_item.min_length', { min: 2 }))
          .max(200, t('validation_messages.business_item.max_length', { max: 200 })),
      otherwise: (schema) => schema.optional(),
    }),

    emailToBeIssued: yup.string().when('issueStatus', {
      is: 'required',
      then: (schema) =>
        schema
          .required(t('validation_messages.email_to_be_issued.required'))
          .email(t('validation_messages.email_to_be_issued.invalid')),
      otherwise: (schema) => schema.optional(),
    }),

    managerName: yup
      .string()
      .optional()
      .test(
        'manager-name-max-length',
        t('validation_messages.tax_manager_name.max_length', { max: 50 }),
        (value) => {
          if (!value || value.trim() === '') {
            return true // Skip validation if empty
          }
          return value.length <= 50
        },
      ),

    managerPhone: yup
      .string()
      .optional()
      .test('manager-phone-format', t('validation_messages.manager_phone.invalid'), (value) => {
        if (!value || value.trim() === '') {
          return true // Skip validation if empty
        }
        return /^[+]?[\d\s\-()]{10,15}$/.test(value)
      }),

    managerMobile: yup
      .string()
      .optional()
      .test('manager-mobile-format', t('validation_messages.manager_mobile.invalid'), (value) => {
        if (!value || value.trim() === '') {
          return true // Skip validation if empty
        }
        return /^[+]?[\d\s\-()]{10,15}$/.test(value)
      }),

    sameAsBasicInfo: yup.object({
      shopName: yup.boolean(),
      address: yup.boolean(),
      email: yup.boolean(),
    }),
  })
}

// Individual field schemas for manual validation
export const shopNameSchema = () => {
  const { t } = i18n.global
  return yup
    .string()
    .optional()
    .min(2, t('validation_messages.shop_name.min_length', { min: 2 }))
    .max(100, t('validation_messages.shop_name.max_length', { max: 100 }))
}

export const phoneNumberSchema = () => {
  const { t } = i18n.global
  return yup
    .string()
    .optional()
    .matches(/^[+]?[\d\s\-()]{10,15}$/, t('validation_messages.phone_number.invalid'))
}

export const emailSchema = () => {
  const { t } = i18n.global
  return yup.string().optional().email(t('validation_messages.email.invalid'))
}

export const businessNumberSchema = () => {
  const { t } = i18n.global
  return yup
    .string()
    .optional()
    .matches(/^[\d\-]{10,12}$/, t('validation_messages.business_number.invalid'))
}
