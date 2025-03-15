import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { COURSE_PROGRESS_API } from "@/config/apiConfig";

// Create a base query with auth header
const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: COURSE_PROGRESS_API,
    credentials: "include",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

export const courseProgressApi = createApi({
  reducerPath: "courseProgressApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getCourseProgress: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
    }),
    updateLectureProgress: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lecture/${lectureId}/view`,
        method: "POST"
      }),
    }),
    completeCourse: builder.mutation({
        query:(courseId) => ({
            url:`/${courseId}/complete`,
            method:"POST"
        })
    }),
    inCompleteCourse: builder.mutation({
        query:(courseId) => ({
            url:`/${courseId}/incomplete`,
            method:"POST"
        })
    }),
  }),
});

export const {
  useGetCourseProgressQuery,
  useUpdateLectureProgressMutation,
  useCompleteCourseMutation,
  useInCompleteCourseMutation
} = courseProgressApi;
