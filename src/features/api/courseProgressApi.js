import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { COURSE_PROGRESS_API } from "@/config/apiConfig";
import SessionManager from "@/utils/sessionManager";

// Create a base query with auth header
const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: COURSE_PROGRESS_API,
    credentials: "include",
    prepareHeaders: (headers) => {
        const token = SessionManager.getToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        headers.set('Content-Type', 'application/json');
        return headers;
    }
});

// Create a custom base query with retry logic for auth errors
const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQueryWithAuth(args, api, extraOptions);
    
    // If we get a 401, log the error for debugging
    if (result.error && result.error.status === 401) {
        console.log('Auth error in courseProgressApi:', result.error);
        console.log('Token present:', !!SessionManager.getToken());
    }
    
    return result;
};

export const courseProgressApi = createApi({
  reducerPath: "courseProgressApi",
  baseQuery: baseQueryWithReauth,
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
