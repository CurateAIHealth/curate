import { decrypt, hashValue } from "./Actions";
import clientPromise from "./db";

export const SignInRessult = async (SignInfor: {
  Name: string;
  Password: string;
}) => {
  try {
console.log("SERVER ACTION START", Date.now());

    console.time("DB_CONNECTION");
    const cluster = await clientPromise;
    console.timeEnd("DB_CONNECTION");

    const db = cluster.db("CurateInformation");
    const collection = db.collection("Registration");

    console.time("HASH_EMAIL");
    const emailHash = hashValue(SignInfor.Name);
    console.timeEnd("HASH_EMAIL");

    console.time("HASH_PASSWORD");
    const passwordHash = hashValue(SignInfor.Password);
    console.timeEnd("HASH_PASSWORD");

    console.time("MONGO_FIND");
    const user: any = await collection.findOne(
      {
        emailHash,
        Password: passwordHash,
      },
      {
        projection: {
          userId: 1,
          Email: 1,
          EmailVerification: 1,
        },
      }
    );
    console.timeEnd("MONGO_FIND");

    if (!user) {
      console.timeEnd("LOGIN_TOTAL");

      return {
        success: false,
        message: "Invalid Email or Password",
      };
    }

    console.time("EMAIL_VERIFICATION_CHECK");

    if (!user.EmailVerification) {
      console.timeEnd("EMAIL_VERIFICATION_CHECK");
      console.timeEnd("LOGIN_TOTAL");

      return {
        success: false,
        message: "Verify your Email To Login",
      };
    }

    console.timeEnd("EMAIL_VERIFICATION_CHECK");

    console.time("DECRYPT_EMAIL");
    const email = user.Email ? decrypt(user.Email) : "";
    console.timeEnd("DECRYPT_EMAIL");

    console.timeEnd("LOGIN_TOTAL");

    return {
      success: true,
      userId: user.userId,
      email,
    };
  } catch (err) {
    console.error("SignIn Error:", err);
    console.timeEnd("LOGIN_TOTAL");

    return {
      success: false,
      message: "Something went wrong",
    };
  }
};;

export const GetInvoiceInfo=async()=>{
  try{
const cluster=await clientPromise
const db=cluster.db("CurateInformation")
const collection=db.collection("Invoices")
const TimeSheetInfoData=await collection.find().toArray()

const safeUsers = TimeSheetInfoData.map((user: any) => ({
      ...user,
      _id: user._id.toString(),
    }));
return safeUsers
  }catch(e){

  }
}
export const GetDeploymentInfo = async (projection?: any) => {
  try {
    const cluster = await clientPromise;

    const db = cluster.db("CurateInformation");
    const collection = db.collection("Deployment");

    console.time("FIRST_RECORD");

    const first = await collection.findOne(
      {},
      { projection }
    );

    console.timeEnd("FIRST_RECORD");

    console.time("Mongo Query");

    const TimeSheetInfoData = await collection.find(
      {},
      { projection }
    ).toArray();

    console.timeEnd("Mongo Query");

    console.log("Records Count:", TimeSheetInfoData.length);

    return TimeSheetInfoData.map((item: any) => ({
      ...item,
      _id: item._id?.toString(),
    }));
  } catch (e) {
    console.error("GetDeploymentInfo Error:", e);
    return [];
  }
};

export const GetRegidterdUsersforTimeSheet = async () => {
  try {
    const Cluster = await clientPromise;
    const Db = Cluster.db("CurateInformation");
    const Collection = Db.collection("Registration");

    const RegistrationResult = await Collection
      .find(
        {},
        {
          projection: {
            _id: 1,
            userId: 1,
            PreviewUserType: 1,
          },
        }
      )
      .toArray();

    return RegistrationResult.map((user: any) => ({
      _id: user._id?.toString() ?? null,
      userId: user.userId,
      PreviewUserType: user.PreviewUserType,
    }));
  } catch (err: any) {
    console.error("Error in GetRegidterdUsers:", err);
    return [];
  }
};
export const HCPRevew = async (
  Userid: string,
  Review: Record<string, any>
): Promise<{ success: boolean; message: string }> => {
  try {
    // Validation
    if (!Userid?.trim()) {
      return {
        success: false,
        message: "Invalid User ID.",
      };
    }

    if (!Review || typeof Review !== "object" || Array.isArray(Review)) {
      return {
        success: false,
        message: "Invalid review data.",
      };
    }

    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const collection = db.collection("CompliteRegistrationInformation");

    const result = await collection.updateOne(
      {
        "HCAComplitInformation.UserId": Userid,
      },
      {
        $push: {
          "HCAComplitInformation.Reviews": Review,
        }as any,
      }
    );

    if (result.matchedCount === 0) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    if (result.modifiedCount === 0) {
      return {
        success: false,
        message: "Review could not be added.",
      };
    }

    return {
      success: true,
      message: "Review posted successfully.",
    };
  } catch (error: any) {
    console.error("HCPReview Error:", error);

    return {
      success: false,
      message: error?.message || "Internal server error.",
    };
  }
};
export const GetUsersFullInfoforTimeSheet = async () => {
  try {
    const Cluster = await clientPromise;
    const Db = Cluster.db("CurateInformation");
    const Collection = Db.collection("CompliteRegistrationInformation");

    const RegistrationResult = await Collection
      .find(
        {},
        {
          projection: {
            _id: 1,
            "HCAComplitInformation.UserId": 1,
            "HCAComplitInformation.Gender": 1,
          },
        }
      )
      .toArray();

    return RegistrationResult.map((user: any) => ({
      _id: user._id?.toString() ?? null,
      HCAComplitInformation: {
        UserId: user?.HCAComplitInformation?.UserId || "",
        Gender: user?.HCAComplitInformation?.Gender || "",
      },
    }));
  } catch (err: any) {
    console.error("Error fetching users:", err);
    return [];
  }
};

let applicationCache: any = null;
let applicationCacheTime = 0;

export const GetApplicationData = async () => {
  console.time("TOTAL_GetApplicationData");

  const now = Date.now();

  if (
    applicationCache &&
    now - applicationCacheTime < 30 * 60 * 1000
  ) {
    console.log(
      "APPLICATION CACHE HIT",
      `${now - applicationCacheTime}ms old`
    );
    console.timeEnd("TOTAL_GetApplicationData");
    return applicationCache;
  }

  console.log("APPLICATION CACHE MISS");

  console.time("GetDeploymentInfo");
  const deploymentPromise = GetDeploymentInfo({
    invoice: 1,
    StartDate: 1,
    EndDate: 1,
    Status: 1,
    Address: 1,
    ClientContact: 1,
    ClientName: 1,
    ClientId: 1,
    patientName: 1,
    referralName: 1,
    HCAId: 1,
    HCAName: 1,
    HCAContact: 1,
    hcpSource: 1,
    provider: 1,
    payTerms: 1,
    cTotal: 1,
    cPay: 1,
    hcpTotal: 1,
    hcpPay: 1,
    Attendance: 1,
    CareTakerPrice: 1,
    Month: 1,
    Replacement: 1,
    ClientAttendance:1
  }).finally(() => {
    console.timeEnd("GetDeploymentInfo");
  });

  console.time("GetRegidterdUsersforTimeSheet");
  const registeredPromise =
    GetRegidterdUsersforTimeSheet().finally(() => {
      console.timeEnd("GetRegidterdUsersforTimeSheet");
    });

  console.time("GetUsersFullInfoforTimeSheet");
  const usersPromise =
    GetUsersFullInfoforTimeSheet().finally(() => {
      console.timeEnd("GetUsersFullInfoforTimeSheet");
    });

  console.time("Promise.all");

  const [
    deploymentInfo,
    registeredUsers,
    usersFullInfo,
  ] = await Promise.all([
    deploymentPromise,
    registeredPromise,
    usersPromise,
  ]);

  console.timeEnd("Promise.all");

  console.log(
    "deploymentInfo:",
    deploymentInfo?.length || 0
  );

  console.log(
    "registeredUsers:",
    registeredUsers?.length || 0
  );

  console.log(
    "usersFullInfo:",
    usersFullInfo?.length || 0
  );

  applicationCache = {
    deploymentInfo,
    registeredUsers,
    usersFullInfo,
  };

  applicationCacheTime = Date.now();

  console.timeEnd("TOTAL_GetApplicationData");

  return applicationCache;
};




export const UpdateDeploymentStatus = async (
  userId: string,
  HCPId: any,
  MonthValue: any,
  ImpValue: any
) => {
  console.time("UpdateDeploymentStatus");

  try {
    console.time("MongoConnection");

    const client = await clientPromise;

    console.timeEnd("MongoConnection");

    const db = client.db("CurateInformation");
    const collection = db.collection("Deployment");

    console.log("Query:", {
      ClientId: userId,
      HCAId: HCPId,
      Month: MonthValue,
    });

    console.time("MongoUpdate");

    const result = await collection.updateOne(
      {
        ClientId: userId,
        HCAId: HCPId,
        Month: MonthValue,
      },
      {
        $set: {
          Status: ImpValue,
        },
      }
    );

    console.timeEnd("MongoUpdate");

    console.log("Matched:", result.matchedCount);
    console.log("Modified:", result.modifiedCount);

    if (result.matchedCount === 0) {
      console.warn("No matching document found.");

      console.timeEnd("UpdateDeploymentStatus");

      return {
        success: false,
        message: "No matching document found",
      };
    }

    console.timeEnd("UpdateDeploymentStatus");

    return {
      success: true,
      message: "Client Deployment Status Updated Successfully",
    };
  } catch (error) {
    console.error("UpdateDeploymentStatus Error:", error);

    console.timeEnd("UpdateDeploymentStatus");

    return {
      success: false,
      message: "Failed to update deployment status",
    };
  }
};
let cache: any = null;
let lastFetchTime = 0;

export const GetAllUsersData = async () => {
  try {
    const now = Date.now();

    // ✅ Simple cache (30 sec)
    if (cache && now - lastFetchTime < 30 * 60 * 1000) {
      return cache;
    }

    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");

    const registrationCollection = db.collection("Registration");
    const fullInfoCollection = db.collection("CompliteRegistrationInformation");
    const deploymentCollection = db.collection("Deployment");
    const replacementCollection = db.collection("Replacement");
    const terminationCollection = db.collection("Termination");
    const PayableCollection = db.collection("PayableINPaymentPage");

    // ✅ Faster decrypt helper (no Object.entries)
    const safeDecrypt = (value: any) => {
      try {
        if (
          value &&
          typeof value === "object" &&
          value.iv &&
          value.content
        ) {
          return decrypt(value);
        }
        return value;
      } catch {
        return value;
      }
    };

    const decryptFields = (obj: any) => {
      for (const key in obj) {
        const value = obj[key];
        if (
          value &&
          typeof value === "object" &&
          value.iv &&
          value.content
        ) {
          try {
            obj[key] = decrypt(value);
          } catch {}
        }
      }
      return obj;
    };

    // ✅ Fetch all collections in parallel (same as before)
    const [
      registrationResult,
      fullInfoResult,
      deploymentResult,
      replacementResult,
      terminationResult,
      PayableData
    ] = await Promise.all([
      registrationCollection.find().toArray(),
      fullInfoCollection.find().toArray(),
      deploymentCollection.find().toArray(),
      replacementCollection.find().toArray(),
      terminationCollection.find().toArray(),
      PayableCollection.find().toArray(),
    ]);

    // ✅ Process in parallel (FASTER)
    const registeredUsersPromise = Promise.resolve(
      registrationResult.map((user: any) => {
        const decryptedUser = decryptFields({ ...user });
        return {
          ...decryptedUser,
          _id: user._id?.toString() ?? null,
        };
      })
    );

    const usersFullInfoPromise = Promise.resolve(
      fullInfoResult.map((user: any) => {
        const info: any = user.HCAComplitInformation || {};

        return {
          ...user,
          _id: user._id.toString(),
          HCAComplitInformation: {
            ...info,
            HCPFirstName: safeDecrypt(info["First Name"]),
            HCPContactNumber: safeDecrypt(info["Mobile Number"]),
            HCPEmail: safeDecrypt(info["EmailId"]),
            HCPSurName: safeDecrypt(info["Surname"]),
            HCPAdharNumber: safeDecrypt(info["Aadhar Card No"]),
            "Phone No 1": safeDecrypt(info["Phone No 1"]),
            "Phone No 2": safeDecrypt(info["Phone No 2"]),
            "Email Id": safeDecrypt(info["Email Id"]),
            "Client Aadhar No": safeDecrypt(info["Client Aadhar No"]),
            "Patient Aadhar Number": safeDecrypt(
              info["Patient Aadhar Number"]
            ),
            "Alternative Client Contact": safeDecrypt(
              info["Alternative Client Contact"]
            ),
          },
        };
      })
    );

    const mapIds = (data: any[]) =>
      data.map((item) => ({
        ...item,
        _id: item._id.toString(),
      }));

    const [
      registeredUsers,
      usersFullInfo,
      placementInfo,
      replacementInfo,
      terminationInfo,
      ExportedPayableData
    ] = await Promise.all([
      registeredUsersPromise,
      usersFullInfoPromise,
      Promise.resolve(mapIds(deploymentResult)),
      Promise.resolve(mapIds(replacementResult)),
      Promise.resolve(mapIds(terminationResult)),
      Promise.resolve(mapIds(PayableData))
    ]);

    const result = {
      RegisterdUsers: registeredUsers,
      usersResult: usersFullInfo,
      placementInfo,
      replacementInfo,
      terminationInfo,
      ExportedPayableData
    };

    // ✅ Save cache
    cache = result;
    lastFetchTime = now;

    return result;
  } catch (err) {
    console.error("Error fetching all data:", err);
    return {
      RegisterdUsers: [],
      usersResult: [],
      placementInfo: [],
      replacementInfo: [],
      terminationInfo: [],
    };
  }
};
export const GetPayableData = async (ImpMonth:any) => {
  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const PayableCollection = db.collection("PayableINPaymentPage");

    const PayableData = await PayableCollection.find({
      Month:ImpMonth
    }).toArray();

    const ExportedPayableData = PayableData.map((item: any) => ({
      ...item,
      _id: item._id.toString(),
    }));

    return {
      ExportedPayableData,
    };
  } catch (err) {
    console.error("Error fetching payable data:", err);

    return {
      ExportedPayableData: [],
    };
  }
};
export const GetReplasmentandTerminationData = async () => {
  try {
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");

    const replacementCollection = db.collection("Replacement");
    const terminationCollection = db.collection("Termination");

    const [replacementResult, terminationResult] = await Promise.all([
      replacementCollection.find({}).toArray(),
      terminationCollection.find({}).toArray(),
    ]);

    const mapIds = (data: any[] = []) =>
      data.map((item) => ({
        ...item,
        _id: item?._id?.toString?.() ?? "",
      }));

    return {
      replacementInfo: mapIds(replacementResult),
      terminationInfo: mapIds(terminationResult),
    };
  } catch (error) {
    console.error("GetReplasmentandTerminationData Error:", error);

    return {
      replacementInfo: [],
      terminationInfo: [],
    };
  }
};
export const UpdateRefundAmount = async (
  Client_Id: string,
  ServiceStartDate: any, 
  RefundAmount: number,
  RefundDate:any,
  RefundDays:any,
  HCAAttendece:any,
  HCAId:any
) => {
  

  try {
   

    const client = await clientPromise;

  

    const db = client.db("CurateInformation");
    const collection = db.collection("Invoices");

    console.log("Query:", {
 Client_Id,
   ServiceStartDate,
    });

    console.time("MongoUpdate");

    const result = await collection.updateOne(
        {
    ClienId: Client_Id,
    $or: [
      { HCA_Id: HCAId },
      { HCAId: HCAId },
    ],
    SeriviceStartDate: ServiceStartDate,
  },
      {
        $set: {
          RefundAmount: RefundAmount,
            RefundDate:RefundDate,
  RefundDays:RefundDays,
  HACAttendeceforRefund:HCAAttendece,
  HCAId:HCAId
        },
      }
    );

    console.timeEnd("MongoUpdate");

    console.log("Matched:", result.matchedCount);
    console.log("Modified:", result.modifiedCount);

    if (result.matchedCount === 0) {
      console.warn("No matching document found.");

      console.timeEnd("UpdateRefundAmount");

      return {
        success: false,
        message: "No matching document found",
      };
    }

    console.timeEnd("UpdateRefundAmount");

    return {
      success: true,
      message: "Refund amount updated successfully",
    };
  } catch (error) {
    console.error("UpdateRefundAmount Error:", error);

    console.timeEnd("UpdateRefundAmount");

    return {
      success: false,
      message: "Failed to update refund amount",
    };
  }
};


const safeDecrypt = (value: any) => {
  try {
    if (
      value &&
      typeof value === "object" &&
      "iv" in value &&
      "content" in value
    ) {
      return decrypt(value);
    }
    return value;
  } catch (err) {
    console.warn("Decryption failed:", err);
    return value;
  }
};

export const ClearProfileCache = (
  userId: string
) => {
  delete profileCache[userId];
};

export const ClearDashboardCache = (
  types: (
    | "registeredUsers"
    | "fullInfo"
    | "deployment"
  )[]
) => {
  types.forEach((type) => {
    switch (type) {
      case "registeredUsers":
        delete globalDashboardCache.registeredUsers;
        delete globalDashboardCache.registeredUsersTime;
        break;

      case "fullInfo":
        delete globalDashboardCache.fullInfo;
        delete globalDashboardCache.fullInfoTime;
        break;

     case "deployment":
  globalDashboardCache.deployment = {};
  break;
    }
  });
};
export const globalDashboardCache: {
  registeredUsers?: any[];
  registeredUsersTime?: number;

  fullInfo?: any[];
  fullInfoTime?: number;

  deployment: Record<
    string,
    {
      data: any[];
      time: number;
    }
  >;
} = {
  deployment: {},
};
const dashboardResponseCache = new Map<
  string,
  {
    timestamp: number;
    data: {
      profile: any;
      registeredUsers: any[];
      fullInfo: any[];
      deployedLength: any[];
    };
  }
>();
export const profileCache: Record<
  string,
  {
    profile?: any;
    profileTime?: number;
  }
> = {};
export const GetDashboardData = async (userId: string, Month: string) => {
  try {
    if (!userId) {
      return {
        success: false,
        message: "UserId is required",
        data: null,
      };
    }

    const CACHE_TIME = 1 * 60 * 1000;
    const now = Date.now();

   
    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");

    const Users = db.collection("Registration");
    const UsersFullInfo = db.collection(
      "CompliteRegistrationInformation"
    );
    const Deployment = db.collection("Deployment");

    if (!profileCache[userId]) {
      profileCache[userId] = {};
    }

    const userProfileCache = profileCache[userId];

    const needsProfile =
      !userProfileCache.profile ||
      now - (userProfileCache.profileTime || 0) >
        CACHE_TIME;

    const needsUsers =
      !globalDashboardCache.registeredUsers ||
      now -
        (globalDashboardCache.registeredUsersTime ||
          0) >
        CACHE_TIME;

    const needsFullInfo =
      !globalDashboardCache.fullInfo ||
      now -
        (globalDashboardCache.fullInfoTime || 0) >
        CACHE_TIME;

  const deploymentCache =
  globalDashboardCache.deployment[Month];

const needsDeployment =
  !deploymentCache ||
  now - deploymentCache.time > CACHE_TIME;

    const [
      profileRaw,
      registeredUsersRaw,
      fullInfoRaw,
      deploymentRaw,
    ] = await Promise.all([
      needsProfile
        ? Users.findOne(
            { userId },
            {
              projection: {
                _id: 0,
                userId: 1,
                FirstName: 1,
                Email: 1,
              },
            }
          )
        : Promise.resolve(null),

    needsUsers
  ? Users.find(
      {},
      {
        projection: {
          _id: 1,
          userId: 1,
          userType: 1,
          Surname: 1,
          FirstName: 1,
          LastName: 1,
          patientName: 1,
          AadharNumber: 1,
          Age: 1,
          Location: 1,
          ServiceArea: 1,
          ServiceState: 1,
          Email: 1,
          ContactNumber: 1,
          VerificationStatus: 1,
          FinelVerification: 1,
          EmailVerification: 1,
          ClientStatus: 1,
          Status: 1,
          CurrentStatus: 1,
          Source: 1,
          NewLead: 1,
          ClientPriority: 1,
          LeadDate: 1,
          PreviewUserType: 1,
          PDRStatus: 1,
          Type: 1,
          Team: 1,
        },
      }
    ).toArray()
  : Promise.resolve(null),
      needsFullInfo
  ? UsersFullInfo.find(
      {},
      {
      projection: {
  _id: 0,

  "HCAComplitInformation.UserId": 1,
  "HCAComplitInformation.First Name": 1,
  "HCAComplitInformation.LastName": 1,
  "HCAComplitInformation.HCPAdharNumber": 1,
   "HCAComplitInformation.Date of Birth": 1,
  "HCAComplitInformation.Age": 1,
  "HCAComplitInformation.userType": 1,
  "HCAComplitInformation.Permanent Address": 1,
  "HCAComplitInformation.HCPEmail": 1,
  "HCAComplitInformation.Mobile Number": 1,
  "HCAComplitInformation.CurrentStatus": 1,
  "HCAComplitInformation.VerificationStatus": 1,
  "HCAComplitInformation.FinelVerification": 1,
  "HCAComplitInformation.EmailVerification": 1,
  "HCAComplitInformation.ClientStatus": 1,
  "HCAComplitInformation.Status": 1,
  "HCAComplitInformation.provider": 1,
  "HCAComplitInformation.payTerms": 1,
  "HCAComplitInformation.PaymentforStaff": 1,
   "HCAComplitInformation.Current Address": 1,
   "HCAComplitInformation.Experience": 1,
   "HCAComplitInformation.MonthlyExpenses": 1,
 


  // Already present in your projection
  "HCAComplitInformation.ApprovedBy": 1,
  "HCAComplitInformation.Gender": 1,
  "HCAComplitInformation.Surname": 1,
  "HCAComplitInformation.PermanentState": 1,
   "HCAComplitInformation.Aadhar Card No": 1,
 
}
      }
    ).toArray()
  : Promise.resolve(null),

     needsDeployment
  ? Deployment.find(
      { Month },
      {
        projection: {
          _id: 0,
        },
      }
    ).toArray()
  : Promise.resolve(
      deploymentCache.data
    ),
    ]);

    if (needsProfile) {
      userProfileCache.profile =
        profileRaw &&
        Object.fromEntries(
          Object.entries(profileRaw).map(
            ([key, value]) => [
              key,
              safeDecrypt(value),
            ]
          )
        );

      userProfileCache.profileTime = now;
    }

    if (needsUsers && registeredUsersRaw) {
      globalDashboardCache.registeredUsers =
        registeredUsersRaw.map((user: any) => {
          const decryptedUser: any = {
            ...user,
            _id: user._id?.toString() ?? null,
          };

          for (const [
            key,
            value,
          ] of Object.entries(user)) {
            if (
              value &&
              typeof value === "object" &&
              "iv" in value &&
              "content" in value
            ) {
              try {
                decryptedUser[key] = decrypt(
                  value as {
                    iv: string;
                    content: string;
                  }
                );
              } catch {
                decryptedUser[key] = value;
              }
            }
          }

          return decryptedUser;
        });

      globalDashboardCache.registeredUsersTime =
        now;
    }
console.log("Current Task",fullInfoRaw)
    if (needsFullInfo && fullInfoRaw) {
      globalDashboardCache.fullInfo =
        fullInfoRaw.map((user: any) => {
          const info =
            user.HCAComplitInformation || {};
;
return {
  ...user,
  HCAComplitInformation: {
    UserId: info.UserId,

    HCPFirstName: safeDecrypt(info["First Name"]),
    HCPSurName: safeDecrypt(info.Surname),

    LastName: info.LastName,
    HCPAdharNumber: safeDecrypt(info["Aadhar Card No"]),
    DateOfBirth: info["Date of Birth"],
    Age: safeDecrypt(info.Age),
    userType: info.userType,

    PermanentAddress: safeDecrypt(info["Permanent Address"]),
    HCPEmail: safeDecrypt(info.HCPEmail),
    HCPContactNumber: safeDecrypt(info["Mobile Number"]),
MonthlyExpenses: info.MonthlyExpenses,
    CurrentStatus: info.CurrentStatus||"Leave",
    CurrentAddress: info["Current Address"],
    VerificationStatus: info.VerificationStatus,
    FinelVerification: info.FinelVerification,
    EmailVerification: info.EmailVerification,
    ClientStatus: info.ClientStatus,
    Status: info.Status,
    Experience: info.Experience,

    Provider: info.provider,
    PayTerms: info.payTerms,
    PaymentforStaff: info.PaymentforStaff,
    ApprovedBy: info.ApprovedBy,

    Gender: info.Gender,
    PermanentState: info.PermanentState,
  },
};
        });

      globalDashboardCache.fullInfoTime = now;
    }
if (needsDeployment && deploymentRaw) {
  globalDashboardCache.deployment[Month] = {
    data: deploymentRaw,
    time: now,
  };
}

    const responseData = {
      profile:
        userProfileCache.profile || null,

      registeredUsers:
        globalDashboardCache
          .registeredUsers || [],

      fullInfo:
        globalDashboardCache.fullInfo || [],

    deployedLength:
  globalDashboardCache.deployment[Month]
    ?.data || [],
    };
console.groupCollapsed("Dashboard Data Response",responseData.fullInfo);
    dashboardResponseCache.set(userId, {
      timestamp: now,
      data: responseData,
    });

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    console.error(
      "Dashboard Fetch Error:",
      error
    );

    return {
      success: false,
      message:
        "Failed to fetch dashboard data",
      data: null,
    };
  }
};
export const UpdateClientTeam = async (
  ImpClientId: any,
  ImpTeamValue: any
) => {
  try {
    const cluster = await clientPromise
    const db = cluster.db("CurateInformation")
    const collection = db.collection("Registration")


    const result = await collection.updateMany(
      {userId: ImpClientId},
      {
        $set: {
          Team:ImpTeamValue
        }
      },
      {
        upsert: true   
      }
    )

    return {
      success: true,
      message:
        result.upsertedCount > 0
          ? "New Team Created"
          : result.modifiedCount === 0
          ? "No changes made"
          : "Client Team updated Successfully"
    }
  } catch (e) {
    console.error("UpdateClientTimeSheet Error:", e)
    return {
      success: false,
      message: "Update failed"
    }
  }
}
// 
// export const GetDashboardData = async (
//   userId: string
// ) => {
//   try {
//     if (!userId) {
//       return {
//         success: false,
//         message: "UserId is required",
//         data: null,
//       };
//     }

//     const CACHE_TIME = 7 * 60 * 1000;
//     const now = Date.now();

//     const cluster = await clientPromise;
//     const db = cluster.db("CurateInformation");

//     const Users = db.collection("Registration");
//     const UsersFullInfo = db.collection(
//       "CompliteRegistrationInformation"
//     );
//     const Deployment = db.collection("Deployment");

//     // ==========================
//     // PROFILE CACHE (PER USER)
//     // ==========================

//     if (!profileCache[userId]) {
//       profileCache[userId] = {};
//     }

//     const userProfileCache =
//       profileCache[userId];

//     let profile = userProfileCache.profile;

//     const needsProfile =
//       !profile ||
//       now -
//         (userProfileCache.profileTime || 0) >
//         CACHE_TIME;

//     if (needsProfile) {
//       const profileRaw = await Users.findOne(
//         { userId },
//         {
//           projection: {
//             _id: 0,
//             userId: 1,
//             FirstName: 1,
//             Email: 1,
//           },
//         }
//       );

//       profile =
//         profileRaw &&
//         Object.fromEntries(
//           Object.entries(profileRaw).map(
//             ([key, value]) => [
//               key,
//               safeDecrypt(value),
//             ]
//           )
//         );

//       userProfileCache.profile = profile;
//       userProfileCache.profileTime = now;
//     }

//     // ==========================
//     // GLOBAL CACHE CHECKS
//     // ==========================

//     const needsUsers =
//       !globalDashboardCache.registeredUsers ||
//       now -
//         (globalDashboardCache.registeredUsersTime ||
//           0) >
//         CACHE_TIME;

//     const needsFullInfo =
//       !globalDashboardCache.fullInfo ||
//       now -
//         (globalDashboardCache.fullInfoTime || 0) >
//         CACHE_TIME;

//     const needsDeployment =
//       !globalDashboardCache.deployment ||
//       now -
//         (globalDashboardCache.deploymentTime ||
//           0) >
//         CACHE_TIME;

//     const [
//       registeredUsersRaw,
//       fullInfoRaw,
//       deploymentRaw,
//     ] = await Promise.all([
//       needsUsers
//         ? Users.find({}).toArray()
//         : Promise.resolve(null),

//       needsFullInfo
//         ? UsersFullInfo.find({}).toArray()
//         : Promise.resolve(null),

//       needsDeployment
//         ? Deployment.find(
//             {},
//             {
//               projection: {
//                 _id: 0,
//               },
//             }
//           ).toArray()
//         : Promise.resolve(null),
//     ]);

  

//     if (needsUsers && registeredUsersRaw) {
//       globalDashboardCache.registeredUsers =
//         registeredUsersRaw.map((user: any) => {
//           const decryptedUser: any = {
//             ...user,
//             _id: user._id?.toString() ?? null,
//           };

//           for (const [
//             key,
//             value,
//           ] of Object.entries(user)) {
//             if (
//               value &&
//               typeof value === "object" &&
//               "iv" in value &&
//               "content" in value
//             ) {
//               try {
//                 decryptedUser[key] = decrypt(
//                   value as {
//                     iv: string;
//                     content: string;
//                   }
//                 );
//               } catch {
//                 decryptedUser[key] = value;
//               }
//             }
//           }

//           return decryptedUser;
//         });

//       globalDashboardCache.registeredUsersTime =
//         now;
//     }

//     // ==========================
//     // FULL INFO
//     // ==========================

//     if (needsFullInfo && fullInfoRaw) {
//       globalDashboardCache.fullInfo =
//         fullInfoRaw.map((user: any) => {
//           const info =
//             user.HCAComplitInformation || {};

//           return {
//             ...user,
//             HCAComplitInformation: {
//               ...info,
//               HCPFirstName: safeDecrypt(
//                 info["First Name"]
//               ),
//               HCPContactNumber: safeDecrypt(
//                 info["Mobile Number"]
//               ),
//               HCPEmail: safeDecrypt(
//                 info["EmailId"]
//               ),
//               HCPSurName: safeDecrypt(
//                 info["Surname"]
//               ),
//               HCPAdharNumber: safeDecrypt(
//                 info["Aadhar Card No"]
//               ),
//               "Phone No 1": safeDecrypt(
//                 info["Phone No 1"]
//               ),
//               "Phone No 2": safeDecrypt(
//                 info["Phone No 2"]
//               ),
//               "Email Id": safeDecrypt(
//                 info["Email Id"]
//               ),
//               "Client Aadhar No": safeDecrypt(
//                 info["Client Aadhar No"]
//               ),
//               "Patient Aadhar Number":
//                 safeDecrypt(
//                   info[
//                     "Patient Aadhar Number"
//                   ]
//                 ),
//               "Alternative Client Contact":
//                 safeDecrypt(
//                   info[
//                     "Alternative Client Contact"
//                   ]
//                 ),
//             },
//           };
//         });

//       globalDashboardCache.fullInfoTime = now;
//     }

//     // ==========================
//     // DEPLOYMENT
//     // ==========================

//     if (
//       needsDeployment &&
//       deploymentRaw
//     ) {
//       globalDashboardCache.deployment =
//         deploymentRaw;

//       globalDashboardCache.deploymentTime =
//         now;
//     }

//     return {
//       success: true,
//       data: {
//         profile: profile || null,

//         registeredUsers:
//           globalDashboardCache
//             .registeredUsers || [],

//         fullInfo:
//           globalDashboardCache.fullInfo || [],

//         deployedLength:
//           globalDashboardCache.deployment ||
//           [],
//       },
//     };
//   } catch (error) {
//     console.error(
//       "Dashboard Fetch Error:",
//       error
//     );

//     return {
//       success: false,
//       message:
//         "Failed to fetch dashboard data",
//       data: null,
//     };
//   }
// };



type QualityRole =
  | "Role 1"
  | "Role 2"
  | "Role 3"
  | "Random HCA Call"
  | "Termination";

interface QualityFeedback {
  UserId: string;
  Role: QualityRole;
  SectionId: string;
  Type?: string;

  Month?: string;

  answers?: Record<string, string>;
  recordings?: Record<string, any>;
  Recording?: string | null;

  completedAt?: string;
}

const MONTHLY_ROLES: QualityRole[] = [
  "Role 1",
  "Role 3",
  "Random HCA Call",
];

const LIFETIME_ROLES: QualityRole[] = [
  "Role 2",
  "Termination",
];

export const InsertQualityInfo = async (
  ImportedInfo: QualityFeedback
) => {
  try {
    if (!ImportedInfo) {
      return {
        success: false,
        error: "Quality information is required",
      };
    }

    const UserId = String(
      ImportedInfo.UserId || ""
    ).trim();

    const Role = ImportedInfo.Role;

    const SectionId = String(
      ImportedInfo.SectionId || ""
    ).trim();

    if (!UserId) {
      return {
        success: false,
        error: "UserId is required",
      };
    }

    if (!Role) {
      return {
        success: false,
        error: "Role is required",
      };
    }

    if (!SectionId) {
      return {
        success: false,
        error: "SectionId is required",
      };
    }

    if (!ImportedInfo.answers) {
      return {
        success: false,
        error: "Answers are required",
      };
    }

    const client = await clientPromise;

    const db = client.db("CurateInformation");

    const Qualitycollection =
      db.collection("Quality");

    const completedAt =
      ImportedInfo.completedAt
        ? new Date(ImportedInfo.completedAt)
        : new Date();

    if (Number.isNaN(completedAt.getTime())) {
      return {
        success: false,
        error: "Invalid completedAt date",
      };
    }

    /*
     * =====================================================
     * ROLE 2
     *
     * ONCE IN LIFETIME
     *
     * UserId + Role
     * =====================================================
     */

    if (LIFETIME_ROLES.includes(Role)) {
      const existing =
        await Qualitycollection.findOne({
          UserId,
          Role,
        });

      if (existing) {
        return {
          success: false,
          alreadyCompleted: true,
          error:
            "This feedback has already been completed.",
          data: existing,
        };
      }
    }

    /*
     * =====================================================
     * MONTHLY ROLES
     *
     * Role 1
     * Role 3
     * Random HCA Call
     *
     * 30 DAYS FROM completedAt
     * =====================================================
     */

    if (MONTHLY_ROLES.includes(Role)) {
      const existing =
        await Qualitycollection
          .find({
            UserId,
            Role,
          })
          .sort({
            completedAt: -1,
          })
          .limit(1)
          .next();

      if (existing?.completedAt) {
        const lastCompletedAt =
          new Date(existing.completedAt);

        const nextAvailableDate =
          new Date(lastCompletedAt);

        nextAvailableDate.setDate(
          nextAvailableDate.getDate() + 30
        );

        const now = new Date();

        if (
          now < nextAvailableDate
        ) {
          const millisecondsRemaining =
            nextAvailableDate.getTime() -
            now.getTime();

          const daysRemaining = Math.ceil(
            millisecondsRemaining /
              (1000 * 60 * 60 * 24)
          );

          return {
            success: false,
            alreadyCompleted: true,
            locked: true,
            error:
              "This feedback is not available yet.",
            lastCompletedAt,
            nextAvailableDate,
            daysRemaining,
            data: existing,
          };
        }
      }
    }

    /*
     * =====================================================
     * PREPARE DOCUMENT
     * =====================================================
     */

    const QualityDocument = {
      ...ImportedInfo,

      UserId,

      Role,

      SectionId,

      Type:
        ImportedInfo.Type || "HCA",

      completedAt,

      createdAt: new Date(),

      updatedAt: new Date(),
    };

    /*
     * =====================================================
     * INSERT
     * =====================================================
     */

    const PostData =
      await Qualitycollection.insertOne(
        QualityDocument
      );

    if (!PostData.acknowledged) {
      return {
        success: false,
        error:
          "Failed to insert Quality information",
      };
    }

    return {
      success: true,

      insertedId:
        PostData.insertedId,

      Role,

      SectionId,

      completedAt,

      message:
        "Quality information saved successfully.",
    };

  } catch (error: any) {

    console.error(
      "InsertQualityInfo Error:",
      error
    );

    return {
      success: false,
      error:
        "Unable to insert Quality information",
    };
  }
};


export const GetQualityInfo = async () => {
  try {
    const client = await clientPromise;

    const db =
      client.db("CurateInformation");

    const Qualitycollection =
      db.collection("Quality");

    const QualityData =
      await Qualitycollection
        .find(
          {},
          {
            projection: {
              _id: 1,

              UserId: 1,

              Role: 1,

              SectionId: 1,

              Type: 1,

              Month: 1,

              completedAt: 1,

              createdAt: 1,

              updatedAt: 1,

              answers: 1,

              recordings: 1,

              Recording: 1,
            },
          }
        )
        .sort({
          completedAt: -1,
        })
        .toArray();

    return {
      success: true,
      data: QualityData,
    };

  } catch (error) {

    console.error(
      "GetQualityInfo Error:",
      error
    );

    return {
      success: false,
      data: [],
      error:
        "Unable to get Quality information",
    };
  }
};


export const GetQualityStatus = async (
  UserId: string
) => {
  try {
    if (!UserId) {
      return {
        success: false,
        error: "UserId is required",
      };
    }

    const client = await clientPromise;

    const db =
      client.db("CurateInformation");

    const Qualitycollection =
      db.collection("Quality");

    const records =
      await Qualitycollection
        .find({
          UserId: String(UserId),
        })
        .sort({
          completedAt: -1,
        })
        .toArray();

    const now = new Date();

    /*
     * =====================================================
     * ROLE 2
     * LIFETIME
     * =====================================================
     */

    const role2 =
      records.find(
        (item: any) =>
          item.Role === "Role 2"
      );

    const role2Status = role2
      ? {
          status: "Completed",
          lastCompletedAt:
            role2.completedAt,
          data: role2,
        }
      : {
          status: "Available",
          lastCompletedAt: null,
          data: null,
        };

    /*
     * =====================================================
     * MONTHLY ROLES
     * =====================================================
     */

    const getMonthlyStatus = (
      role: string
    ) => {

      const latest =
        records.find(
          (item: any) =>
            item.Role === role
        );

      if (!latest) {
        return {
          status: "Available",
          lastCompletedAt: null,
          nextAvailableDate: null,
          daysRemaining: 0,
          data: null,
        };
      }

      const lastCompletedAt =
        new Date(
          latest.completedAt
        );

      const nextAvailableDate =
        new Date(lastCompletedAt);

      nextAvailableDate.setDate(
        nextAvailableDate.getDate() +
          30
      );

      if (
        now >=
        nextAvailableDate
      ) {
        return {
          status: "Available",
          lastCompletedAt,
          nextAvailableDate,
          daysRemaining: 0,
          data: latest,
        };
      }

      const remaining =
        Math.ceil(
          (
            nextAvailableDate.getTime() -
            now.getTime()
          ) /
            (1000 * 60 * 60 * 24)
        );

      return {
        status: "Locked",
        lastCompletedAt,
        nextAvailableDate,
        daysRemaining: remaining,
        data: latest,
      };
    };

    return {
      success: true,

      UserId: String(UserId),

      Role1:
        getMonthlyStatus("Role 1"),

      Role2:
        role2Status,

      Role3:
        getMonthlyStatus("Role 3"),

      RandomHCA:
        getMonthlyStatus(
          "Random HCA Call"
        ),

      Termination:
        records.find(
          (item: any) =>
            item.Role ===
            "Termination"
        ) || null,

      records,
    };

  } catch (error) {

    console.error(
      "GetQualityStatus Error:",
      error
    );

    return {
      success: false,
      error:
        "Unable to get Quality status",
    };
  }
};

export const InsertGoogleReview = async (
  ImportedInfo: any
) => {
  try {
    // Validate input
    if (
      !ImportedInfo ||
      typeof ImportedInfo !== "object" ||
      Array.isArray(ImportedInfo)
    ) {
      return {
        success: false,
        error: "Valid Google Review information is required",
      };
    }

    const client = await clientPromise;

    const db = client.db("CurateInformation");

    const GoogleReviewCollection =
      db.collection("GoogleReview");

    const result =
      await GoogleReviewCollection.insertOne(ImportedInfo);

    if (!result.acknowledged) {
      console.error(
        "InsertGoogleReview: MongoDB insert was not acknowledged"
      );

      return {
        success: false,
        error: "Unable to save Google Review information",
      };
    }

    return {
      success: true,
      message: "Google Review inserted successfully",
      insertedId: result.insertedId.toString(),
    };
  } catch (error) {
    console.error(
      "InsertGoogleReview Error:",
      error
    );

    return {
      success: false,
      error: "Unable to insert Google Review information",
    };
  }
};

export const GetGoogleReview = async (
  ImportedMonth: string
) => {
  try {
    // Validate month
    if (
      !ImportedMonth ||
      typeof ImportedMonth !== "string"
    ) {
      return {
        success: false,
        error: "Valid month is required",
        data: [],
      };
    }

    const client = await clientPromise;

    const db = client.db("CurateInformation");

    const GoogleReviewCollection =
      db.collection("GoogleReview");

    const result =
      await GoogleReviewCollection
        .find({
          Month: ImportedMonth.trim(),
        })
        .sort({
          CreatedAt: -1,
        })
        .toArray();

    return {
      success: true,
      message: "Google Reviews fetched successfully",
      data: result,
      count: result.length,
    };
  } catch (error) {
    console.error(
      "GetGoogleReview Error:",
      error
    );

    return {
      success: false,
      error: "Unable to fetch Google Review information",
      data: [],
    };
  }
};


;

export const InsertClietFeedBackInfo = async (
  ImportedInfo: Record<string, unknown>
) => {
  try {
  
    if (
      !ImportedInfo ||
      typeof ImportedInfo !== "object" ||
      Array.isArray(ImportedInfo)
    ) {
      return {
        success: false,
        error: "Valid client feedback information is required",
      };
    }

    const client = await clientPromise;

    const db = client.db("CurateInformation");

    const ClientFeedBackCollection =
      db.collection("ClientFeedBack");

    const feedbackDocument = {
      ...ImportedInfo,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await ClientFeedBackCollection.insertOne(
      feedbackDocument
    );

    if (!result.acknowledged) {
      return {
        success: false,
        error: "Client feedback could not be inserted",
      };
    }

    return {
      success: true,
      message: "Client feedback inserted successfully",
      insertedId: result.insertedId.toString(),
    };
  } catch (error: unknown) {
    console.error("InsertClietFeedBackInfo Error:", error);

    return {
      success: false,
      error: "Unable to insert client feedback information",
    };
  }
};


export const GetClietFeedBackInfo = async (ImpMonth: string) => {
  try {
    const client = await clientPromise;

    const db = client.db("CurateInformation");

    const ClientFeedBackCollection =
      db.collection("ClientFeedBack");

    const result = await ClientFeedBackCollection
      .find(
        {
          Month: ImpMonth,
        }
      )
      .toArray();

    return {
      success: true,
      message: "Client feedback information fetched successfully",
      data: result,
      count: result.length,
    };
  } catch (error: unknown) {
    console.error("GetClietFeedBackInfo Error:", error);

    return {
      success: false,
      error: "Unable to fetch client feedback information",
      data: [],
      count: 0,
    };
  }
};