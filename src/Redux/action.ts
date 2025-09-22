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