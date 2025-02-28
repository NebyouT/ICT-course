import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import Course from "./Course";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";

const Courses = () => {
  const { data, isLoading, isError } = useGetPublishedCourseQuery();

  if (isError) return <h1>Some error occurred while fetching courses.</h1>

  return (
    <div className="relative isolate min-h-screen bg-gradient-to-b from-white via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900">
      {/* Background effects */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-br from-indigo-300 via-purple-400 to-pink-300 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>
      
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-br from-pink-300 via-purple-400 to-indigo-300 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
      </div>

      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-900 [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#e9d5ff_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#4c1d95_100%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 -z-10 blur-3xl opacity-30 dark:opacity-20">
            <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-br from-pink-300 via-purple-400 to-indigo-300 opacity-30"></div>
          </div>
          <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 inline-block mb-4">
            Available Courses
          </span>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent mb-4">
            Explore Our Courses
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover a world of knowledge with our expertly crafted courses
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
          ) : (
            data?.courses && data.courses.map((course, index) => <Course key={index} course={course} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;

const CourseSkeleton = () => {
  return (
    <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 shadow-lg hover:shadow-purple-500/20 border border-purple-100 dark:border-purple-900/20 rounded-3xl overflow-hidden transition-all duration-300">
      <Skeleton className="w-full h-48" />
      <div className="px-6 py-5 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-purple-100 dark:border-purple-900/20">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
};
