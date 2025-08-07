import { configureStore } from "@reduxjs/toolkit";
import { LoadingClient, TaskOne, UserIdValue, UserInformation } from "./reducer";

export const store = configureStore({
    reducer: {
        FirstValue: TaskOne,
        StoredUserId:UserIdValue,
        UserDetails:UserInformation,
        ClientName:LoadingClient
    }
})