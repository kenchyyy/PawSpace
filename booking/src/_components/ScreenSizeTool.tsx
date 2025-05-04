import React from 'react';

const ScreenSizeTool = () => {
  return (
    <div className="p-4">
      {/* Text that changes based on screen size */}
      <p className="text-center">
        <span className="block sm:hidden">Current size: Extra Small (xs)</span>
        <span className="hidden sm:block md:hidden">Current size: Small (sm)</span>
        <span className="hidden md:block lg:hidden">Current size: Medium (md)</span>
        <span className="hidden lg:block xl:hidden">Current size: Large (lg)</span>
        <span className="hidden xl:block 2xl:hidden">Current size: Extra Large (xl)</span>
        <span className="hidden 2xl:block">Current size: 2XL (2xl)</span>
      </p>

      {/* Optional: Visual indicator */}
      <div className="mt-4 flex justify-center gap-2">
        <span className="h-4 w-4 rounded-full bg-red-500 sm:bg-gray-300"></span>
        <span className="h-4 w-4 rounded-full bg-gray-300 sm:bg-red-500 md:bg-gray-300"></span>
        <span className="h-4 w-4 rounded-full bg-gray-300 md:bg-red-500 lg:bg-gray-300"></span>
        <span className="h-4 w-4 rounded-full bg-gray-300 lg:bg-red-500 xl:bg-gray-300"></span>
        <span className="h-4 w-4 rounded-full bg-gray-300 xl:bg-red-500 2xl:bg-gray-300"></span>
        <span className="h-4 w-4 rounded-full bg-gray-300 2xl:bg-red-500"></span>
      </div>
    </div>
  );
};

export default ScreenSizeTool;