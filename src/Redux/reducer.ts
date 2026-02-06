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

export const UserInformation=(state:any=null,action:any)=>{
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


export const Admin_Main_Filter = (state: any = "Client Enquiry", action: any) => {
    switch (action.type) {
        case "Update_Main_Filter":
            return action.payload;
        default:
            return state
    }
}


export const PreviedComponent = (state: any = true, action: any) => {
    switch (action.type) {

        case "CurrentPrevievStatus":
            return action.payload;
        default:
            return state

    }
}


export const Suitable_HCP=(state:any="",action:any)=>{
    switch(action.type){
        case "CurrrentClient":
            return action.payload;
            default:
                return state

    }
}


export const UserType=(state:any=null,action:any)=>{
switch(action.type){
    case "UpdateRegisterdUserType":
        return action.payload;
        default:
            return state

}
}

export const Submmision_Client_Status = (state: any = "", action: any) => {

    switch (action.type) {
        case "CurrentClientStatus":
            return action.payload;
        default:
            return state
    }

}

export const RefreshCount = (state: any = 0, action: any) => {
    switch (action.type) {

        case "CurrentRefresh":
            return state+action.payload;
        default:
            return state

    }
}


export const FullHCPList=(state:any="patient",action:any)=>{
switch(action.type){

    case "CurrentUserType":
        return action.payload;
        default:
            return state

}
}


export const Medication=(state:any=null,action:any)=>{
switch(action.type){
    case "CurrentMedicationValue":
        return action.payload;
        default:
          return  state
}
}

export const FullInfo=(state:any=[],action:any)=>{
    switch(action.type){
case "UpdateFullInfo" :
    return action.payload;
    default:
        return state

    }
}

export const TimeStamp=(state:any='',action:any)=>{
    switch(action.type){
case "UpdateTimeStampInfo":
    return action.payload;
    default:
        return state
    }
}

export const CurrentRegisterUser = (state: any = "", action: any) => {
    switch (action.type) {
        case "UpdateCurrentRegisterdUserType":
            return action.payload;
        default:
            return state

    }
}

export const VendorReferal = (state: any = false, action: any) => {
    switch (action.type) {
        case "UpdateVendorPopUpStatus":
            return action.payload;
        default:
            return state
    }
}


export const ReferdVendorUserId=(state:any="",action:any)=>{
    switch(action.type){
        case "CurrentReferdVendorId":
            return action.payload;
            default:
                return state
    }
}

export const InvoiceData=(state:any="",action:any)=>{
    switch(action.type){
        case "UpdateInvoiceInfo":
            return action.payload;
            default:
                return state
    }
}

export const DeploymentInformation = (state: any = null, action: any) => {
    switch (action.type) {
        case "GetCurrentDeploymentData":
            return action.payload;
        default:
            return state


    }
}


export const EditInvoice=(state:any=false,action:any)=>{
    switch(action.type){
        case "UpdateInvoiceStatus":
            return action.payload;
            default:
                return state
    }
}


export const UpdateInvoicePageStatus=(state:any=true,action:any)=>{
    switch(action.type){
        case "UpdateInvoiceIntialStatus":
            return action.payload;
            default:
                return state

    }
}

export const RegisterByAdmin=(state:any=false,action:any)=>{
    switch(action.type){
        case "UpdateAdminRegistration":
        return action.payload;

        default :
        return state
    }
}



export const YearFilter = (state: any = new Date().getFullYear(), action: any) => {
    switch (action.type) {
        case "UpdateYearFilter":
            return action.payload;
        default:
            return state
    }
}

export const MonthFilter = (state: any = new Date().getMonth() + 1, action: any) => {
    switch (action.type) {
        case "UpdateMonthFilter":
            return action.payload;
        default:
            return state
    }
}


const now = new Date();


export const AdminYearFilter=(state:any=String(now.getFullYear()),action:any)=>{
    switch(action.type){
        case "UpdateAdminYearFilter":
            return action.payload;
            default:
                return state

    }
}


export const AdminMonthFilter = (state: any = new Date(now.getFullYear(), now.getMonth()).toLocaleString("default", { month: "long" }), action: any) => {
    switch (action.type) {
        case "UpdateAdminMonthFilter":
            return action.payload;
        default:
            return state
    }
}


export const LoginUserEmail=(state:any="tets",action:any)=>{
    switch(action.type){
case "CurrentLoginUser":
    return action.payload;
    default:
        return state
    }
}