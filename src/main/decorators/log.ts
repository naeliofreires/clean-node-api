import { type IController } from '../../presentation/protocols/controllers'
import { type HttpRequest, type HttpResponse } from '../../presentation/protocols/http'

export class LogControllerDecorator implements IController {
  private readonly controller: IController
  constructor (controller: IController) {
    this.controller = controller
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const response = await this.controller.handle(httpRequest)

    if (response.statusCode === 500) {
      console.log('your log')
    }

    return response
  }
}
