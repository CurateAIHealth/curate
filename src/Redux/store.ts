import { configureStore } from "@reduxjs/toolkit";
import { TaskOne, UserIdValue } from "./reducer";

export const store = configureStore({
    reducer: {
        FirstValue: TaskOne,
        StoredUserId:UserIdValue
    }
})