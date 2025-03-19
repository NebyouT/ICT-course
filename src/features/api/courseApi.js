import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { COURSE_API } from "@/config/apiConfig";
import SessionManager from "@/utils/sessionManager";

// Create a base query with auth header
const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
    prepareHeaders: (headers) => {
        const token = SessionManager.getToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');
        return headers;
    },
    mode: 'cors'
});

// Create a custom base query with retry logic for auth errors
const baseQueryWithReauth = async (args, api, extraOptions) => {
    // For FormData requests, ensure we don't set Content-Type (browser will set it with boundary)
    if (args.formData) {
        const customArgs = {
            ...args,
            prepareHeaders: (headers, { getState }) => {
                const token = SessionManager.getToken();
                if (token) {
                    headers.set('Authorization', `Bearer ${token}`);
                }
                // Don't set Content-Type for FormData
                headers.set('Accept', 'application/json');
                return headers;
            }
        };
        let result = await baseQueryWithAuth(customArgs, api, extraOptions);
        
        // If we get a 401, log the error for debugging
        if (result.error && result.error.status === 401) {
            console.log('Auth error in courseApi:', result.error);
            console.log('Token present:', !!SessionManager.getToken());
        }
        
        return result;
    }
    
    let result = await baseQueryWithAuth(args, api, extraOptions);
    
    // If we get a 401, log the error for debugging
    if (result.error && result.error.status === 401) {
        console.log('Auth error in courseApi:', result.error);
        console.log('Token present:', !!SessionManager.getToken());
    }
    
    return result;
};

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Course", "Lecture"],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (formData) => ({
        url: "",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["Course"],
    }),
    getSearchCourse: builder.query({
      query: ({searchQuery, categories, sortByPrice}) => {
        const params = new URLSearchParams();
        params.append('query', searchQuery || '');
        if(categories && categories.length > 0) {
          categories.forEach(category => {
            params.append('categories', category);
          });
        }
        if(sortByPrice){
          params.append('sortByPrice', sortByPrice);
        }
        return {
          url: `/search?${params.toString()}`,
          method: "GET",
        }
      }
    }),
    getPublishedCourse: builder.query({
      query: () => ({
        url: "/published-courses",
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    getCourseById: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
      providesTags: (result, error, courseId) => 
        result ? [
          { type: 'Course', id: courseId },
          { type: 'Lecture', id: 'LIST' }
        ] : ['Course'],
    }),
    getCreatorCourse: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    editCourse: builder.mutation({
      query: ({ formData, courseId }) => ({
        url: `/${courseId}`,
        method: "PUT",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: 'Course', id: courseId },
        'Course'
      ],
    }),
    createLecture: builder.mutation({
      query: ({ courseId, formData }) => {
        console.log('Creating lecture with:', { courseId, formData });
        return {
          url: `/${courseId}/lecture`,
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: (result, error, { courseId }) => [
        { type: 'Course', id: courseId },
        { type: 'Lecture', id: 'LIST' }
      ],
    }),
    getCourseLecture: builder.query({
      query: (courseId) => ({
        url: `/${courseId}/lecture`,
        method: "GET",
      }),
      providesTags: (result, error, courseId) => 
        result
          ? [
              { type: 'Lecture', id: 'LIST' },
              ...result.lectures.map(({ _id }) => ({ type: 'Lecture', id: _id }))
            ]
          : [{ type: 'Lecture', id: 'LIST' }],
    }),
    editLecture: builder.mutation({
      query: ({ courseId, lectureId, formData }) => ({
        url: `/${courseId}/lecture/${lectureId}`,
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { courseId, lectureId }) => [
        { type: 'Course', id: courseId },
        { type: 'Lecture', id: lectureId },
        { type: 'Lecture', id: 'LIST' }
      ],
    }),
    removeLecture: builder.mutation({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, lectureId) => [
        { type: 'Lecture', id: lectureId },
        { type: 'Lecture', id: 'LIST' }
      ],
    }),
    getLectureById: builder.query({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "GET",
      }),
      providesTags: (result, error, lectureId) => 
        result ? [{ type: 'Lecture', id: lectureId }] : [],
    }),
    publishCourse: builder.mutation({
      query: ({ courseId, query }) => ({
        url: `/${courseId}`,
        method: "PATCH",
        params: { publish: query }
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: 'Course', id: courseId },
        'Course'
      ],
    }),
    removeCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Course'],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetSearchCourseQuery,
  useGetPublishedCourseQuery,
  useGetCourseByIdQuery,
  useGetCreatorCourseQuery,
  useEditCourseMutation,
  useCreateLectureMutation,
  useGetCourseLectureQuery,
  useEditLectureMutation,
  useRemoveLectureMutation,
  useGetLectureByIdQuery,
  usePublishCourseMutation,
  useRemoveCourseMutation,
} = courseApi;
