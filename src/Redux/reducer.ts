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