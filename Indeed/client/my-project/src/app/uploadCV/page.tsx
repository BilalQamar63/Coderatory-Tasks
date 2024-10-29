'use client';
import { useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import useModalStore from '@/stores/modalStore';
import Link from 'next/link';

const fetchJobDetails = async (jobId: string) => {
  const response = await axios.get(
    `http://localhost:3000/v1/upload/jobs/${jobId}`
  );
  return response.data;
};

const UploadCV = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const { isModalOpen, openModal, closeModal } = useModalStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');

  const {
    data: job,
    isLoading: jobLoading,
    isError: jobError,
  } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => fetchJobDetails(jobId as string),
    enabled: !!jobId,
  });

  const uploadCv = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('cv', file);

    const response = await axios.post(
      `http://localhost:3000/v1/upload/jobs/${jobId}/cv`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  };

  const mutation = useMutation({
    mutationFn: uploadCv,
    onSuccess: () => {
      openModal();
      setFile(null);
    },
    onError: (err: any) => {
      setError(
        `Failed to upload CV: ${err.response?.data?.message || err.message}`
      );
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    const validTypes = ['application/pdf'];

    if (selectedFile && validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a valid PDF document.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a CV to upload.');
      return;
    }
    if (!jobId) {
      setError('No job available to upload CV for.');
      return;
    }
    mutation.mutate(file);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-center">
        <Link href="../getAllJobs">
          <Button className="mb-4 bg-blue-500 text-white hover:bg-blue-700 transition duration-200">
            Go Back To All Job's
          </Button>
        </Link>
        </div>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center mb-4">
            Upload Your CV for{' '}
            {jobLoading ? '...' : jobError ? 'Error' : job?.title}
          </CardTitle>
        </CardHeader>

        {jobLoading ? (
          <p>Loading job details...</p>
        ) : jobError ? (
          <p>Failed to load job details. Please try again later.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="cv" className="block text-gray-700 mb-2">
                Choose your CV (PDF):
              </label>
              <input
                type="file"
                id="cv"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full border border-gray-300 rounded-md p-2 text-gray-700"
                required
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <CardFooter>
              <Button
                type="submit"
                className="block w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition duration-200"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Uploading...' : 'Submit CV'}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto shadow-lg">
            <Alert>
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                CV uploaded successfully for job ID: {jobId}
              </AlertDescription>
              <Button
                onClick={closeModal}
                className="mt-4 bg-blue-500 text-white"
              >
                Close
              </Button>
            </Alert>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCV;
