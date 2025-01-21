import { SignUpController } from './SignUpController'

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const stu = new SignUpController()
    const httpRequest = {
      body: {
        name: undefined,
        email: 'test@mail.com',
        password: 'password',
        confirmPassword: 'password'
      }
    }

    const httpResponse = stu.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
