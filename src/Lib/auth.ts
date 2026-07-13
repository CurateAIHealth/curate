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
export const GetPayableData = async () => {
  try {
    const now = Date.now();
    if (cache && now - lastFetchTime < 30 * 60 * 1000) {
      return cache;
    }

    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
    const PayableCollection = db.collection("PayableINPaymentPage");

const [
     PayableData
    ] = await Promise.all([
    
      PayableCollection.find().toArray(),
    ]);
const mapIds = (data: any[]) =>
      data.map((item) => ({
        ...item,
        _id: item._id.toString(),
      }));

    const [
      ExportedPayableData
    ] = await Promise.all([
     
      Promise.resolve(mapIds(PayableData))
    ]);

    const result = {
      ExportedPayableData
    };

   
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
export const GetReplasmentandTerminationData = async () => {
  try {
    const now = Date.now();
    if (cache && now - lastFetchTime < 30 * 60 * 1000) {
      return cache;
    }
const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");
const replacementCollection = db.collection("Replacement");
    const terminationCollection = db.collection("Termination");
const [
     replacementResult,
      terminationResult,
] = await Promise.all([
   
      replacementCollection.find().toArray(),
      terminationCollection.find().toArray(),
  
    ]);



   

    const mapIds = (data: any[]) =>
      data.map((item) => ({
        ...item,
        _id: item._id.toString(),
      }));

    const [
  
      replacementInfo,
      terminationInfo,

    ] = await Promise.all([
   

      Promise.resolve(mapIds(replacementResult)),
      Promise.resolve(mapIds(terminationResult)),
    
    ]);

    const result = {
    
      replacementInfo,
      terminationInfo,
     
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
export const UpdateRefundAmount = async (
  Client_Id: string,
  ServiceStartDate: any, 
  RefundAmount: number
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
        SeriviceStartDate: ServiceStartDate,
      },
      {
        $set: {
          RefundAmount: RefundAmount,
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
        delete globalDashboardCache.deployment;
        delete globalDashboardCache.deploymentTime;
        break;
    }
  });
};
export const globalDashboardCache: {
  registeredUsers?: any[];
  registeredUsersTime?: number;

  fullInfo?: any[];
  fullInfoTime?: number;

  deployment?: any[];
  deploymentTime?: number;
} = {};

export const profileCache: Record<
  string,
  {
    profile?: any;
    profileTime?: number;
  }
> = {};

export const GetDashboardData = async (
  userId: string
) => {
  try {
    if (!userId) {
      return {
        success: false,
        message: "UserId is required",
        data: null,
      };
    }

    const CACHE_TIME = 30 * 60 * 1000;
    const now = Date.now();

    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");

    const Users = db.collection("Registration");
    const UsersFullInfo = db.collection(
      "CompliteRegistrationInformation"
    );
    const Deployment = db.collection("Deployment");

    // ==========================
    // PROFILE CACHE (PER USER)
    // ==========================

    if (!profileCache[userId]) {
      profileCache[userId] = {};
    }

    const userProfileCache =
      profileCache[userId];

    let profile = userProfileCache.profile;

    const needsProfile =
      !profile ||
      now -
        (userProfileCache.profileTime || 0) >
        CACHE_TIME;

    if (needsProfile) {
      const profileRaw = await Users.findOne(
        { userId },
        {
          projection: {
            _id: 0,
            userId: 1,
            FirstName: 1,
            Email: 1,
          },
        }
      );

      profile =
        profileRaw &&
        Object.fromEntries(
          Object.entries(profileRaw).map(
            ([key, value]) => [
              key,
              safeDecrypt(value),
            ]
          )
        );

      userProfileCache.profile = profile;
      userProfileCache.profileTime = now;
    }

    // ==========================
    // GLOBAL CACHE CHECKS
    // ==========================

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

    const needsDeployment =
      !globalDashboardCache.deployment ||
      now -
        (globalDashboardCache.deploymentTime ||
          0) >
        CACHE_TIME;

    const [
      registeredUsersRaw,
      fullInfoRaw,
      deploymentRaw,
    ] = await Promise.all([
      needsUsers
        ? Users.find({}).toArray()
        : Promise.resolve(null),

      needsFullInfo
        ? UsersFullInfo.find({}).toArray()
        : Promise.resolve(null),

      needsDeployment
        ? Deployment.find(
            {},
            {
              projection: {
                _id: 0,
              },
            }
          ).toArray()
        : Promise.resolve(null),
    ]);

  

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

    // ==========================
    // FULL INFO
    // ==========================

    if (needsFullInfo && fullInfoRaw) {
      globalDashboardCache.fullInfo =
        fullInfoRaw.map((user: any) => {
          const info =
            user.HCAComplitInformation || {};

          return {
            ...user,
            HCAComplitInformation: {
              ...info,
              HCPFirstName: safeDecrypt(
                info["First Name"]
              ),
              HCPContactNumber: safeDecrypt(
                info["Mobile Number"]
              ),
              HCPEmail: safeDecrypt(
                info["EmailId"]
              ),
              HCPSurName: safeDecrypt(
                info["Surname"]
              ),
              HCPAdharNumber: safeDecrypt(
                info["Aadhar Card No"]
              ),
              "Phone No 1": safeDecrypt(
                info["Phone No 1"]
              ),
              "Phone No 2": safeDecrypt(
                info["Phone No 2"]
              ),
              "Email Id": safeDecrypt(
                info["Email Id"]
              ),
              "Client Aadhar No": safeDecrypt(
                info["Client Aadhar No"]
              ),
              "Patient Aadhar Number":
                safeDecrypt(
                  info[
                    "Patient Aadhar Number"
                  ]
                ),
              "Alternative Client Contact":
                safeDecrypt(
                  info[
                    "Alternative Client Contact"
                  ]
                ),
            },
          };
        });

      globalDashboardCache.fullInfoTime = now;
    }

    // ==========================
    // DEPLOYMENT
    // ==========================

    if (
      needsDeployment &&
      deploymentRaw
    ) {
      globalDashboardCache.deployment =
        deploymentRaw;

      globalDashboardCache.deploymentTime =
        now;
    }

    return {
      success: true,
      data: {
        profile: profile || null,

        registeredUsers:
          globalDashboardCache
            .registeredUsers || [],

        fullInfo:
          globalDashboardCache.fullInfo || [],

        deployedLength:
          globalDashboardCache.deployment ||
          [],
      },
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