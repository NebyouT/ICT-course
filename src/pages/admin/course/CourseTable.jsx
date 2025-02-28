import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import { Edit, Plus, Loader2 } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/utils/currency";

const CourseTable = () => {
  const { data, isLoading } = useGetCreatorCourseQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Your Courses
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all your courses in one place
          </p>
        </div>
        <Button 
          onClick={() => navigate('add')} 
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Table */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl border border-purple-100 dark:border-purple-900/20 shadow-lg">
        <Table>
          <TableCaption className="text-gray-600 dark:text-gray-400">
            A list of your recent courses
          </TableCaption>
          <TableHeader>
            <TableRow className="border-purple-100 dark:border-purple-900/20 hover:bg-purple-50/50 dark:hover:bg-purple-900/10">
              <TableHead className="w-[100px] text-gray-700 dark:text-gray-300">Price</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">Title</TableHead>
              <TableHead className="text-right text-gray-700 dark:text-gray-300">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.courses.map((course) => (
              <TableRow 
                key={course._id}
                className="border-purple-100 dark:border-purple-900/20 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors"
              >
                <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                  {course?.coursePrice ? formatCurrency(course.coursePrice) : "N/A"}
                </TableCell>
                <TableCell>
                  <Badge className={`${
                    course.isPublished 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/70"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/70"
                  }`}>
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300 font-medium">
                  {course.courseTitle}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    size='sm' 
                    variant='ghost'
                    onClick={() => navigate(`edit/${course._id}`)}
                    className="hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    <Edit className="w-4 h-4"/>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CourseTable;
