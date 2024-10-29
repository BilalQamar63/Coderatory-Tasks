import express from 'express'
import { uploadCv } from '../cv_filtration/_shared/controllers/cvController'
import { getAllCV } from '../cv_filtration/_shared/controllers/getAllCV'
import { getSingleCV } from './_shared/controllers/getSingleCV'
import { deleteCV } from './_shared/controllers/deleteCV'
import { postJob } from './_shared/controllers/uploadJobs'
import { getAllJobs } from './_shared/controllers/getAllJobs'
import { getSingleJob } from './_shared/controllers/getSingleJob'
import { deleteJobs } from './_shared/controllers/deleteJobs'
import { getAllCVs } from './_shared/controllers/getJobAndCVs'


const router = express.Router()

router.post(  '/jobs',  postJob) 

router.get('/jobs', getAllJobs)

router.get('/jobs/:id', getSingleJob)

router.post('/jobs/:id/cv', uploadCv)


router.get('/jobs/:jobId/cv',getAllCV) 

router.get('/jobs/:id/cv/:id', getSingleCV) 

router.delete('/jobs/:id', deleteJobs)

router.get('/cvs',getAllCVs) 


router.delete('/cvs/:id',deleteCV) 

export default router
