import axios from 'axios'
import moment from 'moment'
import i18n from 'Translate'
import store from '../store/store'
import router from 'Modules/router/index'
import { inventory_options } from 'Options/inventory-options.js'
import { escapeHtml, convertDateFromUtcToTimezone, convertTimeStampToDate, checkMobileApp } from 'CommonHelpers'

// Constants
import { options } from 'OptionsHelpers'
import { APP_API_STATUS, API_ERROR_CODES, RETRY_POPUP_OPEN_COUNT, STATUS_CODES } from 'Constant'
import { InterceptorsUtilities } from 'Modules/api/http'

const REQUEST_TIMEOUT = 120000
const TIME_OUT_LOADING = 1000

const esc = encodeURIComponent
const DEFAULT_HEADERS = {
  'Accept':                       'application/json',
  'Content-Type':                 'application/json',
  'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
  'Cache-Control':                'no-cache',
  'Pragma':                       'no-cache',
  'Expires':                      '0',
  'X-Force-Error':                '500',
}

export const redirectLogin = () => {
  store.commit('authentication/setLastVisitedPage', router.currentRoute)
  router.push({ name: 'login' })
}

const getSessionCurrentUser = () => {
  return store.state.authentication
}

export const fetchRefreshToken = async () => {
  const currentUser = getSessionCurrentUser()

  const country = currentUser.shop.country
  const refresh_token = currentUser.refreshToken
  const auth_token = currentUser.apiToken

  const payload = {
    country,
    refresh_token,
    auth_token,
  }

  const response = await store.dispatch('authentication/refreshApiToken', payload)
  return response?.data
}

const waitRefreshTokenComplete = () => new Promise(resolve => {
  if (!store.state?.authentication?.isRefreshingToken) {
    return resolve(store.state?.authentication?.isRefreshTokenOk)
  }

  const unwatcher = store.watch(function (rootState) {
    return rootState.authentication.isRefreshingToken
  }, async function (isRefreshingToken) {
    if (!isRefreshingToken) {
      unwatcher()

      resolve(store.state?.authentication?.isRefreshTokenOk)
    }
  }, {
    immediate: true,
  })
})

const checkAppVersion = async (config) => {
  const isUserLoggedIn = store.state.authentication.logged_in
  const isSignalRConnectionDisconnected = store.getters['signalR/isDisconnected']

  if (isUserLoggedIn && isSignalRConnectionDisconnected) {
    const { hasNewAppVersion } = await store.dispatch('app/checkAppVersionByFile') || {}
    if (hasNewAppVersion) {
      // not handle requests if had new app version
      throw config
    }
  }
  return config
}

const setRequestAuthorization = async (config) => {
  const token = store.state.authentication.apiToken
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
}

const setRequestStartedAt = async (config) => {
  config.meta = {
    ...config.meta,
    requestStartedAt: new Date().getTime(),
  }
  return config
}

const waitRefreshingToken = async (config) => {
  await waitRefreshTokenComplete()

  // This code won't be run due to the call to RefreshToken is changed to new modules/api/http
  // if (config.url.match('/auth/RefreshToken')) {
  //   store.commit('authentication/setRefreshingToken', true)
  // }

  return config
}

let isCheckAuthTokenValidityProcessing = false
const checkAuthTokenValidity = async response => {
  const tokenExpiredDateTimeTS = localStorage.getItem('tokenExpiredDateTimeTS') || sessionStorage.getItem('tokenExpiredDateTimeTS')
  const refreshTokenExpiredDateTimeTS = localStorage.getItem('refreshTokenExpiredDateTimeTS') || sessionStorage.getItem('refreshTokenExpiredDateTimeTS')
  const currentDateTimeTS = moment().utcOffset(store.state.authentication.shop.timezone).unix()
  // For debug in the future: check timestamp
  // console.log('tokenExpiredDateTimeTS',tokenExpiredDateTimeTS)
  // console.log('currentDateTimeTS',currentDateTimeTS)

  if(tokenExpiredDateTimeTS && currentDateTimeTS && refreshTokenExpiredDateTimeTS
      && tokenExpiredDateTimeTS <= currentDateTimeTS)
  {
    if(refreshTokenExpiredDateTimeTS < currentDateTimeTS) {
      redirectLogin()
      return
    }

    if (!store.state?.authentication?.isRefreshingToken && !isCheckAuthTokenValidityProcessing) {
      try {
        isCheckAuthTokenValidityProcessing = true
        const result = await fetchRefreshToken()

        if (!result?.isOK) {
          redirectLogin()
          throw response
        }

        const hasLoadingSpinner = store.getters['alert/getIsLoading']
        if(!hasLoadingSpinner) {
          store.dispatch('alert/setIsLoadingData', true)

          const regexOfExcludedURL = /SalesTotalDetailByStaffReport/
          const regex = new RegExp(regexOfExcludedURL)

          if (!regex.test(response.url)) {
            const periodTimeToForceTurnOffSpinnerInMilliseconds = 2000
            setTimeout(() => {
              store.dispatch('alert/setIsLoadingData', false)
            }, periodTimeToForceTurnOffSpinnerInMilliseconds)
          }
        }
      } catch(refreshTokenError) {
        redirectLogin()
        return refreshTokenError
      }
      finally {
        isCheckAuthTokenValidityProcessing = false
      }
    }
  }

  return Promise.resolve(response)
}

axios.interceptors.request.use(checkAppVersion)
axios.interceptors.request.use(setRequestStartedAt)
axios.interceptors.request.use(setRequestAuthorization, null, {
  runWhen: config => {
    return !config.url.includes('https://ars.innopay.co.kr')
  },
})

axios.interceptors.request.use(config => {
  // set start time for the request
  config.metadata = { startTime: new Date() }

  //increase pending api count
  store.commit('alert/incrementPendingApiCount')
  config.timeoutLoading = setTimeout(() => {
    if(store.state.alert.requestPending > 0) {
      store.dispatch('alert/setIsLoadingData', true)
    }
  }, TIME_OUT_LOADING)

  return config
}, error => {
  // Decreasement pending API count on error
  store.commit('alert/decrementPendingApiCount')
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  //decrease pending api count
  store.commit('alert/decrementPendingApiCount')

  // If no pending requests, update loading state and clear timeout
  if(store.state.alert.requestPending === 0) {
    store.dispatch('alert/setIsLoadingData', false)
    clearTimeout(response?.config?.timeoutLoading)
  }

  // Update retries map for the success response request
  if(response?.status === 200 && interceptorsUtilities.retries.has(response?.config?.url)) {
    if(response?.config?.url.includes(interceptorsUtilities.retries.get(response?.config?.url))) {
      interceptorsUtilities.retries.delete(response?.config?.url)
      sessionStorage.setItem('retries', JSON.stringify(interceptorsUtilities.retries))
    }
  }

  return response
}, error => {
  // Decrement pending API count on error
  store.commit('alert/decrementPendingApiCount')
  if(store.state.alert.requestPending === 0) {
    store.dispatch('alert/setIsLoadingData', false)
  }
  return Promise.reject(error)
})

const setResponseTime = response => {
  if (response?.config?.meta?.requestStartedAt) {
    const now = new Date().getTime()
    response.responseTime = now - response.config?.meta?.requestStartedAt
  }

  return response
}

const handleResponseError = error => {
  if (error?.config?.meta?.requestStartedAt) {
    const now = new Date().getTime()
    error.responseTime = now - error.config?.meta?.requestStartedAt
  }

  const status = error.response?.status
  const hasErrorInvalidRequestContent = error?.response?.data?.errorMessages?.some(errorMessage => {
    return errorMessage?.errorCode === API_ERROR_CODES.ERR_INVALID_REQUEST_CONTENT
  })

  if(status === APP_API_STATUS.SERVICE_MAINTENANCE && hasErrorInvalidRequestContent) {
    redirectLogin()
    return Promise.reject(error)
  }

  if (status === APP_API_STATUS.SERVER_MAINTENANCE || status === APP_API_STATUS.SERVICE_MAINTENANCE) {
    const requestUrl = error?.config?.url ?? ''
    const partName = requestUrl.split('/api/')[1].split('/')[0]
    const serviceName = requestUrl.split('/v1/')[1].split('/')[0] + '-' + partName
    store.dispatch('app/pushAppMessages', {
      status,
      message: status === APP_API_STATUS.SERVICE_MAINTENANCE ?
        i18n.t('general.service-maintenance-warning', { serviceName }) :
        i18n.t('general.server-maintenance-warning'),
    })
    store.dispatch('app/setShowAppMessages', true)
  }

  return Promise.reject(error)
}

const handleResponseServiceUnauthorization = async response => {
  if (response?.data?.isOK) return response

  const hasErrorUnAuthorized = response?.data?.errorMessages?.some(errorMessage => {
    return errorMessage?.errorCode === API_ERROR_CODES.API_SERVICE_UNAUTHORIZED
  })

  if (!hasErrorUnAuthorized) return response

  try {
    if (!store.state?.authentication?.isRefreshingToken) {
      const result = await fetchRefreshToken()
      if (!result?.isOK) {
        redirectLogin()
        throw response
      }

      return axios(response?.config)
    }

    const isRefreshTokenOk = await waitRefreshTokenComplete()

    if (isRefreshTokenOk) {
      return axios(response?.config)
    }

    return Promise.reject(response)
  } catch(refreshTokenError) {
    redirectLogin()
    refreshTokenError.data.errorMessages = []
    return refreshTokenError
  }
}

const handleResponseUnauthorization = async error => {
  if (error?.response?.status === 401) {
    store.commit('alert/decrementPendingApiCount')
    const currentUser = getSessionCurrentUser()
    const refreshToken = currentUser?.refreshToken

    if (!refreshToken || error?.config?.url?.match('/auth/RefreshToken')) {
      redirectLogin()
      return Promise.reject(error)
    }

    try {
      if (!store.state?.authentication?.isRefreshingToken) {
        const result = await fetchRefreshToken()

        if (!result?.isOK) {
          redirectLogin()
          throw error
        }
        return axios(error?.config)
      }

      const isRefreshTokenOk = await waitRefreshTokenComplete()

      if (isRefreshTokenOk) {
        return axios(error?.config)
      }

      return Promise.reject(error)

    } catch (refreshTokenError) {
      throw refreshTokenError
    }
  }

  return Promise.reject(error)
}

axios.interceptors.request.use(function (request) {
  // pendingRequests++
  return request
})
const retriesTimeout = new Map()

axios.interceptors.response.use(setResponseTime, handleResponseError)
const interceptorsUtilities = new InterceptorsUtilities(axios, 1)

axios.interceptors.response.use(null, async error => {
  store.commit('alert/decrementPendingApiCount')
  const endTime = new Date()
  const duration = endTime - error.config.metadata.startTime
  const expectedError = typeof error.response === 'undefined'
  || (error.response.status > STATUS_CODES._401_UNAUTHORIZED
    && error.response.status <= STATUS_CODES._500_INTERNAL_SERVER_ERROR
    && error.response.status !== STATUS_CODES._429_TOO_MANY_REQUESTS
    && duration < REQUEST_TIMEOUT)

  // Mark URL as retrying
  if (expectedError) {
    if(store.state.app.showDialogAlertSpecialCount < RETRY_POPUP_OPEN_COUNT) {
      try {
        // Open dialog alert special
        store.commit('app/setDialogAlertSpecial', true)
        store.commit('app/setCurrentDialogAlertSpecialUrl', error?.config.url)

        // Wait few seconds before retrying
        await interceptorsUtilities.waitForNextRetry()

        const response = await axios.request(error?.config)

        return response
      } catch (retryError) {
        return Promise.reject(retryError)
      }
      finally{
        if(store.state.alert.requestPending === 0) {
          store.dispatch('alert/setIsLoadingData', false)
        }
      }
    } else {
      // // Run to wait when the number of retries is equal to or greater than RETRY_POPUP_OPEN_COUNT (state of stopping retry)
      await interceptorsUtilities.loopWaitForNextRetry(error)
    }
  }

  // Show 429 Too many requests error:
  if(error?.response?.status === STATUS_CODES._429_TOO_MANY_REQUESTS) {
    interceptorsUtilities.retries.delete(error?.config?.url)
    InterceptorsUtilities.showAlert(STATUS_CODES._429_TOO_MANY_REQUESTS)
  }

  if(duration >= REQUEST_TIMEOUT && !retriesTimeout.has(error?.config?.url)) {
    try {
      retriesTimeout.set(error?.config.url, true)
      store.dispatch('alert/setIsLoadingData', false)
      store.commit('app/setDialogAlertRetryTimeout', true)

      if(store.state.app.isShowDialogAlertSpecial) {
        store.commit('app/setDialogAlertSpecial', false)
      }
      retriesTimeout.delete(error?.config?.url)
      const response = await axios.request(error?.config)

      return response
    } catch (error) {
      retriesTimeout.delete(error?.config.url)
      return Promise.reject(retriesTimeout)
    }

  }
})
axios.interceptors.response.use(handleResponseServiceUnauthorization, handleResponseUnauthorization)

axios.interceptors.request.use(waitRefreshingToken)
axios.interceptors.request.use(checkAuthTokenValidity)

const tag_date = '#date'
const tag_login = '#login'
const tag_resources = '#resources'
const tag_reference = '#reference'
const tag_block_date = '#block_date'
const tag_performances = '#performances'
const tag_find_loing_info = '#find_login_info'

export default class Http {
  getHeaders(header_parameters = {}) {
    let default_headers = DEFAULT_HEADERS
    // const api_token = store.state.authentication.user.api_token
    const api_token = localStorage.getItem('apiToken') || sessionStorage.getItem('apiToken')
    if(api_token) {
      default_headers = {
        'Authorization': `Bearer ${api_token}`,
        ...default_headers,
        ...header_parameters,
      }
    }

    return default_headers
  }
  processAPIErrors(apiErrors) {
    let errors = {}
    if(apiErrors) {
      for (let key of Object.keys(apiErrors)) {
        let err = apiErrors[key]

        errors[key] = err

        if (typeof err === Object || err.hasOwnProperty('length')) {
          errors[key] = apiErrors[key][0]
        }
      }
    }
    return errors
  }
  qs(params) {
    return (
      Object
        .keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&')
    )
  }
  post(uri, data, header_parameters) {
    return axios.post(uri, data, {
      headers: this.getHeaders(header_parameters),
    }).catch(e => this.setError(e))
  }
  get(uri) {
    return axios.get(uri, {
      responseType: 'blob',
      headers:      this.getHeaders(),
    }).catch(e => this.setError(e) )
  }
  postTest(uri){
    return axios.post(uri, {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/html; charset=UTF-8'},
    }).catch(e => this.setError(e) )
  }
  donwload(uri, data) {
    return axios.post(uri, data, {
      responseType: 'blob',
      headers:      this.getHeaders(),
    }).catch(e => this.setError(e) )
  }
  put(uri, data, header_parameters) {
    return axios.put(uri, data, {
      headers: this.getHeaders(header_parameters),
    }).catch(e => this.setError(e))
  }
  delete(uri, data, header_parameters) {
    return axios.delete(uri, {
      headers: this.getHeaders(header_parameters),
      data:    data,
    }).catch(e => this.setError(e))
  }
  postARS(uri, data) {
    return axios.post(uri, data, {
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    }).catch(e => this.setError(e) )
  }
  postLGCid(uri, data){
    return axios.post(uri, data).catch(e => this.setError(e) )
  }
  setError(error){
    let response = undefined
    if(error.response != undefined){
      response = error.response
      if(error.response.status == 401){
        response.data = {
          data:          null,
          errorMessages: [],
          isOK:          false,
        }
      }
      else {
        if(typeof response?.data != 'object'){ // in cases header errors, not response data
          response.data = {
            data:          null,
            errorMessages: [error],
            isOK:          false,
          }
        }
      }
    }
    else {
      response = {
        data: {
          data:          null,
          errorMessages: [error.message],
          isOK:          false,
        },
      }
    }
    return response
  }
  // get(uri, data = {}) {
  //   if (Object.keys(data).length > 0) {
  //     uri = `${uri}?${this.qs(data)}`
  //   }
  //   return axios.get(uri, {
  //     headers: this.getHeaders()
  //   })
  // }
  // upload(uri, data) {
  //   return fetch(uri, {
  //     headers: this.getHeaders(true),
  //     cors: true,
  //     method: 'POST',
  //     body: data
  //   })
  // }
  loadError(error){
    let e = {
      data:           null,
      error_messages: [error.message],
      is_ok:          false,
    }
    return e
  }
  generateHttpErrorMessageOfFetch(response){
    let message = ''
    if(response.status === 400){
      message = 'Bad Request'
    }
    if(response.status === 401){
      message = 'Unauthorized'
    }
    if(response.status === 402){
      message = 'Payment Required'
    }
    if(response.status === 403){
      message = 'Forbidden'
    }
    if(response.status === 404){
      message = 'Not Found'
    }
    if(response.status === 405){
      message = 'Method Not Allowed'
    }
    if(response.status === 406){
      message = 'Not Acceptable'
    }
    if(response.status === 407){
      message = 'Proxy Authentication Required'
    }
    if(response.status === 408){
      message = 'Request Timeout'
    }
    if(response.status === 409){
      message = 'Conflict'
    }
    if(response.status === 410){
      message = 'Gone'
    }
    if(response.status === 411){
      message = 'Length Required'
    }
    if(response.status === 412){
      message = 'Precondition Failed'
    }
    if(response.status === 413){
      message = 'Payload Too Large'
    }
    if(response.status === 414){
      message = 'Request-URI Too Long'
    }
    if(response.status === 415){
      message = 'Unsupported Media Type'
    }
    if(response.status === 416){
      message = 'Requested Range Not Satisfiable'
    }
    if(response.status === 417){
      message = 'Expectation Failed'
    }
    if(response.status === 418){
      message = 'I\'m a teapot'
    }
    if(response.status === 421){
      message = 'Misdirected Request'
    }
    if(response.status === 422){
      message = 'Unprocessable Entity'
    }
    if(response.status === 423){
      message = 'Locked'
    }
    if(response.status === 424){
      message = 'Failed Dependency'
    }
    if(response.status === 426){
      message = 'Upgrade Required'
    }
    if(response.status === 428){
      message = 'Precondition Required'
    }
    if(response.status === 429){
      message = 'Too Many Requests'
    }
    if(response.status === 431){
      message = 'Request Header Fields Too Large'
    }
    if(response.status === 444){
      message = 'Connection Closed Without Response'
    }
    if(response.status === 451){
      message = 'Unavailable For Legal Reasons'
    }
    if(response.status === 499){
      message = 'Client Closed Request'
    }
    if(response.status === 500){
      message = 'Internal Server Error'
    }
    if(response.status === 501){
      message = 'Not Implemented'
    }
    if(response.status === 502){
      message = 'Bad Gateway'
    }
    if(response.status === 503){
      message = 'Service Unavailable'
    }
    if(response.status === 504){
      message = 'Gateway Timeout'
    }
    if(response.status === 505){
      message = 'HTTP Version Not Supported'
    }
    if(response.status === 506){
      message = 'Variant Also Negotiates'
    }
    if(response.status === 507){
      message = 'Insufficient Storage'
    }
    if(response.status === 508){
      message = 'Loop Detected'
    }
    if(response.status === 510){
      message = 'Not Extended'
    }
    if(response.status === 511){
      message = 'Network Authentication Required'
    }
    if(response.status === 599){
      message = 'Network Connect Timeout Error'
    }
    return message
  }
  mapErrorsFromApi(api_errors){
    let error_messages = []

    if(api_errors){
      for(let api_error of api_errors){
        let error_message = ''
        if(api_error?.errorCode) {
          error_message = this.generateMessageBaseErrorCode(api_error)
        }
        else
          error_message = api_error

        error_messages.push(error_message)
      }
    }
    return error_messages
  }
  mapErrorCodesFromApi(apiErrors = []) {
    return apiErrors?.map(apiError => apiError?.errorCode) ?? []
  }

  mapErrorValues(apiErrors = []) {
    return apiErrors?.map(apiError => apiError?.errorValues) ?? []
  }

  generateMessageBaseErrorCode(api_error){
    let message = api_error.errorMessage
    let replace_tags = []

    // CLIENT
    if(api_error.errorCode == options.client_error_codes.cds01r) {
      replace_tags = []
      message = this.getErrorMessage('clients.warn-you-can-not-delete-client-has-valid-prepaid-cards', replace_tags, api_error)
    }
    if(api_error.errorCode == options.client_error_codes.cds02r) {
      replace_tags = []
      message = this.getErrorMessage('clients.warn-you-can-not-delete-client-has-valid-prepaid-services', replace_tags, api_error)
    }
    if(api_error.errorCode == options.client_error_codes.cds04r) {
      replace_tags = [tag_reference]
      message = this.getErrorMessage('clients.warn-you-can-not-delete-client-has-valid-prepaid-goods', replace_tags, api_error)
    }

    // BOOKING SETUP
    if(api_error.errorCode == options.booking.booking_setup_error_codes.bdd01r) {
      replace_tags = []
      message = this.getErrorMessage('bookings.warning_booking_deposit_default_setup_not_created', replace_tags, api_error)
    }

    // BOOKING
    if(api_error.errorCode == options.booking.booking_error_codes.bk15c) {
      replace_tags = []
      // message = this.getErrorMessage('bookings.resource-not-selected', replace_tags, api_error)
      message = this.getErrorMessage('bookings.resource-is-required', replace_tags, api_error)
    }
    // reference from exceedWorkHourCalendarCell
    // workhour shop
    if(api_error.errorCode == options.booking.booking_error_codes.bk44c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.selected-date-is-shop-specific-off-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.booking_error_codes.bk45c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.booking-selected-date-is-shop-repeated-off-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.booking_error_codes.bk35c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.selected-day-is-not-shop-working-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.booking_error_codes.bk36c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.booking-exceed-shop-workhour', replace_tags, api_error)
    }
    // workhour resource
    if(api_error.errorCode == options.booking.booking_error_codes.bk46c){
      replace_tags = [tag_date, tag_resources]
      message = this.getErrorMessage('bookings.selected-date-is-resource-specific-off-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.booking_error_codes.bk47c){
      replace_tags = [tag_date, tag_resources]
      message = this.getErrorMessage('bookings.selected-day-is-not-resource-working-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.booking_error_codes.bk48c) {
      replace_tags = [tag_date, tag_resources]
      message = this.getErrorMessage('bookings.booking-exceed-resource-workhour', replace_tags, api_error)
    }
    // duplicate
    if(api_error.errorCode == options.booking.booking_error_codes.bk49c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.selected-time-had-5-duplicated-bookings', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.booking_error_codes.bk30c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.booking-duplicate-with-another-bookings', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.booking_error_codes.bk31c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.booking-duplicate-with-blocked-time', replace_tags, api_error)
    }
    // moving multi-resources booking
    if(api_error.errorCode == options.booking.booking_error_codes.bk52c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.multi-resources-booking-can-not-moving-to-other-date', replace_tags, api_error)
    }
    // resource can not perform service BK43C
    if(api_error.errorCode == options.booking.booking_error_codes.bk43c){
      replace_tags = [tag_date, tag_performances]
      message = this.getErrorMessage('bookings.resources-can-not-perform-selected-services', replace_tags, api_error)
    }

    // WAITING
    // workhour shop
    if(api_error.errorCode == options.booking.waiting_error_codes.wt15c){
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.waiting-selected-date-is-shop-specific-off-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.waiting_error_codes.wt16c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.waiting-selected-date-is-shop-repeated-off-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.waiting_error_codes.wt17c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.waiting-selected-day-is-not-shop-working-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.waiting_error_codes.wt18c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.waiting-exceed-shop-workhour', replace_tags, api_error)
    }
    // workhour resource
    if(api_error.errorCode == options.booking.waiting_error_codes.wt19c){
      replace_tags = [tag_date, tag_resources]
      message = this.getErrorMessage('bookings.waiting-selected-date-is-resource-specific-off-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.waiting_error_codes.wt20c){
      replace_tags = [tag_date, tag_resources]
      message = this.getErrorMessage('bookings.waiting-selected-day-is-not-resource-working-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.waiting_error_codes.wt21c) {
      replace_tags = [tag_date, tag_resources]
      message = this.getErrorMessage('bookings.waiting-exceed-resource-workhour', replace_tags, api_error)
    }

    // BLOCKED TIME
    // workhour shop
    if(api_error.errorCode == options.booking.blocked_time_error_codes.bt11c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.blocked-time-selected-date-is-shop-specific-off-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.blocked_time_error_codes.bt12c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.blocked-time-selected-date-is-shop-repeated-off-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.blocked_time_error_codes.bt13c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.blocked-time-selected-day-is-not-shop-working-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.blocked_time_error_codes.bt14c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.blocked-time-exceed-shop-workhour', replace_tags, api_error)
    }
    // workhour resource
    if(api_error.errorCode == options.booking.blocked_time_error_codes.bt17c){
      replace_tags = [tag_date, tag_resources]
      message = this.getErrorMessage('bookings.blocked-time-selected-date-is-resource-specific-off-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.blocked_time_error_codes.bt18c){
      replace_tags = [tag_date, tag_resources]
      message = this.getErrorMessage('bookings.blocked-time-selected-day-is-not-resource-working-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.blocked_time_error_codes.bt19c) {
      replace_tags = [tag_date, tag_resources]
      message = this.getErrorMessage('bookings.blocked-time-exceed-resource-workhour', replace_tags, api_error)
    }

    // INVENTORY
    if(api_error.errorCode == inventory_options.error_codes.stock_adjustment.saj07c) {
      replace_tags = []
      message = this.getErrorMessage('stock-adjustment.stock-on-hand-not-lastest', replace_tags, api_error)
    }

    // LOGIN
    if(api_error.errorCode == options.login_error_codes.ua14c || api_error.errorCode == options.login_error_codes.ua01r) {
      replace_tags = [tag_login]
      message = this.getErrorMessage('login.id-or-password-incorrect', replace_tags, api_error)
    }
    if(api_error.errorCode == options.login_error_codes.ua28c) {
      replace_tags = []
      message = this.getErrorMessage('login.account-inactive', replace_tags, api_error)
    }
    if(api_error.errorCode == options.login_error_codes.ua29c) {
      replace_tags = [tag_block_date]
      message = this.getErrorMessage('login.failed-10times', replace_tags, api_error)
    }
    if(api_error.errorCode == options.login_error_codes.tls02r) {
      replace_tags = []
      message = this.getErrorMessage('login.invalid-login-key', replace_tags, api_error)
    }
    if(api_error.errorCode == options.login_error_codes.idt04a) {
      replace_tags = []
      message = this.getErrorMessage('login.undersubscribed-shop', replace_tags, api_error)
    }
    if(api_error.errorCode == options.login_error_codes.idt05a) {
      replace_tags = []
      message = this.getErrorMessage('login.suspended-shop', replace_tags, api_error)
    }
    if(api_error.errorCode == options.login_error_codes.idt06a || api_error.errorCode == options.login_error_codes.idt11a) {
      replace_tags = []
      message = this.getErrorMessage('login.unsubscribed-shop', replace_tags, api_error)
    }
    if(api_error.errorCode == options.login_error_codes.idt07a) {
      replace_tags = []
      message = this.getErrorMessage('login.deleted-shop', replace_tags, api_error)
    }
    if(api_error.errorCode == options.login_error_codes.idt08a) {
      replace_tags = []
      message = this.getErrorMessage('login.overdue-3month', replace_tags, api_error)
    }
    if(api_error.errorCode == options.login_error_codes.idt09a) {
      replace_tags = []
      if(checkMobileApp()){
        message = this.getErrorMessage('login.expired-shop-app', replace_tags, api_error)
      }
      else{
        message = this.getErrorMessage('login.expired-shop', replace_tags, api_error)
      }
    }

    //STAFF
    if(api_error.errorCode == options.staff_error_codes.tmc04c) {
      replace_tags = []
      message = this.getErrorMessage('time-clock.not-staff-working-hours', replace_tags, api_error)
    }
    if(api_error.errorCode == options.staff_error_codes.sta01a) {
      return [...api_error.errorValues, api_error.errorCode]
    }

    //Find ID/Password
    if(api_error.errorCode == options.find_id_password_error_codes.shp03r) {
      replace_tags = [tag_find_loing_info]
      message = this.getErrorMessage('find-user-id.duplicate-shop-error', replace_tags, api_error)
    }
    if(api_error.errorCode == options.find_id_password_error_codes.shp01r || api_error.errorCode == options.find_id_password_error_codes.idt13a) {
      replace_tags = []
      message = this.getErrorMessage('find-login-info.failed-to-find-info', replace_tags, api_error)
    }
    if(api_error.errorCode == options.check_owner_user_id_error_codes.idt17a) {
      replace_tags = []
      message = this.getErrorMessage('find-login-info.not-onwer-user-id', replace_tags, api_error)
    }

    // mobile certification
    if(api_error.errorCode == options.mobile_certification_verification_error_codes.imc01r) {
      replace_tags = []
      message = this.getErrorMessage('mobile-certification-verify-error.iamport-authentication-failed', replace_tags, api_error)
    }
    if(api_error.errorCode == options.mobile_certification_verification_error_codes.imc02r) {
      replace_tags = []
      message = this.getErrorMessage('mobile-certification-verify-error.certification-result-not-exist', replace_tags, api_error)
    }
    if(api_error.errorCode == options.mobile_certification_verification_error_codes.imc03r) {
      replace_tags = []
      message = this.getErrorMessage('mobile-certification-verify-error.user-information-not-matched', replace_tags, api_error)
    }

    //LG Centrex CID
    if(api_error.errorCode == options.cid_lg_centrex.lgc1) {
      replace_tags = []
      message = this.getErrorMessage('cid-lg-centrex-error-code.lgc1-missing-parameter', replace_tags, api_error)
    }
    if(api_error.errorCode == options.cid_lg_centrex.lgc2 || api_error.errorCode == options.cid_lg_centrex.lgc3) {
      replace_tags = []
      message = this.getErrorMessage('cid-lg-centrex-error-code.lgc2-lgc3-wrong-user-info', replace_tags, api_error)
    }
    if(api_error.errorCode == options.cid_lg_centrex.lgc4) {
      replace_tags = []
      message = this.getErrorMessage('cid-lg-centrex-error-code.lgc4-phone-busy', replace_tags, api_error)
    }
    if(api_error.errorCode == options.cid_lg_centrex.lgc5) {
      replace_tags = []
      message = this.getErrorMessage('cid-lg-centrex-error-code.lgc5-not-specified-error', replace_tags, api_error)
    }

    // Sales
    if(api_error.errorCode == options.sales_error_codes.sa101c) {
      replace_tags = []
      message = this.getErrorMessage('sales.can-not-change-the-sale-date-since-include-a-refunded-prepaid-good', replace_tags, api_error)
    }

    if (
      api_error.errorCode == options.booking.booking_error_codes.bk35c
      || api_error.errorCode == options.booking.booking_error_codes.bk44c
      || api_error.errorCode == options.booking.booking_error_codes.bk46c
      || api_error.errorCode == options.booking.booking_error_codes.bk47c
    ) {
      return `${message}`
    }

    return `${message} <span class="hide"><b>${api_error.errorCode}</b><br>${api_error.errorValues.join('; ')}</span>`
  }
  getErrorMessage(error_message, replace_tags, api_error){
    let message = i18n.t(error_message)

    for(let i in replace_tags){
      let replace_tag = replace_tags[i]
      let replace_tag_value = ''
      let replace_tag_reference = []
      for(let j in api_error.errorValues){
        let error_value = escapeHtml(api_error.errorValues[j] || '')
        let break_value_index = error_value.indexOf(':')
        let key_txt = error_value.substring(0, break_value_index)
        let content_txt = error_value.substring(break_value_index + 2, error_value.length)

        if(replace_tag == tag_date && (key_txt == 'dateTS' || key_txt == 'bookingDateTS')){
          replace_tag_value = this.getErrorDate(content_txt)
        }
        if(replace_tag == tag_resources && key_txt == 'resourceName'){
          replace_tag_value = this.getErrorResources(content_txt)
        }
        if(replace_tag == tag_performances && key_txt == 'performanceResources')
          replace_tag_value = this.getErrorPerformances(content_txt)
        if(replace_tag == tag_login && key_txt == 'loginFailCount'){
          message += '<p/><br>' + ((content_txt > 0) ? i18n.t('login.if-10times-fail') + `(${content_txt}/10)` : '')
        }
        if(replace_tag == tag_block_date && key_txt == 'registrationDate'){
          replace_tag_value = content_txt
        }
        if(replace_tag == tag_block_date && key_txt == 'countryCode'){
          if (content_txt == 'KR')
            replace_tag_value = moment(convertDateFromUtcToTimezone(replace_tag_value, options.local_time_zone.kr), 'HH:mm:ss').format(options.standard_date_format.ymdh)
          else
            replace_tag_value = moment(convertDateFromUtcToTimezone(replace_tag_value, options.local_time_zone.vn), 'HH:mm:ss').format(options.standard_date_format.ymdh)
        }
        if(replace_tag == tag_reference){
          let tmp_values = error_value.split(', ')
          if(tmp_values.length > 0){
            let tmp_shop_id = tmp_values[0].split(': ')[1]
            let tmp_shop_name = tmp_values[1].split(': ')[1]
            replace_tag_reference.push(`<span>${tmp_shop_name}</span> (ShopId-${tmp_shop_id})`)
          }
        }
        if(replace_tag == tag_find_loing_info && key_txt == 'countryCode'){
          if (content_txt == 'KR'){
            message = message.replace('{0}', options.call_center_number.korea)
          }
          if (content_txt == 'VI')
            message = message.replace('{0}', options.call_center_number.vietnam)
        }
      }
      if(api_error.errorCode == options.client_error_codes.cds04r){
        replace_tag_value = replace_tag_reference.join(', ')
      }
      message = message.replace(replace_tag, replace_tag_value)
    }

    return message
  }
  getErrorDate(content_txt){
    let tmp_date = convertTimeStampToDate(Number(content_txt))
    tmp_date = moment.utc(tmp_date).format(options.standard_date_format.ymd)
    return tmp_date
  }
  getErrorResources(content_txt){
    return this.addSpaceToListName(content_txt)
  }
  getErrorPerformances(content_txt){
    content_txt = content_txt.substring(0, content_txt.length - 4)
    let tmp_performances = content_txt.split('@--@')
    let txt_performances = []
    for(let i in tmp_performances){
      let tmp_performance = tmp_performances[i]

      if(i == 0){
        tmp_performance = tmp_performance.replace('@:@', ' ➞ ')
        tmp_performance = this.addSpaceToListName(tmp_performance)
        txt_performances.push(tmp_performance)
      }
      else {
        let tmp_performance_array = tmp_performance.split('@:@')
        let tmp_resource_name = tmp_performance_array[0].trim()
        let tmp_services_name = tmp_performance_array[1]

        let last_performance = txt_performances[txt_performances.length - 1]
        let last_resource_name = last_performance.split(' ➞ ')[0].trim()

        if(tmp_resource_name == last_resource_name){
          last_performance += ', ' + tmp_services_name
          txt_performances[txt_performances.length - 1] = last_performance
        }
        else {
          tmp_performance = tmp_performance.replace('@:@', ' ➞ ')
          tmp_performance = this.addSpaceToListName(tmp_performance)
          txt_performances.push(tmp_performance)
        }
      }
    }

    tmp_performances = []
    for(let i in txt_performances){
      let txt_performance = txt_performances[i]
      txt_performance = '<small><span>' + txt_performance + '</small>'
      txt_performance = txt_performance.replace(' ➞ ', ' </span>➞ ')
      tmp_performances.push(txt_performance)
    }
    return tmp_performances.join('')
  }
  addSpaceToListName(text){
    return text.replace(/,/g, ', ')
  }
}

export class ApiError extends Error {
  constructor(errorMessages) {
    super()

    this.message = errorMessages
  }
}
