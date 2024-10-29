'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const page = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter(); 

  const [job, setJob] = useState<any>(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const [isError, setIsError] = useState(false); 

  useEffect(() => {
    const fetchJob = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `http://localhost:3000/v1/upload/jobs/${id}`
          );
          setJob(response.data);
          setIsLoading(false);
        } catch (error) {
          setIsError(true);
          setIsLoading(false);
        }
      }
    };

    fetchJob();
  }, [id]); 
  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isError) {
    return <div>Error fetching Job details!</div>;
  }

  const handleApply = () => {
    router.push(`/uploadCV?jobId=${id}`);
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
        <div className="flex flex-col items-center justify-center gap-7 py-6">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center text-gray-900">
              Job Details
            </CardTitle>
          </CardHeader>

          <Button
            className="px-10 w-40 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => router.push('/getAllJobs')} 
          >
            Go Back
          </Button>
          <Button
                className="px-10 w-40 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                onClick={handleApply} 
              >
                Apply for Job
              </Button>
        </div>

        {job && (
          <div className="flex flex-col md:flex-row gap-4 border rounded-md shadow-sm p-4 justify-center">
            <div className="flex-1 p-2">
              <Card className="w-full text-left p-5">
                <h1 className="text-3xl font-bold text-gray-900 px-3 mb-4 text-center">
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center text-gray-900">
                      Job Requirements
                    </CardTitle>
                  </CardHeader>
                </h1>
                <p className="my-2 text-lg text-gray-700">
                  <strong className="text-black-600">Title:</strong> {job.title}
                </p>
                <p className="my-2 text-lg text-gray-700">
                  <strong className="text-black-600">Description:</strong> {job.description}
                </p>
                <p className="my-2 text-lg text-gray-700">
                  <strong className="text-black-600">Requirements:</strong>{' '}
                  {job.requirements.join(', ')}
                </p>
              </Card>
            </div>


          </div>
        )}
      </div>
    </div>
  );
};

export default page;
