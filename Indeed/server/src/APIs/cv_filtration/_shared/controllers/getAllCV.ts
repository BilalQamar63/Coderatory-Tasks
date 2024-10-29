import CV from '../models/cv.model';

export const getAllCV = async (req: any, res: any) => {
  const { jobId } = req.params;  
  try {
      const CVs = await CV.find({ jobId }); 

      if (!CVs || CVs.length === 0) {
          return res.status(404).send("No CVs found for this job.");
      }

      res.json(CVs);  
  } catch (error) {
      res.status(500).send('Error fetching CVs for the specified job.');
  }
};
