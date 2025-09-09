"use server";
import { decrypt, encrypt, hashValue, verifySHA256 } from "./Actions";

import clientPromise from "./db";

export const UpdateDocterInformation = async (doctorInfo: {
  userType: any,
  FirstName: any,
  LastName: any,
  Qualification: any,
  Location: any,
  RegistrationNumber: any,
  College: any,
  Email: any,
  userId: any,
  OfferableService: any,
  PreferredLocationsforHomeVisits: any,
  Password: any,
  ConfirmPassword: any
  AadharNumber: any
  VerificationStatus: any,
  Age: any,
  Gender:any
  DateOfBirth:any,
  TermsAndConditions: any,
  EmailVerification: any,
   FinelVerification:any,
   
}) => {
  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("Registration");


    const existingDoctor = await collection.findOne({
      $or: [
        { Email: doctorInfo.Email },
        { RegistrationNumber: doctorInfo.RegistrationNumber },
        { AadharNumber: doctorInfo.AadharNumber, }

      ],
    });

    if (existingDoctor) {
      return {
        success: false,
        message: "An account with these details already exists.",
      };
    }

    const result = await collection.insertOne({
      ...doctorInfo,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: "You registered successfully with Curate Digital AI",
      insertedId: result.insertedId.toString(),
    };
  } catch (error) {

    throw error;
  }
};


export const UpdateNurseInfo = async (NurseInfor: {
  userType: any,
  FirstName: any,
  LastName: any,
  Age: any,
  DateOfBirth:any,
  Qualification: any,
  Location: any,
  RegistrationNumber: any,
  College: any,
  AadharNumber: any,
  Email: any,
  ContactNumber: any,
  Password: any,
  userId: any,
  ConfirmPassword: any,
  Type: any
  VerificationStatus: any,
  TermsAndConditions: any,
  EmailVerification: any,
   FinelVerification:any,
}) => {
  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("Registration");


    const existingDoctor = await collection.findOne({
      $or: [
        { Email: NurseInfor.Email },
        { RegistrationNumber: NurseInfor.ContactNumber },
        { AadharNumber: NurseInfor.AadharNumber }
      ],
    });

    if (existingDoctor) {
      return {
        success: false,
        message: "An account with these details already exists.",
      };
    }

    const result = await collection.insertOne({
      ...NurseInfor,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: "You registered successfully with Curate Digital AI",
      insertedId: result.insertedId.toString(),
    };
  } catch (error) {

    throw error;
  }
}

export const UpdateCurateFamilyInfo = async (FamilyInfo: any[]) => {
  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("Registration");


    const existingDoctors = await Promise.all(
      FamilyInfo.map((each: any) =>
        collection.findOne({
          $or: [
            { Email: each.Email },
            { RegistrationNumber: each.ContactNumber },
            { AadharNumber: each.AadharNumber }
          ]
        })
      )
    );


    const duplicates = existingDoctors.filter(doc => doc !== null);
    if (duplicates.length > 0) {
      return {
        success: false,
        message: "One or more family members already exist with these details."
      };
    }


    const result = await collection.insertMany(FamilyInfo);

    return {
      success: true,
      message: "You registered successfully with Curate Digital AI",
      insertedIds: Object.values(result.insertedIds).map(id => id.toString()),
    };

  } catch (err: any) {
    console.error("UpdateCurateFamilyInfo error:", err);
    return {
      success: false,
      message: "An error occurred while updating family info.",
      error: err.message || "Unknown error"
    };
  }
};

export const GetUserIdwithEmail = async (Mail: any) => {
  try {
    const cluster = await clientPromise
    const Db = cluster.db("CurateInformation")
    const Collection = Db.collection("Registration")
    const FinelResult: any = await Collection.findOne({ Email: Mail })
    return FinelResult.userId
  } catch (err: any) {

  }
}


export const SignInRessult = async (SignInfor: { Name: any; Password: any }) => {
  try {
    const Clustor = await clientPromise;
    const Db = Clustor.db("CurateInformation");
    const Collection = Db.collection("Registration");

   
    const emailHash = hashValue(SignInfor.Name);
    const passwordHash = hashValue(SignInfor.Password);

   
    const SignInInformation: any = await Collection.findOne({
      emailHash: emailHash,
      Password: passwordHash,
    });

    if (!SignInInformation) {
      return { success: false, message: "Invalid Email or Password" };
    }

    if (!SignInInformation.EmailVerification) {
      return { success: false, message: "Verify your Email To Login" };
    }

    return { success: true, userId: SignInInformation.userId?.toString?.() };
  } catch (err: any) {
    console.error("SignIn Error:", err);
    return { success: false, message: "Something went wrong" };
  }
};



export const UpdatePassword = async (UpdatedData: { UpdatedUserid: any, NewUpdatedPassword: any, NewConfirmUpdatedPassword: any }) => {
  try {
    const Clustor = await clientPromise
    const Db = Clustor.db("CurateInformation")
    const Collection = Db.collection("Registration")
    const inputUserId = UpdatedData.UpdatedUserid
    const result = await Collection.updateOne(
      { userId: inputUserId },
      {
        $set: {

            PasswordValue:encrypt(UpdatedData.NewUpdatedPassword),
           Password: hashValue(UpdatedData.NewUpdatedPassword),
        

        },
      }
    );



    if (result.modifiedCount === 0) {
      return { success: false, message: 'User not found or no changes made.' };
    }

    return { success: true, message: 'Password updated successfully.' };
  } catch (err: any) {

  }
}

export const UpdateEmailVerification=async (UpdatedUserid:any) => {
  try {
    const Clustor = await clientPromise
    const Db = Clustor.db("CurateInformation")
    const Collection = Db.collection("Registration")
    const inputUserId =UpdatedUserid
    const result = await Collection.updateOne(
      { userId: inputUserId },
      {
        $set: {
          EmailVerification: true,     
        },
      }
    );



    if (result.modifiedCount === 0) {
      return { success: false, message: 'User not found or no changes made.' };
    }

    return { success: true, message: 'Password updated successfully.' };
  } catch (err: any) {

  }
}







export const UpdatePatientInformation = async (Patient: {
  userType: any,
  FirstName: any,
  LastName: any,
  Age: any,
  Location: any,
  dateofBirth: any,
  AadharNumber: any,
  PANNumber:any,
  Email: any,
  ContactNumber: any,
  Password: any,
  userId: any,
  Gender: any,
  ConfirmPassword: any,
  VerificationStatus: any,
  TermsAndConditions: any,
  FamilyMembars: any,
  EmailVerification: any,
  FinelVerification: any,
  ClientStatus:any
}) => {
  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("Registration");

    const existingDoctor = await collection.findOne({
      $or: [
        { emailHash: hashValue(Patient.Email.toLowerCase()) },
        { phoneHash: hashValue(Patient.ContactNumber) },
        { aadharHash: hashValue(Patient.AadharNumber) },
      ],
    });

    if (existingDoctor) {
      return {
        success: false,
        message: "An account with these details already exists.",
      };
    }


    const encryptedData = {
      userType: Patient.userType,
      FirstName: encrypt(Patient.FirstName),
      LastName: encrypt(Patient.LastName),
      Age: Patient.Age,
      Gender: encrypt(Patient.Gender),
      userId: Patient.userId,

      Location: encrypt(Patient.Location),
      dateofBirth: encrypt(Patient.dateofBirth),
      AadharNumber: encrypt(Patient.AadharNumber),
      PANNumber:encrypt(Patient.PANNumber),
      Email: encrypt(Patient.Email),
      ContactNumber: encrypt(Patient.ContactNumber),
      PasswordValue:encrypt(Patient.Password),
      

      emailHash: hashValue(Patient.Email.toLowerCase()),
      phoneHash: hashValue(Patient.ContactNumber),
      aadharHash: hashValue(Patient.AadharNumber),

      Password: hashValue(Patient.Password), 

      VerificationStatus: Patient.VerificationStatus,
      TermsAndConditions: Patient.TermsAndConditions,
      FamilyMembars: Patient.FamilyMembars,
      EmailVerification: Patient.EmailVerification,
      FinelVerification: Patient.FinelVerification,
      ClientStatus:Patient.ClientStatus,

      createdAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(encryptedData);

    return {
      success: true,
      message: "You registered successfully with Curate Digital AI",
      insertedId: result.insertedId.toString(),
    };
  } catch (error) {
    throw error;
  }
};






export const UpdateOrganisation = async (Organisation: {
  userType: any,
  OrganizationName: any,
  RegistrationNumber: any,
  OrganizationType: any,
  HeadName: any,
  HeadContact: any,
  Location: any,
  Email: any,
  userId: any,
  Password: any,
  ConfirmPassword: any,
  NumberOfPeople: any,
  VerificationStatus: any,
  TermsAndConditions: any,
  EmailVerification:any,
   FinelVerification:any,
}) => {

  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("Registration");


    const existingDoctor = await collection.findOne({
      $or: [
        { Email: Organisation.Email },
        { RegistrationNumber: Organisation.HeadContact },
      ],
    });

    if (existingDoctor) {
      return {
        success: false,
        message: "An account with these details already exists.",
      };
    }

    const result = await collection.insertOne({
      ...Organisation,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: "You registered successfully with Curate Digital AI",
      insertedId: result.insertedId.toString(),
    };
  } catch (err: any) {

  }


}
export const HCARegistration = async (HCA: {
  userType: any,
  FirstName: any,
  LastName: any,
  Gender: any,
  DateOfBirth: any,
  MaritalStatus: any,
  Nationality: any,
  AadharNumber: any,
  Age: any,
  ContactNumber: any
  Email: any,
  Password: any,
  ConfirmPassword: any,
  Location: any,
  VerificationStatus: any,
  TermsAndConditions: any,
  userId: any,
  FinelVerification: any,
  EmailVerification: any
}) => {
  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("Registration");


    const existingDoctor = await collection.findOne({
      $or: [
        { Email: HCA.Email },
        { RegistrationNumber: HCA.ContactNumber },
        { AadharNumber: HCA.AadharNumber, }
      ],
    });

    if (existingDoctor) {
      return {
        success: false,
        message: "An account with these details already exists.",
      };
    }

    const result = await collection.insertOne({
      ...HCA,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: "You registered successfully with Curate Digital AI",
      insertedId: result.insertedId.toString(),
    };
  } catch (err: any) {

  }
}

export const PostFullRegistration = async (Info: any) => {
  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("CompliteRegistrationInformation");


    const encryptedInfo = {
      "Phone No 1": encrypt(Info.phoneNo1),
      "Phone No 2": encrypt(Info.phoneNo2) ,
      "Patient Full Name":encrypt(Info.patientFullName) ,
      "Date of Birth": Info.dateOfBirth,
      "Age": Number(Info.age),
      "Address": Info.address,
      "Landmark": Info.landmark,
      "City": Info.city,
      "Pin Code": Info.pinCode,
      "State": Info.state || "Telangana", 
      "EmailId": encrypt(Info.emailId),
      "Client Aadhar No": encrypt(Info.clientAadharNo),
      "Client relation to patient": Info.clientRelationToPatient,
      "Alternative Client Contact": encrypt(Info.alternativeClientContact),
      "Mode of Pay": Info.modeOfPay,
      "Registration Rs.": Number(Info.registrationRs),
      "Advance paid Rs.": Number(Info.advancePaidRs),
      "Service Type": Info.serviceType,
      "Per day charge Rs": Number(Info.perDayChargeRs),
      "Invoice Cycle": Info.invoiceCycle,
      "Stay In": Info.stayIn ,
      "Long day": Info.longDay ,
      "Long Night": Info.longNight,
      "Service start D/M/Y": Info.serviceStartDate,
      "Service end D/M/Y": Info.serviceEndDate,
      "ProfilePic": Info.ProfilePic,
      "userType": Info.userType,
      "UserId": Info.UserId,
      "patientAadharNumber":Info.patientAadharNumber
    };

 
    const FinelResult = await collection.insertOne({
      HCAComplitInformation: encryptedInfo,
    });

    return {
      success: true,
      message: "You registered successfully with Curate Digital AI",
      insertedId: FinelResult.insertedId.toString(),
    };
  } catch (err: any) {
    console.error("Error in PostFullRegistration:", err);
    return {
      success: false,
      message: "Registration failed",
      error: err.message,
    };
  }
};

export const InserTimeSheet=async(ClientUserId:any,HCAUserId:any,Name:any,Email:any,Contact:any,ClientAdress:any,NameHCA:any,Contacthca:any,TimeSheetArray:any)=>{
  try{
const cluster=await clientPromise
const db=cluster.db("CurateInformation")
const collection=db.collection("TimeSheet")
const TimeSheetDataInsert=await collection.insertOne({
  ClientId:ClientUserId,
  HCAiD:HCAUserId,
  ClientName:Name,
  ClientEmail:Email,
  ClientContact:Contact,
  Adress:ClientAdress,
  HCAName:NameHCA,
  HCAContact:Contacthca,
  Attendence:TimeSheetArray
})
return {
      success: true,
      message: "You registered successfully with Curate Digital AI",
      insertedId: TimeSheetDataInsert.insertedId.toString(),
    };
  }catch(e){

  }
}
export const DeleteTimeSheet=async(clientId:any)=>{

  try{
const Cluster= await clientPromise
const db=Cluster.db("CurateInformation")
const collection=db.collection("TimeSheet")
const DeleteResult=await collection.deleteMany({ClientId:clientId})
   if (DeleteResult.deletedCount > 0) {
      return {
        success: true,
        message: `${DeleteResult.deletedCount} timesheet(s) deleted successfully.`,
      };
    } else {
      return {
        success: false,
        message: "No timesheets found with the given ClientId.",
      };
    }
  }catch(err:any){
  console.error("DeleteTimeSheetByClientId Error:", err);
    return {
      success: false,
      message: "An error occurred while deleting the timesheet(s).",
    };
  }

}
export const InserTerminationData=async(ClientUserId:any,HCAUserId:any,Name:any,Email:any,Contact:any,ClientAdress:any,NameHCA:any,Contacthca:any,TimeSheetArray:any)=>{
  try{
const cluster=await clientPromise
const db=cluster.db("CurateInformation")
const collection=db.collection("Termination")
const TimeSheetDataInsert=await collection.insertOne({
  ClientId:ClientUserId,
  HCAiD:HCAUserId,
  ClientName:Name,
  ClientEmail:Email,
  ClientContact:Contact,
  Adress:ClientAdress,
  HCAName:NameHCA,
  HCAContact:Contacthca,
  Attendence:TimeSheetArray
})
return {
      success: true,
      message: "You registered successfully with Curate Digital AI",
      insertedId: TimeSheetDataInsert.insertedId.toString(),
    };
  }catch(e){

  }
}
export const GetTimeSheetInfo=async()=>{
  try{
const cluster=await clientPromise
const db=cluster.db("CurateInformation")
const collection=db.collection("TimeSheet")
const TimeSheetInfoData=await collection.find().toArray()

const safeUsers = TimeSheetInfoData.map((user: any) => ({
      ...user,
      _id: user._id.toString(),
    }));
return safeUsers
  }catch(e){

  }
}
export const GetTerminationInfo=async()=>{
  try{
const cluster=await clientPromise
const db=cluster.db("CurateInformation")
const collection=db.collection("Termination")
const TimeSheetInfoData=await collection.find().toArray()

const safeUsers = TimeSheetInfoData.map((user: any) => ({
      ...user,
      _id: user._id.toString(),
    }));
return safeUsers
  }catch(e){

  }
}
export const GetUserInformation = async (UserIdFromLocal: any) => {
  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("Registration");

    const UserInformation: any = await collection.findOne({
      userId: UserIdFromLocal,
    });

    if (!UserInformation) return null;

    const decryptedInfo: any = {
      ...UserInformation,
      _id: UserInformation._id?.toString() ?? null,
    };

    for (const [key, value] of Object.entries(UserInformation)) {
      if (
        value &&
        typeof value === "object" &&
        "iv" in value &&
        "content" in value
      ) {
        try {
          decryptedInfo[key] = decrypt(value as { iv: string; content: string });
        } catch (e) {
          console.warn(`Failed to decrypt field ${key}:`, e);
          decryptedInfo[key] = value; 
        }
      }
    }

    return decryptedInfo;
  } catch (err) {
    console.error("Error in GetUserInformation:", err);
    return null;
  }
};




export const GetUserCompliteInformation = async (UserIdFromLocal: any) => {
  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("CompliteRegistrationInformation");

   
    const userId = String(UserIdFromLocal).trim();

   
    const UserInformation: any = await collection.findOne({
      "HCAComplitInformation.UserId": userId,
    });

    if (!UserInformation) return null;

    const info = UserInformation.HCAComplitInformation;


    const safeDecrypt = (field: any) => {
      if (!field || !field.iv || !field.content) return field;
      try {
        return decrypt(field);
      } catch (err) {
        console.warn("Failed to decrypt field:", field, err);
        return field; 
      }
    };

    const decryptedInfo = {
      ...info,
      "Patient Full Name":safeDecrypt(info["Patient Full Name"]),
      "Phone No 1": safeDecrypt(info["Phone No 1"]),
      "Phone No 2": safeDecrypt(info["Phone No 2"]),
      "Email Id": safeDecrypt(info["EmailId"]),
      "Client Aadhar No": safeDecrypt(info["Client Aadhar No"]),
      "Patient Aadhar Number": safeDecrypt(info["Patient Aadhar Number"]),
      "Alternative Client Contact": safeDecrypt(info["Alternative Client Contact"]),
    };

    return {
      ...UserInformation,
      _id: UserInformation._id?.toString() ?? null,
      HCAComplitInformation: decryptedInfo,
    };
  } catch (err: any) {
    console.error("Error fetching user info:", err);
    return null;
  }
};


export const UpdateHCAComplitInformation = async (UserIdFromLocal: any, Info: any) => {
  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("CompliteRegistrationInformation");
  const encryptedInfo = {
      "Phone No 1": encrypt(Info.phoneNo1),
      "Phone No 2": Info.phoneNo2 ? encrypt(Info.phoneNo2) : undefined,
      "Patient Full Name": Info.patientFullName,
      "Date of Birth": Info.dateOfBirth,
      "Age": Number(Info.age),
      "Address": Info.address,
      "Landmark": Info.landmark,
      "City": Info.city,
      "Pin Code": Info.pinCode,
      "State": Info.state || "Telangana", 
      "EmailId": encrypt(Info.emailId),
      "Client Aadhar No": encrypt(Info.clientAadharNo),
      "Client relation to patient": Info.clientRelationToPatient,
      "Alternative Client Contact": encrypt(Info.alternativeClientContact),
      "Mode of Pay": Info.modeOfPay,
      "Registration Rs.": Number(Info.registrationRs),
      "Advance paid Rs.": Number(Info.advancePaidRs),
      "Service Type": Info.serviceType,
      "Per day charge Rs": Number(Info.perDayChargeRs),
      "Invoice Cycle": Info.invoiceCycle,
      "Stay In": Info.stayIn ,
      "Long day": Info.longDay ,
      "Long Night": Info.longNight,
      "Service start D/M/Y": Info.serviceStartDate,
      "Service end D/M/Y": Info.serviceEndDate,
      "ProfilePic": Info.ProfilePic,
      "userType": Info.userType,
      "UserId": Info.UserId,
      "patientAadharNumber":Info.patientAadharNumber,
      
    };
    const result = await collection.updateOne(
      { "HCAComplitInformation.UserId": UserIdFromLocal },
      {
        $set: {
          HCAComplitInformation: encryptedInfo,
        },
      }
    );

    if (result.matchedCount === 0) {
      console.warn("No matching document found for the given UserId.");
      return null;
    }

    return result;
  } catch (err: any) {
    console.error("Error replacing HCAComplitInformation:", err);
    return null;
  }
};

export const GetRegidterdUsers = async () => {
  try {
    const Cluster = await clientPromise;
    const Db = Cluster.db("CurateInformation");
    const Collection = Db.collection("Registration");

    const RegistrationResult = await Collection.find().toArray();

    const safeUsers = RegistrationResult.map((user: any) => {
      const decryptedUser: any = {
        ...user,
        _id: user._id?.toString() ?? null,
      };

      for (const [key, value] of Object.entries(user)) {
        if (
          value &&
          typeof value === "object" &&
          "iv" in value &&
          "content" in value
        ) {
          try {
            decryptedUser[key] = decrypt(value as { iv: string; content: string });
          } catch (e) {
            console.warn(`Failed to decrypt field ${key} for user ${user._id}:`, e);
            decryptedUser[key] = value;
          }
        }
      }

      return decryptedUser;
    });

    return safeUsers;
  } catch (err: any) {
    console.error("Error in GetRegidterdUsers:", err);
    return [];
  }
};



export const GetUsersFullInfo = async () => {
  try {
    const Cluster = await clientPromise;
    const Db = Cluster.db("CurateInformation");
    const Collection = Db.collection("CompliteRegistrationInformation");

    const RegistrationResult = await Collection.find().toArray();

   
    const safeDecrypt = (fieldValue: any) => {
      try {
        if (!fieldValue) return undefined;

        if (typeof fieldValue === "object" && fieldValue.iv && fieldValue.content) {
          return decrypt(fieldValue);
        }

    
        return fieldValue;
      } catch (error) {
        console.warn("Decryption failed, returning raw value:", fieldValue);
        return fieldValue;
      }
    };

    const safeUsers = RegistrationResult.map((user: any) => {
      const info = user.HCAComplitInformation || {};

      return {
        ...user,
        _id: user._id.toString(),
        HCAComplitInformation: {
          ...info,
          "Phone No 1": safeDecrypt(info["Phone No 1"]),
          "Phone No 2": safeDecrypt(info["Phone No 2"]),
          "Email Id": safeDecrypt(info["Email Id"]),
          "Client Aadhar No": safeDecrypt(info["Client Aadhar No"]),
          "Patient Aadhar Number": safeDecrypt(info["Patient Aadhar Number"]),
          "Alternative Client Contact": safeDecrypt(info["Alternative Client Contact"]),
        },
      };
    });

    return safeUsers;
  } catch (err: any) {
    console.error("Error fetching users:", err);
    return [];
  }
};


export const UpdateUserVerificationstatus = async (UserId: string, UpdatedStatus: string) => {
  try {
    const Cluster = await clientPromise
    const Db = Cluster.db("CurateInformation")
    const Collection = Db.collection("Registration")
    const UpdateVerificationStatus = await Collection.updateOne(
      { userId: UserId }, {
      $set: {
        VerificationStatus: UpdatedStatus
      }
    }
    )
    if (UpdateVerificationStatus.modifiedCount === 0) {
      return { success: false, message: 'Internal Error Try Again!' };
    }

    return { success: true, message: 'Verification Status updated successfully.' };
  } catch (err: any) {
    return err
  }
}


export const UpdateUserEmailVerificationstatus = async (UserId: string, UpdatedStatus: string) => {
  try {
    const Cluster = await clientPromise
    const Db = Cluster.db("CurateInformation")
    const Collection = Db.collection("Registration")
    const UpdateVerificationStatus = await Collection.updateOne(
      { userId: UserId }, {
      $set: {
        EmailVerification: UpdatedStatus==="Verified"?true:false,
        
      }
    }
    )
    if (UpdateVerificationStatus.modifiedCount === 0) {
      return { success: false, message: 'Internal Error Try Again!' };
    }

    return { success: true, message: 'Verification Status updated successfully.' };
  } catch (err: any) {
    return err
  }
}



export const UpdateUserContactVerificationstatus = async (UserId: string,ContactStatus:String) => {
  try {
    const Cluster = await clientPromise
    const Db = Cluster.db("CurateInformation")
    const Collection = Db.collection("Registration")
    const UpdateVerificationStatus = await Collection.updateOne(
      { userId: UserId }, {
      $set: {
        
ClientStatus:ContactStatus
      }
    }
    )
    if (UpdateVerificationStatus.modifiedCount === 0) {
      return { success: false, message: 'Internal Error Try Again!' };
    }

    return { success: true, message: 'Verification Status updated successfully.' };
  } catch (err: any) {
    return err
  }
}
export const UpdateHCAnstatus = async (UserId: string,AvailableStatus:String) => {
  try {
    const Cluster = await clientPromise
    const Db = Cluster.db("CurateInformation")
    const Collection = Db.collection("Registration")
    const UpdateVerificationStatus = await Collection.updateOne(
      { userId: UserId }, {
      $set: {
        
Status:AvailableStatus
      }
    }
    )
    if (UpdateVerificationStatus.modifiedCount === 0) {
      return { success: false, message: 'Internal Error Try Again!' };
    }

    return { success: true, message: 'Verification Status updated successfully.' };
  } catch (err: any) {
    return err
  }
}


export const UpdateFinelVerification=async(inputUserId:any)=>{
try{
      const Clustor = await clientPromise
    const Db = Clustor.db("CurateInformation")
    const Collection = Db.collection("Registration")
 
    const result = await Collection.updateOne(
      { userId: inputUserId },
      {
        $set: {
       FinelVerification:true
        },
      }
    );
        if (result.modifiedCount === 0) {
      return { success: false, message: 'User not found or no changes made.' };
    }

    return { success: true, message: 'Password updated successfully.' };
}catch(err:any){

}
}
