import { Request, Response, NextFunction } from 'express'

type AsyncHandler<P = any, ResBody = any, ReqBody = any, ReqQuery = any> = (
	req: Request<P, ResBody, ReqBody, ReqQuery>,
	res: Response<ResBody>,
	next: NextFunction,
) => Promise<any>

export const asyncHandler = <P, ResBody, ReqBody, ReqQuery>(fn: AsyncHandler<P, ResBody, ReqBody, ReqQuery>) => {
	return (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next)
	}
}
