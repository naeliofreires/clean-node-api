import { type Request, type Response, type NextFunction } from 'express'

export const cors = (req: Request, res: Response, next: NextFunction): void => {
  /**
   * any origin can access the API, no restrictions
   */
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
}
