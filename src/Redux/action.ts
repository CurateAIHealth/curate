export const Update_Value = (A: any) => {
    return {
        type: "Update",
        payload: A
    }
}

export const UpdateUserId=(UpdatedValue:any)=>{
    return{
        type:"UpdatedUserId",
        payload:UpdatedValue
    }
}
