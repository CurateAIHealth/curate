import { configureStore } from "@reduxjs/toolkit";
import {UserType,RefreshCount,FullHCPList, Admin_Main_Filter, DocReason, HCAList, LoadingClient, PreviedComponent, SUbHeadings, Submmision_Client_Status, Suitable_HCP, TaskOne, UserIdValue, UserInformation, Medication, FullInfo } from "./reducer";

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
        CurrentPreview:PreviedComponent,
        Suggested_HCP:Suitable_HCP,
        Submitted_Current_Status:Submmision_Client_Status,
        updatedCount:RefreshCount,
        ViewHCPList:FullHCPList,
        MedicationInfo:Medication,
        RegisterdUsersFullInformation:FullInfo,
        RegisteredUserType:UserType
    }
})