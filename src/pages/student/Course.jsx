import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router-dom";
import CourseProgressBar from "@/components/CourseProgress";
import { useGetCourseProgressQuery } from "@/features/api/courseProgressApi";
import { formatCurrency } from "@/lib/utils/currency";

const Course = ({ course = {}, showProgress = false }) => {
  if (!course) return null;

  const { data: progressData } = useGetCourseProgressQuery(course?._id, {
    skip: !showProgress || !course?._id
  });

  const totalLectures = course?.lectures?.length || 0;
  const completedLectures = progressData?.completedLectures?.length || 0;

  return (
    <Link to={`/course-detail/${course?._id}`} className="block h-full">
      <Card className="h-full overflow-hidden rounded-2xl sm:rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 shadow-lg hover:shadow-purple-500/20 border border-purple-100 dark:border-purple-900/20 transform hover:-translate-y-1 transition-all duration-300">
        <div className="relative group aspect-video sm:aspect-[16/10]">
          <img
            src={course?.courseThumbnail || "https://placehold.co/600x400?text=Course+Thumbnail"}
            alt={course?.courseTitle || "Course"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4 relative backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h1 className="font-bold text-base sm:text-lg leading-tight hover:text-purple-600 dark:hover:text-purple-400 transition-colors line-clamp-2">
                {course?.courseTitle || "Untitled Course"}
              </h1>
              <Badge className="shrink-0 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200">
                {course?.level || "All Levels"}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {course?.courseDescription || "No description available"}
            </p>
          </div>
          
          {showProgress && (
            <div className="pt-2 border-t border-purple-100 dark:border-purple-900/20">
              <CourseProgressBar
                totalLectures={totalLectures}
                completedLectures={completedLectures}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2 border-t border-purple-100 dark:border-purple-900/20">
            <div className="flex items-center gap-2 sm:gap-3">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 ring-2 ring-purple-500/20 shadow-lg">
                <AvatarImage 
                  src={course?.creator?.photoUrl || "https://github.com/shadcn.png"} 
                  alt={course?.creator?.name || 'Instructor'} 
                />
                <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200">
                  {course?.creator?.name?.charAt(0) || 'I'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <h2 className="font-medium text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                  {course?.creator?.name || "Instructor"}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {course?.totalStudents || 0} students
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {course?.price ? formatCurrency(course.price) : 'Free'}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {course?.duration || '0h 0m'} total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;
