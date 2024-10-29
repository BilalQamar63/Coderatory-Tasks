'use client';
import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import useModalStore from '@/stores/modalStore';
import Link from 'next/link';

const UploadJobs = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');
    const [error, setError] = useState('');

    const { isModalOpen, openModal, closeModal } = useModalStore();

    const mutation = useMutation({
        mutationFn: async () => {
            console.log('Sending data:', { title, description, requirements }); 
            const response = await axios.post(
                'http://localhost:3000/v1/upload/jobs',
                {
                    title,
                    description,
                    requirements: requirements.split(',').map((req) => req.trim()), 
                }
            );
            return response.data;
        },
        onSuccess: () => {
            openModal();
            setTitle('');
            setDescription('');
            setRequirements('');
            setError('');
        },
        onError: (err: any) => {
            console.error('Error response:', err.response); 
            setError(err.response?.data?.message || 'Error posting job');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting job:', { title, description, requirements });
        mutation.mutate();
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-md rounded-lg p-6 w-[450px]">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-lg font-semibold text-gray-800 mb-2">
                            Job Title
                        </label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-semibold text-gray-800 mb-2">
                            Job Description
                        </label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-semibold text-gray-800 mb-2">
                            Requirements
                        </label>
                        <Input
                            value={requirements}
                            onChange={(e) => setRequirements(e.target.value)}
                        />
                    </div>
                    <Button
                        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                        type="submit"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'Posting...' : 'Post Job'}
                    </Button>
                    {error && <p className="text-red-500">{error}</p>}
                </form>

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-auto">
                            <Alert className="flex flex-col gap-4 items-start p-4 bg-blue-50 border-l-4 border-blue-500">
                                <AlertTitle className="text-lg font-bold text-blue-900">
                                    Alert!
                                </AlertTitle>
                                <AlertDescription className="text-gray-800">
                                    Job posted successfully.
                                </AlertDescription>
                                <div className="flex justify-end w-full">
                                    <Button
                                        onClick={closeModal}
                                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                                    >
                                        Close
                                    </Button>
                                </div>
                            </Alert>
                        </div>
                    </div>
                )}
                <Link href="../adminJob">
                    <Button className="w-full mt-2 bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition duration-200">
                        See All Jobs
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default UploadJobs;
