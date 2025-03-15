import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { COURSE_API } from "@/config/apiConfig";

// Create a base query with auth header
const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Course", "Lecture"],
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "",
        method: "POST",
        body: { courseTitle, category },
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
