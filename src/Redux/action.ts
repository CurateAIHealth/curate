export const Update_Value = (A: any) => {
    return {
        type: "Update",
        payload: A
    }
}

export const UpdateUserId = (UpdatedValue: any) => {
    return {
        type: "UpdatedUserId",
        payload: UpdatedValue
    }
}

export const UpdateUserInformation = (A: any) => {
    return {
        type: "UpdateUserInformation",
        payload: A
    }
}

export const UpdateDocmentSkipReason = (UpdatedValue: any) => {
    return {
        type: "UpdateActionReason",
        payload: UpdatedValue
    }
}


export const UpdateClient=(ClientName:any)=>{
    return{
        type:'CurrentUser',
        payload:ClientName
    }
}

export const CurrentHCAList=(List:any)=>{
    return{
        type:"UpdateHCAList",
        payload:List
    }
}

export const UpdateSubHeading=(SubHeadingValue:any)=>{
    return{
        type:'UpdateSuHeading',
        payload:SubHeadingValue
    }
}


export const Update_Main_Filter_Status=(Updated_Main_Filter_Value:any)=>{
    return{
        type:"Update_Main_Filter",
        payload:Updated_Main_Filter_Value
    }
}


export const UpdatePreviewStatus=(Updated_Preview_Status:any)=>{
    return{
        type:'CurrentPrevievStatus',
        payload:Updated_Preview_Status
    }
}

export const UpdateClientSuggetion=(Suggetion:any)=>{
    return{
        type:'CurrrentClient',
        payload:Suggetion
    }
}


export const Update_Current_Client_Status=(Current_Result:any)=>{
    return{
        type:"CurrentClientStatus",
        payload:Current_Result
    }
}

export const UpdateRefresh=(Refresh:any)=>{
    return{
        type:"CurrentRefresh",
        payload:Refresh
    }
}

export const UpdateUserType=(CurrentUser:any)=>{
    return{
        type:"CurrentUserType",
        payload:CurrentUser
    }
}


export const UpdateMedication=(UpdatedMedicatioValue:any)=>{
    return{
        type:"CurrentMedicationValue",
        payload:UpdatedMedicatioValue
    }
}

export const UpdateFetchedInformation=(UpdatedFetchedInfo:any)=>{
    return{
        type:"UpdateFullInfo",
        payload:UpdatedFetchedInfo
    }
}

export const UpdateRegisterdType=(CurrentUserType:any)=>{
    return{
        type:"UpdateRegisterdUserType",
        payload:CurrentUserType
    }
}

export const UpdateTimeStamp=(CurrentTimeStampValue:any)=>{
    return{
        type:"UpdateTimeStampInfo",
        payload:CurrentTimeStampValue,
    }
}

export const Updateformregisterdusertype=(M:any)=>{
    return{
        type:'UpdateCurrentRegisterdUserType',
        payload:M
    }
}


export const UpdateVendorPopUpStatus=(PopUpStatus:any)=>{
return{
    type:"UpdateVendorPopUpStatus",
    payload:PopUpStatus
}
}


export const CurrentReferdVendorId=(CyrrentVedorId:any)=>{
    return{
        type:"CurrentReferdVendorId",
        payload:CyrrentVedorId
    }
}

export const UpdateInvoiceInfo=(InvoiceIno:any)=>{
    return{
        type:"UpdateInvoiceInfo",
        payload:InvoiceIno
    }
}


export const GetCurrentDeploymentData=(CurrentDeploymentInfo:any)=>{

    return{
        type:"GetCurrentDeploymentData",
        payload:CurrentDeploymentInfo
    }

}


export const UpdateInvoiceStatus=(CurrentInvoiceStatus:any)=>{
    return{
        type:'UpdateInvoiceStatus',
        payload:CurrentInvoiceStatus
    }
}


export const UpdateInvoiceIntialStatus=(CurrentStaus:any)=>{
    return{
        type:'UpdateInvoiceIntialStatus',
        payload:CurrentStaus
    }
}

export const UpdateAdminRegistrationStatus=(AdminStatus:any)=>{
    return {
        type:"UpdateAdminRegistration",
        payload:AdminStatus
    }
}


export const UpdateMonthFilter=(FilterMonth:any)=>{
    return{
        type:"UpdateMonthFilter",
        payload:FilterMonth
    }
}

export const UpdateYearFilter=(FilterYear:any)=>{
    return{
        type:"UpdateYearFilter",
        payload:FilterYear
    }
}


export const UpdateAdminMonthFilter=(Month:any)=>{
    return{
        type:"UpdateAdminMonthFilter",
        payload:Month
    }
}


export const UpdateAdminYearFilter=(Year:any)=>{
    return{
        type:"UpdateAdminYearFilter",
        payload:Year
    }
}

