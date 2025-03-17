import {configureStore} from "@reduxjs/toolkit" 
import rootRedcuer from "./rootRedcuer";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";
import { courseProgressApi } from "@/features/api/courseProgressApi";
import { testApi } from "@/features/api/testApi";
import sessionMiddleware from "@/middleware/sessionMiddleware";
import SessionManager from "@/utils/sessionManager";

export const appStore = configureStore({
    reducer: rootRedcuer,
    middleware:(defaultMiddleware) => defaultMiddleware().concat(
        authApi.middleware, 
        courseApi.middleware, 
        purchaseApi.middleware, 
        courseProgressApi.middleware,
        testApi.middleware,
        sessionMiddleware
    )
});

const initializeApp = async () => {
    // Only try to load user if we have a token
    if (SessionManager.getToken()) {
        console.log('Token found, attempting to load user profile...');
        try {
            await appStore.dispatch(authApi.endpoints.loadUser.initiate({}, {forceRefetch: true}));
        } catch (error) {
            console.error('Failed to load user on app initialization:', error);
        }
    } else {
        console.log('No authentication token found');
    }
}

// Initialize the app
initializeApp();