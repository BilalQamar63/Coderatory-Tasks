import { Response } from 'express'
import cloudinary from '../../config/cloudinaryConfig'
import CV from '../models/cv.model'
import Job from '../models/job.model'
import pdfParse from 'pdf-parse'
import fs from 'fs'

export const uploadCv = async (req: any, res: Response) => {
    try {
        const { id } = req.params

        if (!req.files || !req.files.cv) {
            return res.status(400).json({ message: 'No file uploaded. Please upload a valid CV file.' })
        }

        const file = req.files.cv

        const fileBuffer = fs.readFileSync(file.tempFilePath)

        const pdfData = await pdfParse(fileBuffer)
        const job = await Job.findById(id)
        if (!job) {
            return res.status(404).json({ message: 'Job not found' })
        }
        const adminSkills = job.requirements

        const extractedText = pdfData.text.toLowerCase()

        const matchedSkills = adminSkills.filter((skill) => extractedText.includes(skill.toLowerCase().trim()))

        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
        const matchedEmails = extractedText.match(emailRegex)
        const userEmail = matchedEmails ? matchedEmails[0] : 'Email not found'

        const cloudinaryResult = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: 'auto',
            public_id: `cvs/${file.name.split('.').slice(0, -1).join('.')}`,
            format: 'jpg',
            type: 'upload'
        })

        const pfixed = (matchedSkills.length / adminSkills.length) * 100
        const percentage = pfixed.toFixed(2)

        const status = pfixed >= 70 ? 'Applicable' : 'Not Applicable'

        const cv = new CV({
            gmail: userEmail,
            pdfUrl: cloudinaryResult.secure_url,
            RequiredSkills: adminSkills,
            matchedSkills,
            percentage,
            status,
            jobId: job._id,
            jobTitle: job.title,
            Description: job.description
        })
        await cv.save()

        job.applicants.push(cv.id)
        await job.save()

        fs.unlinkSync(file.tempFilePath)
        return res.status(201).json({ message: 'CV uploaded and associated with job successfully', cv })
    } catch (error: any) {
        return res.status(500).json({ message: 'Error uploading CV', error: error.message })
    }
}
