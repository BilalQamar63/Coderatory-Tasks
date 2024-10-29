'use client';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import '../globals.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

interface Job {
  _id: string;
  title: string;
  requirements: string[];
}

const fetchJobs = async (): Promise<Job[]> => {
  const response = await axios.get(`http://localhost:3000/v1/upload/jobs`);
  return response.data;
};

const deleteJob = async (id: string) => {
  await axios.delete(`http://localhost:3000/v1/upload/jobs/${id}`);
};

const AdminJob = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const { data: Jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ['Jobs'],
    queryFn: fetchJobs,
  });

  const mutationDelete = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Jobs'] });
      setSelectedJobId(null);
    },
  });

  const handleDelete = (jobId: string) => {
    setSelectedJobId(jobId);
  };

  const confirmDelete = () => {
    if (selectedJobId) {
      mutationDelete.mutate(selectedJobId);
    }
  };

  const cancelDelete = () => {
    setSelectedJobId(null);
  };

  const handleFetchCVs = (jobId: string) => {
    router.push(`/jobCVs/${jobId}/`);
  };

  const handleUploadJob = () => {
    router.push('../uploadJobs');
  };

  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (Jobs.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-md rounded-lg p-6 w-[450px] text-center">
          <h2 className="text-2xl font-semibold text-gray-800">No Jobs Uploaded!</h2>
          <p className="text-lg text-gray-600 mt-2">Please upload a job to give opportunities.</p>
          <Button onClick={handleUploadJob} className="mt-4 px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-800">
            Upload Job
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-900">All Jobs Are Here</CardTitle>
        </CardHeader>
        <div className="flex justify-center items-center">
        <Link href="../">
          <Button className="mb-4 px-2 m-1 bg-blue-500 text-white hover:bg-blue-700 transition duration-200">
            Go Back To Home Page
          </Button>
        </Link>
        <Link href="../uploadJobs">
          <Button className="mb-4 px-2 m-1 bg-blue-500 text-white hover:bg-blue-700 transition duration-200">
            Upload Jobs
          </Button>
        </Link>
        </div>

        <ul className="flex flex-wrap gap-5 py-3">
          {Jobs.map((job: Job) => (
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
                      onClick={() => handleDelete(job._id)}
                      className="px-6 py-2 bg-red-700 text-white rounded-md hover:bg-red-800"
                    >
                      Delete Job
                    </Button>
                    <Button
                      onClick={() => handleFetchCVs(job._id)}
                      className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
                    >
                      View CVs
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>

      {selectedJobId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center w-[300px]">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this job?</h3>
            <div className="flex justify-center gap-4">
              <Button onClick={confirmDelete} className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800">
                Yes
              </Button>
              <Button onClick={cancelDelete} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJob;
