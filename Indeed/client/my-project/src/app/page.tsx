import Link from 'next/link';
import { Button } from '@/components/ui/button';
export default function Home() {
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800">
            Welcome!
          </h1>
          <p className="mb-6 text-gray-600">
            Thanks for visiting here. We're glad to have you!
          </p>
          <div className='flex flex-col p-3 '>
            <Link href="./getAllJobs">
              <Button className="bg-blue-500 m-2 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
                Apply for Jobs
              </Button>
            </Link>
            <Link href="./adminJob">
              <Button className="bg-blue-500 m-2 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
                Upload Jobs Here
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
