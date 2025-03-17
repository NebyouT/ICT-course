import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";
import { USER_API } from "@/config/apiConfig";
import SessionManager from "@/utils/sessionManager";

// Create a base query with auth header
const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: USER_API,
    credentials: 'include',
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
    
    // If we get a 401, try to refresh the token or handle the error
    if (result.error && result.error.status === 401) {
        console.log('Auth error detected, checking token...');
        const token = SessionManager.getToken();
        
        // If we have a token but still got 401, the token might be invalid
        if (token) {
            console.log('Token exists but might be invalid, logging out...');
            // Clear the token and log out
            SessionManager.clearSession();
            api.dispatch(userLoggedOut());
        }
    }
    
    return result;
};

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReauth,
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
                        SessionManager.saveToken(result.data.token);
                        // Also save the token to session manager
                        if (result.data.user) {
                            SessionManager.saveSession(result.data.user);
                            dispatch(userLoggedIn({user: result.data.user}));
                        }
                        console.log('Registration successful, token saved:', !!SessionManager.getToken());
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
                    console.log('Login response received:', result.data);
                    if (result.data.token) {
                        SessionManager.saveToken(result.data.token);
                    }
                    if (result.data.user) {
                        SessionManager.saveSession(result.data.user);
                        dispatch(userLoggedIn({user: result.data.user}));
                    }
                    console.log('Login successful, token saved:', !!SessionManager.getToken());
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
                    SessionManager.clearSession();
                    dispatch(userLoggedOut());
                } catch (error) {
                    // Even if the server-side logout fails, clear local storage
                    console.error('Logout error:', error);
                    SessionManager.clearSession();
                    dispatch(userLoggedOut());
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
                    console.log('Loading user profile with token:', !!SessionManager.getToken());
                    const result = await queryFulfilled;
                    if (result.data.user) {
                        SessionManager.saveSession(result.data.user);
                        dispatch(userLoggedIn({user: result.data.user}));
                    }
                } catch (error) {
                    console.error('Load user error:', error);
                    if (error?.error?.status === 401) {
                        // Only log out if we have a token but got 401
                        const token = SessionManager.getToken();
                        if (token) {
                            SessionManager.clearSession();
                            dispatch(userLoggedOut());
                        }
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
