import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/utils/currency";

const SearchResult = ({ course }) => {
  if (!course || !course._id) {
    return null; // Don't render anything if course is null or missing _id
  }
   
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-300 py-4 gap-4">
      <Link
        to={`/course-detail/${course._id}`}
        className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
      >
        <img
          src={course.courseThumbnail || '/placeholder-image.jpg'}
          alt="course-thumbnial"
          className="h-32 w-full md:w-56 object-cover rounded"
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-lg md:text-xl">{course.courseTitle || 'Untitled Course'}</h1>
          <p className="text-sm text-gray-600">{course.subTitle || ''}</p>
          <p className="text-sm text-gray-700">
            Intructor: <span className="font-bold">{course.creator?.name || 'Unknown'}</span>{" "}
          </p>
          <Badge className="w-fit mt-2 md:mt-0">{course.courseLevel || 'N/A'}</Badge>
        </div>
      </Link>
      <div className="mt-4 md:mt-0 md:text-right w-full md:w-auto">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-lg md:text-xl">{formatCurrency(course.coursePrice || 0)} ETB</h1>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
