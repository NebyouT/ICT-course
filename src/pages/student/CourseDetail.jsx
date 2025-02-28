import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { useGetCourseProgressQuery } from "@/features/api/courseProgressApi";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";
import CourseProgressBar from "@/components/CourseProgressBar";
import { CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";

const CourseDetail = () => {
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId);
  const { data: progressData } = useGetCourseProgressQuery(courseId, {
    skip: !data?.isPurchased,
  });

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Failed to load course details</h1>;
  if (!data?.course) return <h1>Course not found</h1>;

  const { course, isPurchased, hasPendingPurchase } = data;

  const handleContinueCourse = () => {
    navigate(`/course-progress/${courseId}`);
  };

  return (
    <div className="space-y-5">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-purple-600 to-indigo-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-indigo-400 to-purple-600 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
      </div>
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-indigo-600/20"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-soft-light"></div>
        <div className="relative max-w-7xl mx-auto py-12 px-4 ">
          <div className="space-y-4">
            {/* Course Title */}
            <div className="space-y-1">
              <h1 className="font-bold text-xl md:text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {course?.courseTitle}
              </h1>
              <p className="text-sm text-gray-300">{course?.subTitle}</p>
            </div>

            {/* Course Meta */}
            <div className="flex flex-wrap gap-4 text-xs">
              {/* Creator Info */}
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-full bg-purple-600/20">
                  <svg className="w-3 h-3 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Created by</p>
                  <p className="font-medium text-purple-300">{course?.creator?.name}</p>
                </div>
              </div>

              {/* Last Updated */}
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-full bg-indigo-600/20">
                  <BadgeInfo size={12} className="text-indigo-300" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Last updated</p>
                  <p className="font-medium text-indigo-300">{new Date(course?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Enrollment Info */}
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-full bg-blue-600/20">
                  <svg className="w-3 h-3 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Students enrolled</p>
                  <p className="font-medium text-blue-300">{course?.totalEnrolled || 0} students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        {/* Main Content */}
        <div className="w-full lg:w-2/3 space-y-6">
          {/* Course Progress Section (if purchased) */}
          {isPurchased && progressData?.data && (
            <CourseProgressBar
              progress={progressData.data.progress}
              totalLectures={course.lectures.length}
              className="bg-white dark:bg-gray-800/50 border-0 shadow-lg"
            />
          )}

          {/* Description Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">About This Course</h2>
            <p
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: course?.description }}
            />
          </div>

          {/* What You'll Learn Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">What You'll Learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course?.whatYouWillLearn?.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Content Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Course Content</h2>
            <div className="space-y-3">
              {course?.lectures?.map((lecture, index) => (
                <div
                  key={lecture._id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <PlayCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">{lecture.lectureTitle}</h3>
                      <p className="text-sm text-gray-500">Lecture {index + 1}</p>
                    </div>
                  </div>
                  {!isPurchased && (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="sticky top-24">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {course?.introVideo ? (
                  <ReactPlayer
                    url={course.introVideo}
                    width="100%"
                    height="auto"
                    controls
                  />
                ) : (
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <p className="text-gray-500">No preview available</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-6 space-y-4">
                <div className="space-y-2 w-full">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{formatCurrency(course?.price || 0)}</span>
                    {isPurchased && (
                      <Button onClick={handleContinueCourse}>
                        Continue Learning
                      </Button>
                    )}
                  </div>
                  {!isPurchased && (
                    <BuyCourseButton
                      courseId={courseId}
                      disabled={hasPendingPurchase}
                    />
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
