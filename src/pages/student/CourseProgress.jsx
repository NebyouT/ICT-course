import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useGetCourseProgressQuery,
  useCompleteCourseMutation,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation 
} from "@/features/api/courseProgressApi";
import { useGetTestResultByCourseQuery } from "@/features/api/testApi";
import { Award, CheckCircle, Loader2, PenSquare, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { FaCheckCircle, FaCircle, FaVideo, FaFilePdf, FaFile } from 'react-icons/fa';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CourseProgressBar from "@/components/CourseProgressBar";

const CourseProgress = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);
  const { data: testResult } = useGetTestResultByCourseQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse] = useCompleteCourseMutation();
  const [inCompleteCourse] = useInCompleteCourseMutation();

  const [activeContent, setActiveContent] = useState(null);
  const [contentProgress, setContentProgress] = useState({});

  useEffect(() => {
    if (data?.data) {
      const progress = {};
      data.data.progress.forEach((prog) => {
        progress[prog.lectureId] = prog.viewed;
      });
      setContentProgress(progress);
    }
  }, [data]);

  const handleContentComplete = async (lectureId) => {
    try {
      await updateLectureProgress({ courseId, lectureId }).unwrap();
      await refetch();
      toast.success('Progress updated successfully');
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const getContentIcon = (contentType) => {
    switch (contentType) {
      case 'video':
        return <FaVideo className="text-blue-500" />;
      case 'pdf':
        return <FaFilePdf className="text-red-500" />;
      case 'text':
        return <FaFile className="text-gray-500" />;
      default:
        return <FaFile className="text-gray-500" />;
    }
  };

  const handleDownloadPDF = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'lecture.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  const renderContent = (lecture) => {
    if (!lecture) return null;

    const isCompleted = contentProgress[lecture._id];
    const currentIndex = courseDetails.lectures.findIndex(l => l._id === lecture._id);
    const prevLecture = currentIndex > 0 ? courseDetails.lectures[currentIndex - 1] : null;
    const nextLecture = currentIndex < courseDetails.lectures.length - 1 ? courseDetails.lectures[currentIndex + 1] : null;

    return (
      <div className="mt-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getContentIcon(lecture.contentType)}
                <h3 className="text-lg font-semibold">{lecture.lectureTitle}</h3>
              </div>
              <Button
                onClick={() => handleContentComplete(lecture._id)}
                variant={isCompleted ? "outline" : "default"}
                className={isCompleted ? "text-green-600" : ""}
              >
                {isCompleted ? (
                  <>
                    <FaCheckCircle className="mr-2" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <FaCircle className="mr-2" />
                    <span>Mark as Complete</span>
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4">
              {lecture.contentType === 'video' && lecture.videoUrl && (
                <div className="aspect-w-16 aspect-h-9">
                  <video
                    controls
                    className="w-full rounded-lg"
                    src={lecture.videoUrl}
                    onEnded={() => !isCompleted && handleContentComplete(lecture._id)}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {lecture.contentType === 'pdf' && lecture.pdfUrl && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadPDF(lecture.pdfUrl, `${lecture.lectureTitle}.pdf`)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                  <div className="relative w-full h-[600px] bg-white rounded-lg shadow overflow-hidden">
                    <iframe
                      src={`${lecture.pdfUrl}#toolbar=0&navpanes=0`}
                      className="absolute inset-0 w-full h-full"
                      title={lecture.lectureTitle}
                      onLoad={() => {
                        console.log('PDF loaded:', lecture.lectureTitle);
                      }}
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>* Progress is tracked when you mark the content as complete</p>
                  </div>
                </div>
              )}

              {lecture.contentType === 'text' && lecture.textContent && (
                <div>
                  <div className="prose max-w-none">
                    <div className="bg-gray-50 rounded-lg p-4">
                      {lecture.textContent}
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p>* Progress is tracked when you mark the content as complete</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-600">{lecture.description}</p>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setActiveContent(prevLecture)}
                disabled={!prevLecture}
                className={!prevLecture ? 'opacity-50 cursor-not-allowed' : ''}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Lecture
              </Button>

              <div className="text-sm text-gray-600">
                Lecture {currentIndex + 1} of {courseDetails.lectures.length}
              </div>

              <Button
                variant="outline"
                onClick={() => setActiveContent(nextLecture)}
                disabled={!nextLecture}
                className={!nextLecture ? 'opacity-50 cursor-not-allowed' : ''}
              >
                Next Lecture
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const calculateProgress = () => {
    if (!data?.data?.progress?.length) return 0;
    const completed = data.data.progress.filter((prog) => prog.viewed).length;
    return Math.round((completed / data.data.progress.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Failed to load course details
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          There was an error loading the course progress. Please try again later.
        </p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  const { courseDetails, progress = [], completed: courseCompleted } = data.data;

  if (!courseDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Course not found
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          The requested course could not be found.
        </p>
      </div>
    );
  }

  if (!Array.isArray(courseDetails.lectures) || courseDetails.lectures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No lectures available
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This course doesn't have any lectures yet.
        </p>
      </div>
    );
  }

  const { courseTitle } = courseDetails;
  const hasPassed = testResult?.result?.passed || false;

  const handleLectureProgress = async (lectureId) => {
    if (!lectureId) return;
    try {
      await updateLectureProgress({ courseId, lectureId }).unwrap();
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update lecture progress");
    }
  };

  const handleSelectLecture = (lecture) => {
    if (!lecture) return;
    setActiveContent(lecture);
    handleLectureProgress(lecture._id);
  };

  const handleCompleteCourse = async () => {
    try {
      await completeCourse(courseId).unwrap();
      await refetch();
      toast.success('Course marked as complete');
    } catch (error) {
      toast.error('Failed to mark course as complete');
    }
  };

  const handleInCompleteCourse = async () => {
    try {
      await inCompleteCourse(courseId).unwrap();
      await refetch();
      toast.success('Course marked as incomplete');
    } catch (error) {
      toast.error('Failed to mark course as incomplete');
    }
  };

  const handleTakeTest = () => {
    navigate(`/course-test/${courseId}`);
  };

  const handleViewCertificate = () => {
    navigate(`/certificate/${courseId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Course title and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="space-y-2 flex-1">
          <h1 className="text-2xl font-bold">{courseTitle}</h1>
          <CourseProgressBar 
            progress={progress} 
            totalLectures={courseDetails.lectures.length} 
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={courseCompleted ? handleInCompleteCourse : handleCompleteCourse}
            variant={courseCompleted ? "outline" : "default"}
          >
            {courseCompleted ? (
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" /> <span>Completed</span>
              </div>
            ) : (
              "Mark as completed"
            )}
          </Button>
          {courseCompleted && (hasPassed ? (
            <Button
              onClick={handleViewCertificate}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Award className="h-4 w-4 mr-2" />
              View Certificate
            </Button>
          ) : (
            <Button
              onClick={handleTakeTest}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <PenSquare className="h-4 w-4 mr-2" />
              Take Test
            </Button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Lecture List */}
        <div className="md:w-2/5">
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold text-xl mb-4">Course Lectures</h2>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {courseDetails.lectures.map((lecture, index) => (
                  <button
                    key={lecture._id}
                    onClick={() => handleSelectLecture(lecture)}
                    className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${
                      activeContent?._id === lecture._id
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium">{index + 1}.</span>
                      <div>
                        {getContentIcon(lecture.contentType)}
                      </div>
                      <span className="font-medium truncate">{lecture.lectureTitle}</span>
                    </div>
                    {contentProgress[lecture._id] && (
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Display */}
        <div className="md:w-3/5">
          {activeContent ? (
            renderContent(activeContent)
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-600">
                Select a lecture to start learning
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
