import { Request, Response } from 'express';
import Job from '../models/job.model';

export const postJob = async (req: Request, res: Response) => {
    try {
        const { title, description, requirements } = req.body;

        const newJob = new Job({
            title:title,
            description:description,
            requirements: requirements || [],
        });

       
        await newJob.save();
        return res.status(201).json({ message: 'Job posted successfully', job: newJob });
    } catch (error:any) {
        console.error('Error posting job:', error);
        return res.status(500).json({ message: 'Error posting job', error: error.message });
    }
};
