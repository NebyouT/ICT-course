import { useEffect } from 'react';
import { useParams, Navigate } from "react-router-dom";
import { useGetCourseContentQuery } from "@/features/api/purchaseApi";

const PurchaseCourseProtectedRoute = ({ children }) => {
    const { courseId } = useParams();
    const { data, isLoading, isError } = useGetCourseContentQuery(courseId);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">
            <p>Checking course access...</p>
        </div>;
    }

    if (isError || !data?.success) {
        return <Navigate to={`/course-detail/${courseId}`} />;
    }

    return children;
};

export default PurchaseCourseProtectedRoute;