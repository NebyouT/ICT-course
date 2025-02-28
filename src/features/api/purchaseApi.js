import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API = "http://localhost:3000/api/v1/purchase";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (courseId) => ({
        url: "/checkout/create-checkout-session",
        method: "POST",
        body: { courseId },
      }),
    }),
    verifyPayment: builder.mutation({
      query: (tx_ref) => ({
        url: `/verify/${tx_ref}`,
        method: "GET",
      }),
    }),
    getCourseDetailWithStatus: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/detail-with-status`,
        method: "GET",
      }),
    }),
    getCourseContent: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/content`,
        method: "GET",
      }),
    }),
    getPurchasedCourses: builder.query({
      query: () => ({
        url: `/`,
        method: "GET",
      }),
    }),
    getDashboardStats: builder.query({
      query: () => ({
        url: `/admin/stats`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useVerifyPaymentMutation,
  useGetCourseDetailWithStatusQuery,
  useGetCourseContentQuery,
  useGetPurchasedCoursesQuery,
  useGetDashboardStatsQuery,
} = purchaseApi;
