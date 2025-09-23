// This is a simple test to verify Tailwind CSS is working
import React from "react";

const TestPage = () => {
  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">
          Tailwind CSS Test
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Test Card 1
            </h2>
            <p className="text-gray-600 mb-4">
              This card should have a white background, shadow, and rounded
              corners.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              Test Button
            </button>
          </div>

          <div className="bg-green-100 p-6 rounded-lg border-2 border-green-300">
            <h2 className="text-xl font-semibold text-green-800 mb-4">
              Test Card 2
            </h2>
            <p className="text-green-700 mb-4">
              This card should have a green background and border.
            </p>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
              Green Button
            </button>
          </div>

          <div className="bg-red-100 p-6 rounded-lg border-2 border-red-300">
            <h2 className="text-xl font-semibold text-red-800 mb-4">
              Test Card 3
            </h2>
            <p className="text-red-700 mb-4">
              This card should have a red background and border.
            </p>
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
              Red Button
            </button>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gray-100 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Responsive Test
          </h3>
          <div className="text-sm md:text-base lg:text-lg xl:text-xl">
            This text should change size based on screen size.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
