import { configureStore } from "@reduxjs/toolkit";
import { DocReason, LoadingClient, TaskOne, UserIdValue, UserInformation } from "./reducer";

export const store = configureStore({
    reducer: {
        FirstValue: TaskOne,
        StoredUserId:UserIdValue,
        UserDetails:UserInformation,
        ClientName:LoadingClient,
DocumentReson:DocReason
    }
})