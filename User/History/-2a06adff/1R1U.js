// Utils
import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES,SERVICE_EXTEND_TYPES} from '../../config/constant'
// import { options } from '../../helpers/options'

// View Model
import LoyaltyPointsSetupsViewModel from '../../view-model/sales/loyalty-points-setups-view-model'

const urlCmd = getServiceUrl(SERVICE_TYPES.SALES_SETUP_CMD, 1)
const urlRead = getServiceUrl(SERVICE_TYPES.SALES_SETUP_READ, 1)

const urlCmdLoyaltyPoints = urlCmd + SERVICE_EXTEND_TYPES.LOYALTY_POINTS
const urlReadLoyaltyPoints = urlRead + SERVICE_EXTEND_TYPES.LOYALTY_POINTS_LIVE

export default class LoyaltyPointsSetupsApi {
  constructor(){
    this.http = new Http()
    this.result = {
      is_ok:          false,
      error_messages: [],
      data:           {},
    }
  }

  mapFieldsFromApi(api_data){
    const loyaltyPointsSetupsViewModel = new LoyaltyPointsSetupsViewModel()
    loyaltyPointsSetupsViewModel.mapFieldsFromApi(api_data)
    return loyaltyPointsSetupsViewModel
  }

  setResult(response) {
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK) {
      const tmpViewModel = this.mapFieldsFromApi(response.data.result)
      this.result.data = tmpViewModel.getFields()
    }
  }

  async getLoyaltyPointsSetupsAsync(shopId) {
    const query = {
      shopId,
    }

    try {
      const response = await this.http.post(urlReadLoyaltyPoints, query)
      this.setResult(response)
    } catch(error) {
      return this.http.loadError(error)
    }

    return this.result
  }

  async updateLoyaltyPointsSetupsAsync(loyaltyPointsSetupsViewModel) {
    const sendData = loyaltyPointsSetupsViewModel.mapFieldsToApi()

    try {
      const response = await this.http.put(urlCmdLoyaltyPoints, sendData)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK

      if(response.data.isOK) {
        const tmpViewModel = this.mapFieldsFromApi(response.data.result.loyaltyPointsSetups)
        this.result.data = tmpViewModel.getFields()
      }
    } catch(error) {
      return this.http.loadError(error)
    }

    return this.result
  }
}
