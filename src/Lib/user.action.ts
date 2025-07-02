"use server";
import clientPromise from "./db";

export const UpdateInformation = async (doctorInfo: {
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
}) => {
  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("Registration");


    const existingDoctor = await collection.findOne({
      $or: [
        { Email: doctorInfo.Email },
        { RegistrationNumber: doctorInfo.RegistrationNumber },
      ],
    });

    if (existingDoctor) {
      return {
        success: false,
        message: "Doctor registered with email or registration number already exists.",
      };
    }

    const result = await collection.insertOne({
      ...doctorInfo,
      createdAt: new Date(),
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
    const Clustor = await clientPromise
    const Db = Clustor.db("CurateInformation")
    const Collection = Db.collection("Registration")
    const SignInInformation:any = Collection.findOne({
       Email: SignInfor.Name,
       ConfirmPassword: SignInfor.Password,
    })
    if (!SignInInformation) return null;
    return SignInInformation.userId
  } catch (err: any) {

  }
}

export const UpdatePassword=async(UpdatedData:{InputUserId:any,NewPassword:any,ConfirmNewPassword:any})=>{
try{
 const Clustor = await clientPromise
    const Db = Clustor.db("CurateInformation")
    const Collection = Db.collection("Registration")
      const result = await Collection.updateOne(
      { userId: UpdatedData.InputUserId },
      {
        $set: {
          Password: UpdatedData.NewPassword,
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