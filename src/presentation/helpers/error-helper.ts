interface ToResult<T> {
  error: Error
  data: T | undefined
}

export function tryCatch<T> (fn: () => T): ToResult<T> {
  try {
    const data = fn()
    return { error: undefined, data }
  } catch (error) {
    return { error, data: undefined }
  }
}

export async function tryCatchAsync (promise: Promise<any>): Promise<ToResult<any>> {
  try {
    const result = await promise
    return { error: undefined, data: result }
  } catch (e) {
    return { error: e, data: undefined }
  }
}
