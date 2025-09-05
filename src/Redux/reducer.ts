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

export const UserInformation=(state:any="f7ec237b-12db-4779-aced-b006974a17d9",action:any)=>{
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


export const DocReason=(state:any="",action:any)=>{
switch(action.type){
    case "UpdateActionReason":
        return action.payload;
        default :
        return state
}
}


export const HCAList=(state:any=[],action:any)=>{
switch(action.type){
    case "UpdateHCAList":
        return action.payload;
        default :
        return state
}
}


export const SUbHeadings=(state:any="On Service",action:any)=>{
    switch(action.type){
case "UpdateSuHeading":
    return action.payload;
    default:
        return state
    }
}