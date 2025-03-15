import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TEST_API } from "@/config/apiConfig";

// Create a base query with auth header
const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: TEST_API,
    credentials: "include",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

export const testApi = createApi({
  reducerPath: "testApi",
  tagTypes: ["Tests", "TestResults"],
  baseQuery: baseQueryWithAuth,
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
