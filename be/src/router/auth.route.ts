import { createUser } from '@/controller/users.controller'
import { signIn } from '@/controller/users/auth.controller'
import { asyncHandler } from '@/middleware/asyncHandler'
import { Router } from 'express'
const authRouter = Router()
authRouter.post('/signup', asyncHandler(createUser))
authRouter.post('/login', asyncHandler(signIn))
export default authRouter
