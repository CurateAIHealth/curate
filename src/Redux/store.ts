import { configureStore } from "@reduxjs/toolkit";
import { TaskOne } from "./reducer";

export const store = configureStore({
    reducer: {
        FirstValue: TaskOne
    }
})