import React from "react";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "./theme-provider";
import { CheckCircle2, Clock } from "lucide-react";

const CourseProgressBar = ({ progress, totalLectures, completedLectures }) => {
  const { theme } = useTheme();
  const progressPercentage = Math.round((completedLectures / totalLectures) * 100) || 0;

  return (
    <div className="space-y-2">
      {/* Progress bar */}
      <div className="relative">
        <Progress
          value={progressPercentage}
          className="h-2 w-full bg-purple-100 dark:bg-purple-900/20"
          indicatorClassName="bg-gradient-to-r from-purple-600 to-indigo-600"
        />
        
        {/* Completion badge */}
        {progressPercentage === 100 && (
          <div className="absolute -right-2 -top-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
        )}
      </div>

      {/* Progress details */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>
            {completedLectures} of {totalLectures} lectures completed
          </span>
        </div>
        <span className="font-medium text-purple-600 dark:text-purple-400">
          {progressPercentage}%
        </span>
      </div>

      {/* Status indicator */}
      <div className="text-sm">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full ${
            progressPercentage === 100
              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : progressPercentage > 0
              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {progressPercentage === 100
            ? "Completed"
            : progressPercentage > 0
            ? "In Progress"
            : "Not Started"}
        </span>
      </div>
    </div>
  );
};

export default CourseProgressBar;
