import { type IController } from '../../presentation/protocols/controllers'
import { type HttpRequest, type HttpResponse } from '../../presentation/protocols/http'
import { type ILogErrorRepository } from '../../data/protocols/log-error-repository'

export class LogControllerDecorator implements IController {
  private readonly controller: IController
  private readonly logErrorRepository: ILogErrorRepository

  constructor (controller: IController, logErrorRepository: ILogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const response = await this.controller.handle(httpRequest)

    if (response.statusCode === 500) {
      const stack: string = response.body.stack
      await this.logErrorRepository.logError(stack)
    }

    return response
  }
}
