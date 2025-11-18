import React from "react";
import toast from "react-hot-toast";

const Success = () => {
  
      toast.success('Order placed successfully!');
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
        <p className="mt-4 text-gray-600">Thank you for your purchase.</p>
        <a
          href="/"
          className="mt-6 inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default Success;
