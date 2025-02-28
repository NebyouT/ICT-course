import {configureStore} from "@reduxjs/toolkit" 
import rootRedcuer from "./rootRedcuer";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";
import { courseProgressApi } from "@/features/api/courseProgressApi";
import { testApi } from "@/features/api/testApi";
import sessionMiddleware from "@/middleware/sessionMiddleware";

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
    await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}))
}
initializeApp();