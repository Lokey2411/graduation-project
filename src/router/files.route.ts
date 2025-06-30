import { Router } from 'express'
import { getAllFiles, uploadFile, getFileUrl, removeFile } from '@/controller/files.controller'
import { asyncHandler } from '@/middleware/asyncHandler'
import upload from '@/config/upload.config'

const fileRouter = Router()

fileRouter.get('/', getAllFiles)
fileRouter.post('/', upload.single('document'), asyncHandler(uploadFile))
fileRouter.get('/:fileName', getFileUrl)
fileRouter.delete('/:fileName', removeFile)

export default fileRouter
