export default function CalendarSkeleton() {
  return (
    <div className='flex w-screen h-screen gap-6 bg-gray-900 p-6'>
      <div className='hidden lg:block lg:w-3/12 space-y-4'>
        <div className='py-6 px-4 border-b border-gray-700 animate-pulse bg-gray-800 rounded-md h-10'></div>
        <div className='p-4 space-y-4'>
          <div className='mb-2 px-4 animate-pulse bg-gray-800 rounded-md h-8 w-1/2'></div>
          <div className='bg-gray-700 border border-gray-600 shadow-lg px-4 py-6 rounded-md animate-pulse'>
            <div className='animate-pulse bg-gray-800 rounded-full w-6 h-6'></div>
            <div className='mt-3 animate-pulse bg-gray-800 rounded w-3/4 h-4'></div>
            <div className='mt-2 animate-pulse bg-gray-800 rounded w-1/2 h-4'></div>
            <div className='mt-4 animate-pulse bg-gray-800 rounded-full w-20 h-6'></div>
          </div>

          <div className='mt-6 mb-2 px-4 animate-pulse bg-gray-800 rounded-md h-8 w-2/3'></div>
          <div className='bg-gray-700 border border-gray-600 shadow-lg px-4 py-6 rounded-md animate-pulse'>
            <div className='animate-pulse bg-gray-800 rounded-full w-6 h-6'></div>
            <div className='mt-3 animate-pulse bg-gray-800 rounded w-3/4 h-4'></div>
            <div className='mt-2 animate-pulse bg-gray-800 rounded w-1/2 h-4'></div>
            <div className='mt-4 animate-pulse bg-gray-800 rounded-full w-20 h-6'></div>
          </div>
        </div>
      </div>
      <div className='w-full lg:w-9/12 h-full bg-gray-700 rounded-md animate-pulse'>
        <div className='bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center'>
          <div className='animate-pulse bg-gray-700 rounded w-32 h-8'></div>
          <div className='flex gap-2'>
            <div className='bg-gray-700 text-gray-500 px-3 py-1 rounded animate-pulse w-16 h-8'></div>
            <div className='bg-gray-600 text-gray-400 px-4 py-1 rounded animate-pulse w-24 h-8'></div>
            <div className='bg-gray-700 text-gray-500 px-3 py-1 rounded animate-pulse w-16 h-8'></div>
          </div>
        </div>
        <div className='p-4 grid grid-cols-7 gap-2 mt-4 h-[calc(100% - 60px)]'>
          {/* Placeholder for day cells */}
          {Array.from({ length: 7 * 6 }).map((_, i) => (
            <div
              key={i}
              className='h-full bg-gray-800 rounded-md animate-pulse'
            />
          ))}
        </div>
      </div>
    </div>
  );
}
