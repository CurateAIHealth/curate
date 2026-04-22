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

export const CurrentLoginUser=(EmailResults:any)=>{
    return{
        type:"CurrentLoginUser",
        payload:EmailResults
    }
}

export const Refresh=(RefreshData:any)=>{
    return{
        type:"Refresh",
        payload:RefreshData
    }
}


export const CurrrentPDRUserId=(FilledIserId:any)=>{
    return{
        type:"CurrrentPDRUserId",
        payload:FilledIserId
    }
}

export const UpdateCallEnquiryInformation=(CallEnquiryInformation:any)=>{
    return{
        type:"UpdateCallEnquiryInformation",
        payload:CallEnquiryInformation
    }
}


type EnquiryFormType = {
  title: string;
  ClientName: string;
  patientName: string;
  ClientContact: string;
  ClientEmail: string;
  patientAge: string;
  patientGender: string;
  clientGender: string;
  HCPPreferGender: string;
  NewLead: string;
  CurateNewLead: string;
  PreferredLanguage: string;
  ClientArea: string;
  ClientNote: string;
  serviceCharges: string;
  MonthlyServiceCharge: string;
  ServiceType: string;
  patientHealthCard: string;
  ExpectedService: string;
  Reasonforservice: string;
  ClientStatus: string;
  patientWeight: string;
  WorkingHours: string;
  WorkType: string;
  ExtraWorkingHours: string;
  ExtraWorkType: string;
};

export const mapEnquiryToForm = (data: any): Partial<EnquiryFormType> => ({
  title: data?.title ?? data?.Type ?? "",

  ClientName: data?.ClientName ?? data?.clientName ?? "",
  patientName: data?.patientName ?? "",

  ClientContact: data?.ClientContact ?? data?.clientContact ?? "",
  ClientEmail: data?.ClientEmail ?? data?.clientEmail
 ?? "",

  patientAge: data?.patientAge ?? "",
  patientGender: data?.patientGender ?? "",
  clientGender: data?.clientGender ?? "",

  HCPPreferGender: data?.HCPPreferGender ?? data?.hcpPreferGender ?? "",

  NewLead: data?.NewLead ?? "",
  CurateNewLead: data?.CurateNewLead ?? "",

  PreferredLanguage: data?.PreferredLanguage ?? data?.preferredLanguage ?? "",

  ClientArea: data?.ClientArea ?? data?.clientArea ?? "",
  ClientNote: data?.ClientNote ?? data?.clientNote ?? "",

  serviceCharges: data?.serviceCharges ?? "",
  MonthlyServiceCharge: data?.MonthlyServiceCharge ?? "",

  ServiceType: data?.ServiceType ?? data?.serviceType ?? "",

  patientHealthCard: data?.patientHealthCard ?? "",

  ExpectedService: data?.ExpectedService ?? data?.expectedService ?? "",
  Reasonforservice: data?.Reasonforservice ?? data?.reasonForService ?? "",

  ClientStatus: data?.ClientStatus ?? data?.clientStatus ?? "",

  patientWeight: data?.patientWeight ?? "",
  WorkingHours: data?.WorkingHours ?? "",
  WorkType: data?.WorkType ?? "",
  ExtraWorkingHours: data?.ExtraWorkingHours ?? "",
  ExtraWorkType: data?.ExtraWorkType ?? ""
});


export const formatToDDMMYYYY = (dateStr: string) => {
  if (!dateStr) return "";

  let date: Date;

  // If already ISO (yyyy-mm-dd)
  if (dateStr.includes("-")) {
    date = new Date(dateStr);
  } else if (dateStr.includes("/")) {
    // Handle dd/mm/yyyy
    const [day, month, year] = dateStr.split("/");
    date = new Date(Number(year), Number(month) - 1, Number(day));
  } else {
    return "";
  }

  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};


export const toInputDateFormat = (dateStr: string) => {
  if (!dateStr) return "";

  if (dateStr.includes("-")) return dateStr; // already correct

  const [day, month, year] = dateStr.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};




export const addDays = (dateStr: string, days: number) => {
  if (!dateStr) return "";

  let date: Date;

  // Handle YYYY-MM-DD (from input)
  if (dateStr.includes("-")) {
    date = new Date(dateStr);
  } 
  // Handle DD/MM/YYYY
  else if (dateStr.includes("/")) {
    const [day, month, year] = dateStr.split("/");
    date = new Date(Number(year), Number(month) - 1, Number(day));
  } 
  else {
    return "";
  }

  if (isNaN(date.getTime())) return "";

  date.setDate(date.getDate() + days);

  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();

  return `${d}/${m}/${y}`;
};

export const getMonthYear = (dateStr: string) => {
  if (!dateStr) return { month: "", year: "" };

  let date: Date;

  // Handle YYYY-MM-DD
  if (dateStr.includes("-")) {
    date = new Date(dateStr);
  } 
  // Handle DD/MM/YYYY
  else if (dateStr.includes("/")) {
    const [day, month, year] = dateStr.split("/");
    date = new Date(Number(year), Number(month) - 1, Number(day));
  } 
  else {
    return { month: "", year: "" };
  }

  if (isNaN(date.getTime())) return { month: "", year: "" };

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());

  return { month, year };
};