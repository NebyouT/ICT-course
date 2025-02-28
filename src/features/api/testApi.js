import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const TEST_API = "https://ict-backend-likf.onrender.com/api/v1/test";

export const testApi = createApi({
  reducerPath: "testApi",
  tagTypes: ["Tests", "TestResults"],
  baseQuery: fetchBaseQuery({
    baseUrl: TEST_API,
    credentials: "include",
  }),
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
