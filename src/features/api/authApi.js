import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";
import { USER_API } from "@/config/apiConfig";

// Create a base query with auth header
const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: USER_API,
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (inputData) => ({
                url: "register",
                method: "POST",
                body: inputData
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    if (result.data.token) {
                        localStorage.setItem('token', result.data.token);
                    }
                } catch (error) {
                    console.error('Registration error:', error);
                }
            }
        }),
        loginUser: builder.mutation({
            query: (inputData) => ({
                url: "login",
                method: "POST",
                body: inputData
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    if (result.data.token) {
                        localStorage.setItem('token', result.data.token);
                    }
                    dispatch(userLoggedIn({user: result.data.user}));
                } catch (error) {
                    console.error('Login error:', error);
                }
            }
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: "logout",
                method: "GET"
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try {
                    await queryFulfilled;
                    localStorage.removeItem('token');
                    localStorage.removeItem('persist:root');
                    dispatch(userLoggedOut());
                } catch (error) {
                    console.error('Logout error:', error);
                }
            }
        }),
        loadUser: builder.query({
            query: () => ({
                url: "profile",
                method: "GET"
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({user: result.data.user}));
                } catch (error) {
                    console.error('Load user error:', error);
                    if (error?.status === 401) {
                        localStorage.removeItem('token');
                        dispatch(userLoggedOut());
                    }
                }
            }
        }),
        updateUser: builder.mutation({
            query: (formData) => ({
                url: "profile/update",
                method: "PUT",
                body: formData
            })
        })
    })
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useLoadUserQuery,
    useUpdateUserMutation
} = authApi;
