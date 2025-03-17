import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TEST_API } from "@/config/apiConfig";
import SessionManager from "@/utils/sessionManager";

// Create a base query with auth header
const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: TEST_API,
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
        console.log('Auth error in testApi:', result.error);
        console.log('Token present:', !!SessionManager.getToken());
    }
    
    return result;
};

export const testApi = createApi({
  reducerPath: "testApi",
  tagTypes: ["Tests", "TestResults"],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createTest: builder.mutation({
      query: (data) => ({
        url: "/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tests"],
    }),
    getTestsByCourse: builder.query({
      query: (courseId) => `/course/${courseId}`,
      providesTags: ["Tests"],
    }),
    getTestById: builder.query({
      query: (testId) => `/${testId}`,
      providesTags: ["Tests"],
    }),
    deleteQuestion: builder.mutation({
      query: ({ testId, questionId }) => ({
        url: `/${testId}/question/${questionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tests"],
    }),
    submitTest: builder.mutation({
      query: (data) => ({
        url: "/submit",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TestResults"],
    }),
    getTestResultByCourse: builder.query({
      query: (courseId) => `/result/${courseId}`,
      providesTags: ["TestResults"],
    }),
  }),
});

export const { 
  useCreateTestMutation, 
  useGetTestsByCourseQuery, 
  useGetTestByIdQuery,
  useDeleteQuestionMutation,
  useSubmitTestMutation,
  useGetTestResultByCourseQuery
} = testApi;
