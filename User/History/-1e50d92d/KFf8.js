import Http from '../../helpers/http'

const url_read_base = process.env.INTEGRATION_ADMIN_GATEWAY_BASEURL + '/api/read/v1/admins/AISetup'
const url_list = url_read_base + '/List'

export default class AISetupApi {
  constructor() {
    this.http = new Http()
    this.result = {
      is_ok:          false,
      error_messages: [],
      data:           {},
    }
  }

  mapFieldFromApi(model) {
    return {
      id:            model.id,
      function_type: model.functionType,
      ai_model:      model.aiModel,
      prompt:        model.prompt,
    }
  }

  async getAISetupListAsync() {
    try {
      const response = await this.http.post(url_list, {})
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if (this.result.is_ok) {
        const mapData = {
          items: [],
        }

        for (const item of response.data.result.items) {
          mapData.items.push(this.mapFieldFromApi(item))
        }

        this.result.data = mapData
      }
    } catch (e) {
      return this.http.loadError(e)
    }

    return this.result
  }
}

