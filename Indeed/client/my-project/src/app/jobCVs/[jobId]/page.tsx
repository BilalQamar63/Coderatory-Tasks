'use client';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const fetchCVsForJob = async (jobId: string) => {
  const response = await axios.get(
    `http://localhost:3000/v1/upload/jobs/${jobId}/cv`
  );
  return response.data;
};

const fetchJobDetails = async (jobId: string) => {
  const response = await axios.get(
    `http://localhost:3000/v1/upload/jobs/${jobId}`
  );
  return response.data;
};

const JobCVs = () => {
  const { jobId } = useParams();

  const {
    data: CVs,
    isLoading: loadingCVs,
    isError: errorLoadingCVs,
  } = useQuery({
    queryKey: ['CVs', jobId],
    queryFn: () => fetchCVsForJob(jobId as string),
    enabled: !!jobId,
  });

  const {
    data: jobDetails,
    isLoading: loadingJob,
    isError: errorLoadingJob,
  } = useQuery({
    queryKey: ['jobDetails', jobId],
    queryFn: () => fetchJobDetails(jobId as string),
    enabled: !!jobId,
  });

  if (loadingCVs || loadingJob) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (errorLoadingCVs || errorLoadingJob) {
    return (
      <>
        <div className=" flex  justify-center items-center border border-white text-center  text-gray-600 mt-4">
          <h2>No CVs uploaded yet for this job. Please check back later.</h2>
          <Link href="../adminJob">
            <Button className="mt-4 px-6 py-2  bg-green-700 text-white rounded-md hover:bg-green-800">
              Go Back To All Job's
            </Button>
          </Link>
        </div>
      </>
    );
  }

  // Check if CVs is defined and has length
  const hasCVs = Array.isArray(CVs) && CVs.length > 0;

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-900">
            CVs for Job Title: {jobDetails.title}
          </CardTitle>
        </CardHeader>
        <div className=" flex flex-col justify-center items-center text-center text-gray-600 mt-4">
          
          <div>
          <Link href="../adminJob">
            <Button className="mt-4 px-6 py-2  bg-green-700 text-white rounded-md hover:bg-green-800">
              Go Back To All Job's
            </Button>
          </Link>
          </div>
        </div>

        {!hasCVs ? ( // Check if there are no CVs
          <div className="text-center text-gray-600 mt-4">
            <p>No CVs uploaded yet for this job. Please check back later.</p>
          </div>
        ) : (
          <ul className="flex flex-wrap gap-5 py-3">
            {CVs.map((cv: any) => (
              <li key={cv._id} className="mb-4">
                <Card className="w-[450px] relative">
                  <div className="border rounded-md shadow-sm p-4">
                    <p>
                      <strong className="text-lg">Email:</strong> {cv.gmail}
                    </p>
                    <p>
                      <strong className="text-lg">Job Title:</strong>{' '}
                      {cv.jobTitle}
                    </p>
                    <p>
                      <strong className="text-lg">Status:</strong> {cv.status}
                    </p>
                    <p>
                      <strong className="text-lg">Percentage:</strong>{' '}
                      {cv.percentage}%
                    </p>
                    <p>
                      <strong className="text-lg">Matched Skills:</strong>{' '}
                      {cv.matchedSkills.join(', ')}
                    </p>
                    <a
                      href={cv.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View CV PDF
                    </a>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default JobCVs;
