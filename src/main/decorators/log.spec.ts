import { LogControllerDecorator } from './log'
import type { IController } from '../../presentation/protocols/controllers'
import { type HttpRequest, type HttpResponse } from '../../presentation/protocols/http'
import { LogRepository } from '../../infra/db/mongo/log-repository/log-repository'

const makeSut = (): { sut: IController, controllerStub: IController } => {
  class ControllerStub implements IController {
    async handle (_httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise(resolve => {
        resolve({
          statusCode: 200,
          body: {
            accessToken: 'any_token'
          }
        })
      })
    }
  }

  const controllerStub = new ControllerStub()
  const logRepository = new LogRepository()
  const logController = new LogControllerDecorator(controllerStub, logRepository)

  return { sut: logController, controllerStub }
}

describe('LogController Decorator', () => {
  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()

    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest: HttpRequest = { body: { username: 'any_username', password: '<PASSWORD>' } }

    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    expect(handleSpy).toHaveBeenCalledTimes(1)
  })
})
