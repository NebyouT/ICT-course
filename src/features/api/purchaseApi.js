import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PURCHASE_API } from "@/config/apiConfig";
import SessionManager from "@/utils/sessionManager";

// Create a base query with auth header
const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: PURCHASE_API,
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
        console.log('Auth error in purchaseApi:', result.error);
        console.log('Token present:', !!SessionManager.getToken());
    }
    
    return result;
};

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: baseQueryWithReauth,
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
