import React from "react";
import Course from "./Course";
import { useLoadUserQuery } from "@/features/api/authApi";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyLearning = () => { 
  const navigate = useNavigate();
  const { data: userData, isLoading: userLoading } = useLoadUserQuery();
  const { data: purchaseData, isLoading: purchaseLoading } = useGetPurchasedCoursesQuery();

  const isLoading = userLoading || purchaseLoading;
  const courses = purchaseData?.purchasedCourse?.map(purchase => ({
    ...purchase.courseId,
    _id: purchase.courseId._id,
    creator: purchase.courseId.creator
  })) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100 via-white to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 -z-10 blur-3xl opacity-30 dark:opacity-20">
            <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-purple-500 to-indigo-500 opacity-30"></div>
          </div>
          <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 inline-block mb-4">
            My Learning Path
          </span>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent mb-4">
            My Learning Journey
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Continue your path to success with your enrolled courses
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 -z-10 blur-3xl opacity-30 dark:opacity-20">
            <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-30"></div>
          </div>
          
          {!Array.isArray(courses) || courses.length === 0 ? (
            <div className="text-center py-16 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-xl border border-purple-100 dark:border-purple-900/20">
              <div className="mb-6">
                <div className="mx-auto h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <svg className="h-8 w-8 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Courses Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto mb-6">
                Start your learning journey by enrolling in your first course
              </p>
              <button
                onClick={() => navigate("/course/search")}
                className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white rounded-full px-6 py-2 shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Course key={course?._id || Math.random()} course={course} showProgress={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyLearning;
