"use server";
import { Info } from "lucide-react";
import { decrypt, encrypt, hashValue, verifySHA256 } from "./Actions";

import clientPromise from "./db";
import { TimeStamp } from "@/Redux/reducer";
import { data } from "framer-motion/client";
import { VendorFieldMap } from "./Content";

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

export const IntrestedHCP = async (inputUserId: any, HCPid: any) => {
  try {
    const Cluster = await clientPromise
    const db = Cluster.db("CurateInformation")
    const collection = db.collection("Registration")
    const result = await collection.updateOne(
      { userId: inputUserId }, {
      $set: {
        SuitableHCP: HCPid
      }
    }
    )
    if (result.modifiedCount === 0) {
      return { success: false, message: 'User not found or no changes made.' };
    }

    return { success: true, message: 'Password updated successfully.' };
  } catch (err: any) {

  }
}

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


 const normalizeVendorInput = (formData: any) => {
  const normalized: any = {};

  Object.keys(formData).forEach((label) => {
    const backendKey = VendorFieldMap[label];

    if (backendKey) {
      normalized[backendKey] = formData[label];
    }
  });

  return normalized;
};

export const UpdateVendorInformation = async (Patient: any) => {
  try {
    
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("Registration");

    const orConditions: any[] = [];

    if (Patient.Email)
      orConditions.push({ emailHash: hashValue(Patient.Email.toLowerCase()) });

    if (Patient.ContactNumber)
      orConditions.push({ phoneHash: hashValue(Patient.ContactNumber) });

    if (Patient.AadharNumber)
      orConditions.push({ aadharHash: hashValue(Patient.AadharNumber) });

    let existing = null;
    if (orConditions.length > 0)
      existing = await collection.findOne({ $or: orConditions });

    if (existing) {
      return {
        success: false,
        message: "An account with these details already exists.",
      };
    }


    const sensitiveFields = [
      "VendorName",
      "CompanyName",
      "InstituteName",

      "Email",
      "ContactNumber",
      "PANNumber",
      "AadharNumber",

      "BankName",
      "BankAccount",
      "IFSC",
      "BankBranch",

      "Password",
      "City",
      "State",
    ];


    const encryptedData: any = {
      createdAt: new Date().toISOString(),
    };

    Object.keys(Patient).forEach((key) => {
      if (sensitiveFields.includes(key)) {
        encryptedData[key] = encrypt(Patient[key]); 
      } else {
        encryptedData[key] = Patient[key]; 
      }
    });


    if (Patient.Email)
      encryptedData.emailHash = hashValue(Patient.Email.toLowerCase());

    if (Patient.ContactNumber)
      encryptedData.phoneHash = hashValue(Patient.ContactNumber);

    if (Patient.AadharNumber)
      encryptedData.aadharHash = hashValue(Patient.AadharNumber);

    if (Patient.Password) {
      encryptedData.PasswordValue = encrypt(Patient.Password);
      encryptedData.Password = hashValue(Patient.Password);
    }


    const result = await collection.insertOne(encryptedData);

    return {
      success: true,
      message: "You registered successfully with Curate Digital AI",
      insertedId: result.insertedId.toString(),
    };

  } catch (error) {
    console.error("ERROR:", error);
    throw error;
  }
};






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
  ClientStatus:any,
  ReferdVendorId:any
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
      ReferdVendorId:Patient.ReferdVendorId,

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
export const UpdateNewLeadInformation = async (FinelPostingData: any) => {
  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("Registration");
 const encryptIfExists = (value: string | undefined | null) =>
      value ? encrypt(value) : null;
    const encryptedData = {
      userType: FinelPostingData.userType,
      FirstName: encryptIfExists(FinelPostingData.clientName),
      ContactNumber: encryptIfExists(FinelPostingData.clientPhone),
      Email: encryptIfExists(FinelPostingData.clientEmail),
      patientName: encryptIfExists(FinelPostingData.patientName),
      patientPhone: encryptIfExists(FinelPostingData.patientPhone),
      AbhaId: FinelPostingData.AbhaId,
      RelationtoPatient: FinelPostingData.RelationtoPatient,
      MainpointforPatient: FinelPostingData.MainpointforPatient,
      MainpointforPatientInfo: encryptIfExists(FinelPostingData.MainpointforPatientInfo),
      Source: encryptIfExists(FinelPostingData.Source),
      NewLead: FinelPostingData.NewLead,
      patientAge: FinelPostingData.patientAge,
      patientGender: FinelPostingData.patientGender,
      patientWeight: FinelPostingData.patientWeight,
      patientHeight: FinelPostingData.patientHeight,
      comfortableLanguages: FinelPostingData.comfortableLanguages,
      patientType: FinelPostingData.patientType,
      patientCurrentLocation: FinelPostingData.patientCurrentLocation,
      serviceLocation: encryptIfExists(FinelPostingData.serviceLocation),
      patientHomeAssistance: FinelPostingData.patientHomeAssistance,
      Gloves_Availability: FinelPostingData.Gloves_Availability,
      patientHomeNeeds: FinelPostingData.patientHomeNeeds,
      patientDrNeeds: FinelPostingData.patientDrNeeds,
      patientHealthCard: FinelPostingData.patientHealthCard,
      hcpType: FinelPostingData.hcpType,
      PhysiotherapySpecialisation: FinelPostingData.PhysiotherapySpecialisation,
      MedicalDrSpecialisation: FinelPostingData.MedicalDrSpecialisation,
      PatientBathRoomCleaning: FinelPostingData.PatientBathRoomCleaning,
      HydrationWaterLevel: FinelPostingData.HydrationWaterLevel,
      DocterAdvisedHydrationWaterLevel: FinelPostingData.DocterAdvisedHydrationWaterLevel,
      Patient_Indipendent_Elimination: FinelPostingData.Patient_Indipendent_Elimination,
      Comode: FinelPostingData.Comode,
      Diaper: FinelPostingData.Diaper,
      Urine: FinelPostingData.Urine,
      Juice: FinelPostingData.Juice,
      Doabatic: FinelPostingData.Doabatic,
      DoabaticPlan: FinelPostingData.DoabaticPlan,
      DiabeticSpecification: FinelPostingData.DiabeticSpecification,
      FoodPreparation: FinelPostingData.FoodPreparation,
      FoodPreparationInputs: FinelPostingData.FoodPreparationInputs,
      Allergies: FinelPostingData.Allergies,
      AllergyOption: FinelPostingData.AllergyOption,
      FoodItem: FinelPostingData.FoodItem,
      SpecialFoodItem: FinelPostingData.SpecialFoodItem,
      PatientBathing: FinelPostingData.PatientBathing,
      PatientClothes: FinelPostingData.PatientClothes,
      HairWash: FinelPostingData.HairWash,
      NailCare: FinelPostingData.NailCare,
      Dressing_Grooming: FinelPostingData.Dressing_Grooming,
      Assisting_in_suctioning: FinelPostingData.Assisting_in_suctioning,
      PassiveExercises: FinelPostingData.PassiveExercises,
      ActiveExercises: FinelPostingData.ActiveExercises,
      ResistedExercises: FinelPostingData.ResistedExercises,
      Walking: FinelPostingData.Walking,
      AssistanceRequire: FinelPostingData.AssistanceRequire,
      HIV: FinelPostingData.HIV,
      serviceCharges: FinelPostingData.serviceCharges,
      PatientRoomCleaning: FinelPostingData.PatientRoomCleaning,
      Brushing_FaceFash: FinelPostingData.Brushing_FaceFash,
      BedMaking: FinelPostingData.BedMaking,
      AdditionalComments: FinelPostingData.AdditionalComments,
      Hygiene: FinelPostingData.Hygiene,
      Nutrition: FinelPostingData.Nutrition,
      Vitals: FinelPostingData.Vitals,
      Elimination: FinelPostingData.Elimination,
      Mobility: FinelPostingData.Mobility,
      Medication: FinelPostingData.Medication,
      RemainderTime: FinelPostingData.RemainderTime,
      RemainderDate: FinelPostingData.RemainderDate,
      ClientCardRemarks: FinelPostingData.ClientCardRemarks,
      PatientCardCardRemarks: FinelPostingData.PatientCardCardRemarks,
      PatientDetailsCardRemarks: FinelPostingData.PatientDetailsCardRemarks,
      Hygieneremarks: FinelPostingData.Hygieneremarks,
      Nutritionremarks: FinelPostingData.Nutritionremarks,
      Vitalsremarks: FinelPostingData.Vitalsremarks,
      Eliminationremarks: FinelPostingData.Eliminationremarks,
      Mobilityremarks: FinelPostingData.Mobilityremarks,
      WeightRemarks: FinelPostingData.WeightRemarks,
      HeightRemarks: FinelPostingData.HeightRemarks,
      patientHomeAssistanceRemarks: FinelPostingData.patientHomeAssistanceRemarks,
      patientHomeNeedsRemarks: FinelPostingData.patientHomeNeedsRemarks,
      patientDrNeedsRemarks: FinelPostingData.patientDrNeedsRemarks,
      patientHealthCardRemarks: FinelPostingData.patientHealthCardRemarks,
      hcpTypeRemarks: FinelPostingData.hcpTypeRemarks,
      Current_Previous_Occupation: FinelPostingData.Current_Previous_Occupation,
      Hobbies: FinelPostingData.Hobbies,
      Present_Illness: FinelPostingData.Present_Illness,
      Speciality_Areas: FinelPostingData.Speciality_Areas,
      OnGoing_Treatment: FinelPostingData.OnGoing_Treatment,
      Balance: FinelPostingData.Balance,
      FunctionalAssessmentsRemarks:FinelPostingData.FunctionalAssessmentsRemarks,
      EquipmentRemark:FinelPostingData.EquipmentRemark,
      History_of_Fall: FinelPostingData.History_of_Fall,
      Hearing_Loss: FinelPostingData.Hearing_Loss,
      Visual_Impairment: FinelPostingData.Visual_Impairment,
      Depression: FinelPostingData.Depression,
      Temperature:FinelPostingData.Temperature,
     Pulse:FinelPostingData.Pulse,
     OxygenSaturation:FinelPostingData.OxygenSaturation, 
    BloodPressure:FinelPostingData.BloodPressure,
      Confusion: FinelPostingData.Confusion,
      Frequent_Urination: FinelPostingData.Frequent_Urination,
      Sleep_Issues: FinelPostingData.Sleep_Issues,
      Anxiety: FinelPostingData.Anxiety,
      Mobility_Aids: FinelPostingData.Mobility_Aids,
      Breathing_Equipment: FinelPostingData.Breathing_Equipment,
      Feeding_Method: FinelPostingData.Feeding_Method,
      Floor_Type: FinelPostingData.Floor_Type,
      Washroom_Accessories: FinelPostingData.Washroom_Accessories,
      PhysioScore: FinelPostingData.PhysioScore,
PresentHealthRemarks:FinelPostingData.PresentHealthRemarks,
TreatmentRemarks:FinelPostingData.TreatmentRemarks,
      VerificationStatus: FinelPostingData.VerificationStatus,
      TermsAndConditions: FinelPostingData.TermsAndConditions,
      EmailVerification: FinelPostingData.EmailVerification,
      FinelVerification: FinelPostingData.FinelVerification,
      ClientStatus: FinelPostingData.ClientStatus,
      Medications: FinelPostingData.Medications,
      userId: FinelPostingData.userId,
      SuitableHCP: FinelPostingData.SuitableHCP,
      TimeStampInfo: FinelPostingData.TimeStamp,
      createdAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(encryptedData);

    return {
      success: true,
      message: "Lead Registration Completed Successfully ✅",
      insertedId: result.insertedId.toString(),
    };
  } catch (error) {
    console.error("Error inserting patient data:", error);
    throw new Error("Failed to register lead information.");
  }
};




export const UpdatePatientRegisterCollection=async(UserIdFromLocal: any, Info: any)=>{
try{
   const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("Registration");
   const encryptedData = {
      
      FirstName: encrypt(Info.patientFullName),
      Location: Info.city,
      AadharNumber: encrypt(Info.clientAadharNo),
      Email: encrypt(Info.emailId),
      ContactNumber: encrypt(Info.phoneNo1),
    };
  const result = await collection.updateOne(
      {userId: UserIdFromLocal },
      {
        $set: {
          FirstName: encryptedData.FirstName,
          Location:encryptedData.Location,
          AadharNumber:encryptedData.AadharNumber,
          Email:encryptedData.Email,
          ContactNumber:encryptedData.ContactNumber

        },
      }
    );

    if (result.matchedCount === 0) {
      console.warn("No matching document found for the given UserId.");
      return null;
    }

    return result;
}catch(err:any){

}
}






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


export interface HCAInfo {
  userType: any;
  FirstName: any;
  LastName: any;
  Gender: any;
  DateOfBirth: any;
  MaritalStatus: any;
  Nationality: any;
  AadharNumber: any;
  Age: any;
  ContactNumber: any;
  Email: any;
  Password: any;
  ConfirmPassword?: any;
  Location: any;
  VerificationStatus: any;
  TermsAndConditions: any;
  userId: any;
  FinelVerification: any;
  EmailVerification: any;
  CurrentStatus:any,
  StaffType:any,
  ReferdVedorId:any
}

export const HCARegistration = async (HCA: HCAInfo) => {
  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("Registration");

    const existingHCA = await collection.findOne({
      $or: [
        { emailHash: hashValue(HCA.Email.toLowerCase()) },
        { phoneHash: hashValue(HCA.ContactNumber) },
        { aadharHash: hashValue(HCA.AadharNumber) },
      ],
    });

    if (existingHCA) {
      return {
        success: false,
        message: "An account with these details already exists.",
      };
    }

    
    const encryptedData = {
   
      userType: HCA.userType,
      FirstName:HCA.FirstName? encrypt(HCA.FirstName):'',
      LastName:HCA.LastName? encrypt(HCA.LastName):"",
      Gender: encrypt(HCA.Gender),
      DateOfBirth: encrypt(HCA.DateOfBirth),
      MaritalStatus: HCA.MaritalStatus,
      Nationality: HCA.Nationality,
      AadharNumber:HCA.AadharNumber? encrypt(HCA.AadharNumber):"",
      Age: HCA.Age,
      ContactNumber: encrypt(HCA.ContactNumber),
      Email: encrypt(HCA.Email),
      Location:HCA.Location,
CurrentStatus:HCA.CurrentStatus,
StaffType:HCA.StaffType,

      emailHash: hashValue(HCA.Email.toLowerCase()),
      phoneHash: hashValue(HCA.ContactNumber),
      aadharHash: hashValue(HCA.AadharNumber),

    
      Password: hashValue(HCA.Password),

      userId: HCA.userId,
      ReferdVedorId:HCA.ReferdVedorId,
      VerificationStatus: HCA.VerificationStatus,
      TermsAndConditions: HCA.TermsAndConditions,
      FinelVerification: HCA.FinelVerification,
      EmailVerification: HCA.EmailVerification,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(encryptedData);

    return {
      success: true,
      message: "You registered successfully with Curate Digital AI",
      insertedId: result.insertedId.toString(),
    };
  } catch (err: any) {
    console.error("Error in HCARegistration:", err);
    throw err;
  }
};


export const PostFullRegistration = async (Info: any) => {
  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("CompliteRegistrationInformation");


    const encryptedInfo = {
      "Phone No 1": encrypt(Info.phoneNo1),
      "Phone No 2":Info.phoneNo2? encrypt(Info.phoneNo2):null ,
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
      "patientAadharNumber":encrypt(Info.patientAadharNumber)
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


export const PostHCAFullRegistration = async (Info: any) => {
  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("CompliteRegistrationInformation");

    const encryptedInfo = {
   
      "Title": Info.title,
      "First Name": encrypt(Info.firstName),
      "Surname": encrypt(Info.surname),
      "Father Name":Info.fatherName? encrypt(Info.fatherName):null,
      "Mother Name":Info.motherName? encrypt(Info.motherName):null,
      "Husband Name": Info.husbandName ? encrypt(Info.husbandName) : null,
      "Gender": Info.gender,
      "Date of Birth": Info.dateOfBirth,
      "Marital Status": Info.maritalStatus,
      
      'SiblingsInfo':Info.SiblingsInfo,
      'earningSource':Info.earningSource,

    
      "EmailId": encrypt(Info.emailId),
      "Mobile Number": encrypt(Info.mobileNumber),
      "Aadhar Card No": encrypt(Info.aadharCardNo),
      "PAN Number": Info.panNumber ? encrypt(Info.panNumber) : null,
      "Voter ID No": Info.voterIdNo ? encrypt(Info.voterIdNo) : null,
      "Ration Card No": Info.rationCardNo ? encrypt(Info.rationCardNo) : null,

      
      "Permanent Address": Info.permanentAddress,
      "Current Address": Info.currentAddress,
      "City/Postcode Permanent": Info.cityPostcodePermanent,
      "City/Postcode Current": Info.cityPostcodeCurrent,

    
      "Higher Education": Info.higherEducation,
      "Higher Education Year Start": Info.higherEducationYearStart,
      "Higher Education Year End": Info.higherEducationYearEnd,
      "Professional Education": Info.professionalEducation,
      "Professional Education Year Start": Info.professionalEducationYearStart,
      "Professional Education Year End": Info.professionalEducationYearEnd,

      "HomeAssistance":Info.HomeAssistance,
      "Registration Council": Info.registrationCouncil,
      "Registration No": Info.registrationNo,
      "ProfessionalSkills": Info.professionalSkill,
      "HandledSkills":Info.HandledSkills,
      "Certified By": Info.certifiedBy,
      "Professional Work 1": Info.professionalWork1,
      "Professional Work 2": Info.professionalWork2,
      "Experience": Info.experience,

      "Height": Info.height,
      "Weight": Info.weight,
      "Hair Colour": Info.hairColour,
      "Eye Colour": Info.eyeColour,
      "Complexion": Info.complexion,
      "Any Deformity": Info.anyDeformity,
      "Mole/Body Mark 1": Info.moleBodyMark1,
      "Mole/Body Mark 2": Info.moleBodyMark2,

   
      "Report Previous Health Problems": Info.reportPreviousHealthProblems,
      "Report Current Health Problems": Info.reportCurrentHealthProblems,

   
      "Source of Referral": Info.sourceOfReferral,
      "Date of Referral": Info.dateOfReferral,

  
      "Reference 1 Name": Info.reference1Name,
      "Reference 1 Aadhar":Info.reference1Aadhar? encrypt(Info.reference1Aadhar):null,
      "Reference 1 Mobile":Info.reference1Mobile? encrypt(Info.reference1Mobile):null,
      "Reference 1 Address": Info.reference1Address,
      "Reference 1 Relationship": Info.reference1Relationship,

      "Reference 2 Name": Info.reference2Name,
      "Reference 2 Aadhar":Info.reference2Aadhar? encrypt(Info.reference2Aadhar):null,
      "Reference 2 Mobile":Info.reference2Mobile? encrypt(Info.reference2Mobile):null,
      "Reference 2 Address": Info.reference2Address,

  
      "Service Hours 12hrs": Info.serviceHours12hrs || false,
      "Service Hours 24hrs": Info.serviceHours24hrs || false,
      "Preferred Service": Info.preferredService,

   
      "Payment Service": Info.paymentService,
      "Payment Bank Name":  encrypt(Info.paymentBankName),
      "Payment Bank Account Number": encrypt(Info.paymentBankAccountNumber),
      "IFSC Code": encrypt( Info.ifscCode),
      "Bank Branch Address": Info.bankBranchAddress,
      "Bank Branch Name": Info.Bankbranchname,
      "Branch City": Info.Branchcity,
      "Branch State": Info.Branchstate,
      "Branch Pincode": Info.Branchpincode,

     
      "Languages": Info.languages,
      "Type": Info.type,
      "Specialties": Info.specialties,

 
      "userType": Info.userType,
      "UserId": Info.UserId,
      "DocumentSkipReason":Info.DocumentSkipReason,
      "ProfilePic": Info.Documents.ProfilePic || null,
      "Documents":Info. Documents,
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
        console.log("Checking With Fucntion Adress----", ClientAdress)
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



export const TestInserTimeSheet = async (
  StartDate: any,
  EndDate: any,
  Status: any,
  location: any,
  clientPhone: any,
  clientName: any,
  patientName: any,
  patientPhone: any,
  referralName: any,
  hcpId: any,
  ClientId: any,
  hcpName: any,
  hcpPhone: any,
  hcpSource: any,
  provider: any,
  payTerms: any,
  cTotal: any,
  cPay: any,
  hcpTotal: any,
  hcpPay: any,
  Month: any,
  TimeSheetArray: any,
  UpdatedBy: any,
  invoice:any,
  Type:any
) => {
  try {
    console.log("🟢 Upserting Timesheet for Client:", TimeStamp);

    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("TimeSheet");

    const TimeSheetData = {
      StartDate:StartDate,
      EndDate:EndDate,
      Status:Status,
      ClientId:ClientId,
      HCAId: hcpId,
      ClientName: clientName,
      patientName:patientName,
      patientPhone:patientPhone,
      ClientContact: clientPhone,
      Address: location,
      HCAName: hcpName,
      HCAContact: hcpPhone,
      referralName:referralName,
      hcpSource:hcpSource,
      provider:provider,
      payTerms:payTerms,
      cTotal:cTotal,
      cPay:cPay,
      hcpTotal:hcpTotal,
      hcpPay:hcpPay,
      Month:Month,
      Attendance: TimeSheetArray,
      UpdatedAt: new Date(),
      UpdatedBy: UpdatedBy,
      invoice:invoice,
      Type:Type
    };

  const TimeSheetDataInsert=await collection.insertOne(TimeSheetData)

return {
      success: true,
      message: "You registered successfully with Curate Digital AI",
      insertedId: TimeSheetDataInsert.insertedId.toString(),
    };
  } catch (error: any) {
    console.error("❌ Error inserting/updating timesheet:", error.message);
    return {
      success: false,
      message: "Error inserting/updating timesheet: " + error.message,
    };
  }
};


export const UpdateTimeSheet = async (
 
  hcpId: any,
  Month: any,
  Status: any,      
  UpdatedBy: any
) => {
  try {
    console.log("🟢 Updating TimeSheet status for Client:", hcpId);

    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("TimeSheet");



 
    const result = await collection.updateOne(
      {  HCAId: hcpId, Month: Month },
      {
        $push: { Attendance: Status },
        $set: {
          UpdatedAt: new Date(),
          UpdatedBy: UpdatedBy,
        },
      }
    );

    if (result.modifiedCount > 0) {
      return {
        success: true,
        message: `✅ Your attendance status “${Status}” has been added to the timesheet for ${new Date().toLocaleDateString('In-en')}!`,

        
      };
    } else {
      return {
        success: false,
        message: "⚠️ No changes were made to the TimeSheet.",
      };
    }
  } catch (error: any) {
    console.error("❌ Error updating timesheet status:", error.message);
    return {
      success: false,
      message: "Error updating timesheet status: " + error.message,
    };
  }
};

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
      "PatientAadharNumber": safeDecrypt(info["patientAadharNumber"]),
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

export const GetHCACompliteInformation = async (UserIdFromLocal: any) => {
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
      if (!field) return null;

    
      if (typeof field === "object" && field.iv && field.content) {
        try {
          return decrypt(field);
        } catch (err) {
          console.warn("Failed to decrypt field:", field, err);
          return null;
        }
      }

   
      return field;
    };

  
    const decryptedInfo = {
      ...info,

     
      "Title": info["Title"],
      "First Name": safeDecrypt(info["First Name"]),
      "Surname": safeDecrypt(info["Surname"]),
      "Father Name": safeDecrypt(info["Father Name"]),
      "Mother Name": safeDecrypt(info["Mother Name"]),
      "Husband Name": safeDecrypt(info["Husband Name"]),
      "Gender": info["Gender"],
      "Date of Birth": info["Date of Birth"],
      "Marital Status": info["Marital Status"],

   
      "EmailId": safeDecrypt(info["EmailId"]),
      "Mobile Number": safeDecrypt(info["Mobile Number"]),
      "Aadhar Card No": safeDecrypt(info["Aadhar Card No"]),
      "PAN Number": safeDecrypt(info["PAN Number"]),
      "Voter ID No": safeDecrypt(info["Voter ID No"]),
      "Ration Card No": safeDecrypt(info["Ration Card No"]),

    
      "Permanent Address": info["Permanent Address"],
      "Current Address": info["Current Address"],
      "City/Postcode Permanent": info["City/Postcode Permanent"],
      "City/Postcode Current": info["City/Postcode Current"],

   
      "Higher Education": info["Higher Education"],
      "Higher Education Year Start": info["Higher Education Year Start"],
      "Higher Education Year End": info["Higher Education Year End"],
      "Professional Education": info["Professional Education"],
      "Professional Education Year Start": info["Professional Education Year Start"],
      "Professional Education Year End": info["Professional Education Year End"],

      
      "Registration Council": info["Registration Council"],
      "Registration No": info["Registration No"],
      "Professional Skill": info["Professional Skill"],
      "Certified By": info["Certified By"],
      "Professional Work 1": info["Professional Work 1"],
      "Professional Work 2": info["Professional Work 2"],
      "Experience": info["Experience"],


      "Height": info["Height"],
      "Weight": info["Weight"],
      "Hair Colour": info["Hair Colour"],
      "Eye Colour": info["Eye Colour"],
      "Complexion": info["Complexion"],
      "Any Deformity": info["Any Deformity"],
      "Mole/Body Mark 1": info["Mole/Body Mark 1"],
      "Mole/Body Mark 2": info["Mole/Body Mark 2"],


      "Report Previous Health Problems": info["Report Previous Health Problems"],
      "Report Current Health Problems": info["Report Current Health Problems"],

 
      "Source of Referral": info["Source of Referral"],
      "Date of Referral": info["Date of Referral"],

  
      "Reference 1 Name": info["Reference 1 Name"],
      "Reference 1 Aadhar": safeDecrypt(info["Reference 1 Aadhar"]),
      "Reference 1 Mobile": safeDecrypt(info["Reference 1 Mobile"]),
      "Reference 1 Address": info["Reference 1 Address"],
      "Reference 1 Relationship": info["Reference 1 Relationship"],

      "Reference 2 Name": info["Reference 2 Name"],
      "Reference 2 Aadhar": safeDecrypt(info["Reference 2 Aadhar"]),
      "Reference 2 Mobile": safeDecrypt(info["Reference 2 Mobile"]),
      "Reference 2 Address": info["Reference 2 Address"],

      
      "Service Hours 12hrs": info["Service Hours 12hrs"],
      "Service Hours 24hrs": info["Service Hours 24hrs"],
      "Preferred Service": info["Preferred Service"],

      
      "Payment Service": info["Payment Service"],
      "Payment Bank Name": safeDecrypt(info["Payment Bank Name"]),
      "Payment Bank Account Number": safeDecrypt(info["Payment Bank Account Number"]),
      "IFSC Code": safeDecrypt(info["IFSC Code"]),
      "Bank Branch Address": info["Bank Branch Address"],
      "Bank Branch Name": info["Bank Branch Name"],
      "Branch City": info["Branch City"],
      "Branch State": info["Branch State"],
      "Branch Pincode": info["Branch Pincode"],

    
      "Languages": info["Languages"],
      "Type": info["Type"],
      "Specialties": info["Specialties"],

      
      "UserType": info["UserType"],
      "UserId": info["UserId"],
      "DocumentSkipReason": info["DocumentSkipReason"],
      "ProfilePic": info["ProfilePic"],
      "Documents": info["Documents"],
    };

    return {
      _id: UserInformation._id?.toString() ?? null,
      HCAComplitInformation: decryptedInfo,
    };
  } catch (err: any) {
    console.error("Error fetching user info:", err);
    return null;
  }
};



export const UpdateClientComplitInformation = async (UserIdFromLocal: any, Info: any) => {
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

export const UpdateHCAComplitInformation = async (UserIdFromLocal: any, Info: any) => {

  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("CompliteRegistrationInformation");
 const encryptedInfo = { 
  
  "Title": Info.title || null,
  "First Name": Info.firstName ? encrypt(Info.firstName) : null,
  "Surname": Info.surname ? encrypt(Info.surname) : null,
  "Gender": Info.gender || null,
  "Date of Birth": Info.dateOfBirth || null,
  "Marital Status": Info.maritalStatus || null,

  
  "EmailId": Info.emailId ? encrypt(Info.emailId) : null,
  "Mobile Number": Info.mobileNumber ? encrypt(Info.mobileNumber) : null,

  
  "Aadhar Card No": Info.aadharCardNo ? encrypt(Info.aadharCardNo) : null,
  "PAN Number": Info.panNumber ? encrypt(Info.panNumber) : null,
  "Ration Card No": Info.rationCardNo ? encrypt(Info.rationCardNo) : null,
  "Voter ID No": Info.voterIdNo ? encrypt(Info.voterIdNo) : null,


  "Permanent Address": Info.permanentAddress || null,
  "Current Address": Info.currentAddress || null,
  "City/Postcode Permanent": Info.cityPostcodePermanent || null,
  "City/Postcode Current": Info.cityPostcodeCurrent || null,


  "Height": Info.height || null,
  "Weight": Info.weight || null,
  "Hair Colour": Info.hairColour || null,
  "Eye Colour": Info.eyeColour || null,
  "Complexion": Info.complexion || null,
  "Mole/Body Mark 1": Info.moleBodyMark1 || null,
  "Mole/Body Mark 2": Info.moleBodyMark2 || null,
  "Any Deformity": Info.anyDeformity || null,


  "Experience": Info.experience || null,
  "Professional Work 1": Info.professionalWork1 || null,
  "Professional Work 2": Info.professionalWork2 || null,
  "Professional Education": Info.professionalEducation || null,
  "Higher Education": Info.higherEducation || null,
  "Higher Education Year Start": Info.higherEducationYearStart || null,
  "Higher Education Year End": Info.higherEducationYearEnd || null,
  "Professional Education Year Start": Info.professionalEducationYearStart || null,
  "Professional Education Year End": Info.professionalEducationYearEnd || null,
  "Registration Council": Info.registrationCouncil || null,
  "Registration No": Info.registrationNo || null,
  "Professional Skill": Info.ProfetionSkill || null,
  "Certified By": Info.certifiedBy || null,

  
  "Report Previous Health Problems": Info.reportPreviousHealthProblems || null,
  "Report Current Health Problems": Info.reportCurrentHealthProblems || null,


  "Reference 1 Name": Info.reference1Name || null,
  "Reference 1 Aadhar": Info.reference1Aadhar ? encrypt(Info.reference1Aadhar) : null,
  "Reference 1 Mobile": Info.reference1Mobile ? encrypt(Info.reference1Mobile) : null,
  "Reference 1 Address": Info.reference1Address || null,
  "Reference 1 Relationship": Info.reference1Relationship || null,

  "Reference 2 Name": Info.reference2Name || null,
  "Reference 2 Aadhar": Info.reference2Aadhar ? encrypt(Info.reference2Aadhar) : null,
  "Reference 2 Mobile": Info.reference2Mobile ? encrypt(Info.reference2Mobile) : null,
  "Reference 2 Address": Info.reference2Address || null,

 
  "Service Hours 12hrs": Info.serviceHours12hrs || false,
  "Service Hours 24hrs": Info.serviceHours24hrs || false,
  "Preferred Service": Info.preferredService || null,

  
  "Payment Service": Info.paymentService || null,
  "Payment Bank Name": Info.paymentBankName ? encrypt(Info.paymentBankName) : null,
  "Payment Bank Account Number": Info.paymentBankAccountNumber ? encrypt(Info.paymentBankAccountNumber) : null,
  "IFSC Code": Info.ifscCode ? encrypt(Info.ifscCode) : null,
  "Bank Branch Name": Info.Bankbranchname || null,
  "Bank Branch Address": Info.bankBranchAddress || null,
  "Branch City": Info.Branchcity || null,
  "Branch State": Info.Branchstate || null,
  "Branch Pincode": Info.Branchpincode || null,


  "Languages": Info.languages || null,
  "Type": Info.type || null,
  "Specialties": Info.specialties || null,


  "userType": Info.userType || null,
  "UserId": Info.UserId || null,
  "DocumentSkipReason": Info.DocumentSkipReason || null,


  "ProfilePic": Info.Documents?.ProfilePic || null,
  "Documents": Info.Documents || {},
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


export const PostConfirmationInfo=async(HCPUserid:any,ClientId:any)=>{
try{
  const Cluster = await clientPromise;
    const Db = Cluster.db("CurateInformation");
    const Collection = Db.collection("Confimations");
    const PostResult=await Collection.insertOne({
      InformedHCPID:HCPUserid,
      InformedClientID:ClientId

    })
    return {
      success: true,
      message: "You registered successfully with Curate Digital AI",
      insertedId: PostResult.insertedId.toString(),
    };
}catch(err:any){

}
}


export const GetInformedUsers=async()=>{
  try{
    const Cluster=await clientPromise
   const Db = Cluster.db("CurateInformation");
    const Collection = Db.collection("Confimations");
     const RegistrationResult = await Collection.find().toArray();
     const plainHCPs = RegistrationResult.map(hcp => ({
  ...hcp,
  _id: hcp._id.toString(),
}));
     return plainHCPs
  }catch(err:any){

  }
}

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


    const safeUsers: any = RegistrationResult.map((user: any) => {
  const info: any = user.HCAComplitInformation || {};

  return {
    ...user,
    _id: user._id.toString(),
    HCAComplitInformation: {
      ...info,
      "HCPFirstName":safeDecrypt(info["First Name"]),
      "HCPContactNumber":safeDecrypt(info["Mobile Number"]),
      "HCPEmail":safeDecrypt(info["EmailId"]),
      "HCPSurName":safeDecrypt(info["Surname"]),
      "HCPAdharNumber": safeDecrypt(info["Aadhar Card No"]),
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
export const UpdateUserCurrentstatus = async (UserId: string, UpdatedStatus: string) => {
  try {
    const Cluster = await clientPromise
    const Db = Cluster.db("CurateInformation")
    const Collection = Db.collection("Registration")
    const UpdateVerificationStatus = await Collection.updateOne(
      { userId: UserId }, {
      $set: {
        CurrentStatus:UpdatedStatus,
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

export const UpdateHCAnstatusInFullInformation = async (Userid: string,) => {
  try {
    const Cluster = await clientPromise;
    const Db = Cluster.db("CurateInformation");
    const collection = Db.collection("CompliteRegistrationInformation");
const Try:any="Assigned"
    const UpdateVerificationStatus = await collection.updateOne(
      { "HCAComplitInformation.UserId": Userid },
      { $push: {  "HCAComplitInformation.Status":Try  } }
    );

    if (UpdateVerificationStatus.matchedCount === 0) {
      return { success: false, message: 'User not found!' };
    }

    return { success: true, message: 'Verification Status updated successfully.' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Internal Error' };
  }
};

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


export const UpdateRemainderTimer = async (UserId: any, NewTime: string, NewDate: any) => {
  try {
    const Clustor = await clientPromise
    const Db = Clustor.db("CurateInformation")
    const Collection = Db.collection("Registration")
    const UpdateTime = await Collection.updateOne(
      { userId: UserId },
      {
        $set: {
          RemainderTime: NewTime,
          RemainderDate: NewDate
        },
      }
    )
    if (UpdateTime.modifiedCount === 0) {
      return { success: false, message: 'User not found or no changes made.' };
    }

    return { success: true, message: 'Password updated successfully.' };
  } catch (err: any) {

  }

}















