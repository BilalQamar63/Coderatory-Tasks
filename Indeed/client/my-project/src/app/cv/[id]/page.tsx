'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const page = ({ params }: { params: { jobId: string; cvId: string } }) => {
  const { jobId, cvId } = params; 

  const { data: cvs = [], isLoading, isError } = useQuery({
    queryKey: ['cvs', jobId],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/v1/upload/jobs/${jobId}/details`);
      return response.data;
    },
    enabled: !!jobId, 
    retry: false, 
  });

  const { data: cvDetails, isLoading: isLoadingCV, isError: isErrorCV } = useQuery({
    queryKey: ['cvDetails', cvId],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/v1/upload/jobs/${jobId}/cv/${cvId}`);
      return response.data;
    },
    enabled: !!cvId, 
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500">Error fetching CVs!</div>;
  }

  if (isLoadingCV) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isErrorCV) {
    return <div className="text-center text-red-500">Error fetching CV details!</div>;
  }

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
        <div className="flex flex-col items-center justify-center gap-7 py-6">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center text-gray-900">
              CVs for Job ID: {jobId}
            </CardTitle>
          </CardHeader>

          <Button className="px-10 w-40 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            <Link href="/">Go Back</Link>
          </Button>
        </div>

        {cvs.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-4 border rounded-md shadow-sm p-4 justify-center">
            {cvs.map((cv: any) => (
              <Card key={cv._id} className="w-full text-left p-5 mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">User Details</h1>
                <p>
                  <strong className="text-black-600">Gmail Account:</strong> {cv.gmail}
                </p>
                <p>
                  <strong className="text-black-600">Required Skills:</strong> {cv.skills.join(', ')}
                </p>
                <p>
                  <strong className="text-black-600">Matched Skills:</strong> {cv.matchedSkills.join(', ')}
                </p>
                <CardFooter className="flex justify-center">
                  <Link href={cv.pdfUrl} target="_blank" className="text-blue-500 underline">
                    View CV
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">No CVs found for this job.</div>
        )}

        {cvDetails && (
          <div className="mt-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">CV Details</h1>
            <p>
              <strong className="text-black-600">Gmail Account:</strong> {cvDetails.gmail}
            </p>
            <p>
              <strong className="text-black-600">Skills:</strong> {cvDetails.skills.join(', ')}
            </p>
            <p>
              <strong className="text-black-600">Matched Skills:</strong> {cvDetails.matchedSkills.join(', ')}
            </p>
            <CardFooter className="flex justify-center mt-4">
              <Link href={cvDetails.pdfUrl} target="_blank" className="text-blue-500 underline">
                View CV Details
              </Link>
            </CardFooter>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
