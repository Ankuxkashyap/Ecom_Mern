import React from "react";

const Error = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-600">Payment Failed</h1>
        <p className="mt-4 text-gray-600">Something went wrong or the payment was canceled.</p>
        <a
          href="/"
          className="mt-6 inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
        >
          Try Again
        </a>
      </div>
    </div>
  );
};

export default Error;
