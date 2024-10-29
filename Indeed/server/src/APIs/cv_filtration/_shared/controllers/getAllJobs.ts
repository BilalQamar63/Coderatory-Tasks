import Job from '../models/job.model';

export const getAllJobs = async (_req: any, res: any) => {
  try {
    const jobs = await Job.find({});

    if (!jobs || jobs.length === 0) {
      return res.status(404).send("No jobs found!");
    }

    res.json(jobs); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching jobs');
  }
};
