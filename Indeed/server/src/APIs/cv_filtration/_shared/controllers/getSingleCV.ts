import CV from '../models/cv.model';

export const getSingleCV = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const result = await CV.findById(id);

        if (!result) {
            return res.status(404).send('Document not found');
        }

        res.json({
            gmail: result.gmail, 
            pdfUrl: result.pdfUrl,
            RequiredSkills: result.RequiredSkills, 
            matchedSkills: result.matchedSkills 
        });
    } catch (error) {
        res.status(500).send('Error fetching document');
    }
};
