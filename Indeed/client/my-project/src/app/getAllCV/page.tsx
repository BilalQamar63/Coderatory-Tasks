'use client';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import useModalStore from '@/stores/modalStore';
import '../globals.css';
import { useState } from 'react';
import Link from 'next/link';

const fetchCVs = async () => {
  const response = await axios.get(`http://localhost:3000/v1/upload/cvs`);
  return response.data;
};

const deleteCV = async (id: string) => {
  await axios.delete(`http://localhost:3000/v1/upload/cvs/${id}`);
};

const GetAllCVs = () => {
  const { isModalOpen, openModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();
  const [selectedCV, setSelectedCV] = useState<any>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['CVs'],
    queryFn: fetchCVs,
  });

  const mutationDelete = useMutation({
    mutationFn: deleteCV,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['CVs'] });
      openModal();
    },
    onError: (error: any) => {
      console.error('Error deleting CV:', error);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error fetching CVs!
      </div>
    );
  }

  const handleViewDetails = (cv: any) => {
    setSelectedCV(cv);
    openModal();
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-900 mb-4">
            Uploaded CVs
          </CardTitle>
        </CardHeader>
        <div className="flex justify-center p-6">
      <Link href='../getAllJobs'>
        <div className="flex justify-center items-center">
          <Button className='bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'>
            View All Jobs
          </Button>
        </div>
      </Link>
    </div>

        <ul className="flex flex-wrap gap-6">
          {data.cvs.length > 0 ? (
            data.cvs.map((cv: any) => (
              <li key={cv._id} className="flex-grow">
                <Card className="w-[400px] h-[300px] p-4 border rounded-md shadow-sm transition-transform hover:scale-105">
                  <p className="font-semibold text-lg"><strong>Job For:</strong> {cv.jobTitle}</p>
                  <p><strong>Gmail Account:</strong> {cv.gmail}</p>
                  <p><strong>Status:</strong> {cv.status}</p>

                  <div className="flex justify-between mt-4">
                    <Button
                      onClick={() => handleViewDetails(cv)}
                      className="bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => mutationDelete.mutate(cv._id)}
                      className="bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">No CVs found.</p>
          )}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-auto">
            {selectedCV ? (
              <>
                <h2 className="text-xl font-bold">CV Details</h2>
                <p><strong>Gmail Account:</strong> {selectedCV.gmail}</p>
                <p><strong>Skills:</strong> {selectedCV.matchedSkills.join(', ')}</p>
                <p><strong>Percentage:</strong> {selectedCV.percentage}</p>
                <p><strong>Status:</strong> {selectedCV.status}</p>
                <p>
                  <strong>CV Link:</strong>
                  <a
                    href={selectedCV.pdfUrl}
                    className="text-blue-500 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View CV
                  </a>
                </p>
              </>
            ) : (
              <Alert className="flex flex-col gap-4 items-start p-4 bg-blue-50 border-l-4 border-blue-500">
                <AlertTitle className="text-lg font-bold text-blue-900">Alert!</AlertTitle>
                <AlertDescription className="text-gray-800">
                  CV has been deleted from your Database.
                </AlertDescription>
              </Alert>
            )}
            <div className="flex justify-end w-full mt-4">
              <Button
                onClick={closeModal}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllCVs;
