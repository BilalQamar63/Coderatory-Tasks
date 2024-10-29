'use client';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import '../globals.css';

const fetchJobs = async () => {
  const response = await axios.get(`http://localhost:3000/v1/upload/jobs`);
  return response.data;
};

const GetAllJobs = () => {
  const {
    data: Jobs = [], // Default to an empty array
    isLoading,
    isError,
  } = useQuery({queryKey:['Jobs'],queryFn: fetchJobs});

  const handleApply = useCallback((jobId: string) => {
    window.location.href = `/uploadCV?jobId=${jobId}`;
  }, []);

  const handleDetails = useCallback((jobId: string) => {
    window.location.href = `/jobs/${jobId}`;
  }, []);



  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-md rounded-lg p-6 w-[450px] text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Error fetching Jobs!</h2>
          <p className="text-lg text-gray-600 mt-2">Please try again later.</p>
          
        </div>
      </div>
    );
  }

  if (Jobs.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-md rounded-lg p-6 w-[450px] text-center">
          <h2 className="text-2xl font-semibold text-gray-800">No Jobs Uploaded!</h2>
          <p className="text-lg text-gray-600 mt-2">Please visit later for new job opportunities.</p>
          <Link href="../">
            <Button className="px-4 py-2 m-2 bg-blue-500 rounded-md hover:bg-blue-700">
              Go Back To Home Page
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-900">
            All Jobs Are Here
          </CardTitle>
          
        </CardHeader>
        <div className="flex justify-center items-center">
        <Link href="../">
            <Button className="px-4 py-2 m-2 bg-blue-500 rounded-md hover:bg-blue-700">
              Go Back To Home Page
            </Button>
          </Link>
        </div>

        <ul className="flex flex-wrap gap-5 py-3">
          {Jobs.map((job: any) => (
            <li key={job._id} className="mb-4">
              <Card className="w-[450px] relative">
                <div className="border h-[270px] p-4 rounded-md shadow-sm">
                  <p className="flex items-start justify-between space-x-4 p-2 border rounded-md bg-gray-50">
                    <strong className="text-2xl font-semibold text-gray-800 mb-2">Title:</strong>
                    <span className="text-xl font-medium text-gray-600 px-2 py-1">{job.title}</span>
                  </p>
                  <p className="flex items-start justify-between space-x-4 p-2 border rounded-md bg-gray-50">
                    <strong className="text-2xl font-semibold text-gray-800 mb-2">Requirements:</strong>
                    <span className="text-xl font-medium text-gray-600 px-2 py-1">{job.requirements.join(', ')}</span>
                  </p>

                  <CardFooter className="absolute bottom-0 left-0 right-0 flex justify-between gap-4 mt-3 bg-white">
                    <Button
                      onClick={() => handleApply(job._id)}
                      className="px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
                    >
                      Apply here
                    </Button>
                    <Button
                      onClick={() => handleDetails(job._id)}
                      className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GetAllJobs;
