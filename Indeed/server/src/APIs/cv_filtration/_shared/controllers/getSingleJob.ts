import Job from '../models/job.model';

export const getSingleJob = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const result = await Job.findById(id);
        if (!result) {
            return res.status(404).send('Document not found');
        }
        res.json({
            title: result.title, 
            description: result.description,
            requirements: result.requirements, 
            applicants: result.applicants.map((applicantId) => ({ 
                id: applicantId })), 
            
        });
    } catch (error) {
        console.error('Error fetching document:', error); 
        res.status(500).send('Error fetching document');
    }
};
