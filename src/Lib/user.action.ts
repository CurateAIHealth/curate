"use server";
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


export const SignInRessult = async (SignInfor: { Name: any, Password: any }) => {
  try {
    const Clustor = await clientPromise;
    const Db = Clustor.db("CurateInformation");
    const Collection = Db.collection("Registration");

    const SignInInformation: any = await Collection.findOne({
      Email: SignInfor.Name,
      ConfirmPassword: SignInfor.Password,
    });

    if (!SignInInformation.EmailVerification) {
      return { success: false, message: 'Verify your Email To Login' };
    }

    return SignInInformation.userId?.toString?.();
  } catch (err: any) {

    return null;
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
          Password: UpdatedData.NewUpdatedPassword,

          ConfirmPassword: UpdatedData.NewConfirmUpdatedPassword
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
  Email: any,
  ContactNumber: any,
  Password: any,
  userId: any,
  Gender:any
  ConfirmPassword: any,
  VerificationStatus: any,
  TermsAndConditions: any
  FamilyMembars: any,
  EmailVerification: any,
   FinelVerification:any,
}) => {
  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("Registration");


    const existingDoctor = await collection.findOne({
      $or: [
        { Email: Patient.Email },
        { RegistrationNumber: Patient.ContactNumber },
        { AadharNumber: Patient.AadharNumber, }
      ],
    });

    if (existingDoctor) {
      return {
        success: false,
        message: "An account with these details already exists.",
      };
    }

    const result = await collection.insertOne({
      ...Patient,
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

export const PostFullRegistration=async(Info:any)=>{
try{
 const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("CompliteRegistrationInformation");
    const FinelResult=await collection.insertOne({HCAComplitInformation:Info})
       return {
      success: true,
      message: "You registered successfully with Curate Digital AI",
      insertedId: FinelResult.insertedId.toString(),
    };
}catch(err:any){

}
}
export const GetUserInformation = async (UserIdFromLocal: any) => {
  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("Registration")
    const UserInformation: any = await collection.findOne({ userId: UserIdFromLocal })
    if (!UserInformation) return null;


    return {
      ...UserInformation,
      _id: UserInformation._id?.toString() ?? null,

    }
  } catch (err: any) {

  }
}

export const GetUserCompliteInformation = async (UserIdFromLocal: any) => {
  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("CompliteRegistrationInformation");

    const UserInformation: any = await collection.findOne({
      "HCAComplitInformation.UserId": UserIdFromLocal,
    });

    if (!UserInformation) return null;

    return {
      ...UserInformation,
      _id: UserInformation._id?.toString() ?? null,
    };
  } catch (err: any) {
    console.error("Error fetching user info:", err);
    return null;
  }
};


export const GetRegidterdUsers = async () => {
  try {
    const Cluster = await clientPromise
    const Db = Cluster.db("CurateInformation")
    const Collection = Db.collection("Registration")
    const RegistrationResult = await Collection.find().toArray()
    const safeUsers = RegistrationResult.map((user: any) => ({
      ...user,
      _id: user._id.toString(),
    }));
    return safeUsers
  } catch (err: any) {
    return err
  }
}

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
        EmailVerification: UpdatedStatus==="Verified"?true:false
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
