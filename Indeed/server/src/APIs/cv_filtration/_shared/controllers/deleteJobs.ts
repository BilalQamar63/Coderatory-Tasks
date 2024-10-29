import Job from '../models/job.model';
import { Response, Request } from 'express';

export const deleteJobs = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; 
        const deletedJob = await Job.findByIdAndDelete(id);

        if (!deletedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }

        return res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting Job', error });
    }
};
