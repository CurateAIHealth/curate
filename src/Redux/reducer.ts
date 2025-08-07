export const TaskOne = (state: any = "Siddu", action: any) => {
    switch (action.type) {
        case ("Update"):
            return action.payload;
        default:
            return state
    }
}

export const UserIdValue = (state: any = "", action: any) => {
    switch (action.type) {
        case "UpdatedUserId":
            return action.payload
        default:
            return state
    }
}

export const UserInformation=(state:any="9b5f06c4-d05c-4a1f-8af1-8e5aa7e79c0e",action:any)=>{
switch(action.type){
case "UpdateUserInformation":
    return action.payload;
    default:
        return state
}
}


export const LoadingClient= (state:any="",action:any)=>{
    switch(action.type){
case "CurrentUser":
    return action.payload;
    default:
        return state
    }
}