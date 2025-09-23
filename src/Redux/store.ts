import { configureStore } from "@reduxjs/toolkit";
import { Admin_Main_Filter, DocReason, HCAList, LoadingClient, PreviedComponent, SUbHeadings, TaskOne, UserIdValue, UserInformation } from "./reducer";

export const store = configureStore({
    reducer: {
        FirstValue: TaskOne,
        StoredUserId: UserIdValue,
        UserDetails: UserInformation,
        ClientName: LoadingClient,
        DocumentReson: DocReason,
        ListOfHCA:HCAList,
        SubHeadinList:SUbHeadings,
        Main_Filter:Admin_Main_Filter,
        CurrentPreview:PreviedComponent
    }
})