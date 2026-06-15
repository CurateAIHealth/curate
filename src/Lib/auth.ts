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
export const ClearDashboardCache = (
  userId: string,
  types: (
    | "profile"
    | "registeredUsers"
    | "fullInfo"
    | "deployment"
  )[]
) => {
  if (!dashboardCache[userId]) return;

  types.forEach((type) => {
    switch (type) {
      case "profile":
        delete dashboardCache[userId].profile;
        delete dashboardCache[userId].profileTime;
        break;

      case "registeredUsers":
        delete dashboardCache[userId].registeredUsers;
        delete dashboardCache[userId].registeredUsersTime;
        break;

      case "fullInfo":
        delete dashboardCache[userId].fullInfo;
        delete dashboardCache[userId].fullInfoTime;
        break;

      case "deployment":
        delete dashboardCache[userId].deployment;
        delete dashboardCache[userId].deploymentTime;
        break;
    }
  });
};

let dashboardCache: Record<
  string,
  {
    profile?: any;
    profileTime?: number;

    registeredUsers?: any[];
    registeredUsersTime?: number;

    fullInfo?: any[];
    fullInfoTime?: number;

    deployment?: any[];
    deploymentTime?: number;
  }
> = {};
export const GetDashboardData = async (userId: string) => {
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

    if (!dashboardCache[userId]) {
      dashboardCache[userId] = {};
    }

    const cache = dashboardCache[userId];

    const cluster = await clientPromise;
    const db = cluster.db("CurateInformation");

    const Users = db.collection("Registration");
    const UsersFullInfo = db.collection("CompliteRegistrationInformation");
    const Deployment = db.collection("Deployment");

    let profile = cache.profile;

    if (
      !profile ||
      now - (cache.profileTime || 0) > CACHE_TIME
    ) {
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
          Object.entries(profileRaw).map(([key, value]) => [
            key,
            safeDecrypt(value),
          ])
        );

      cache.profile = profile;
      cache.profileTime = now;
    }

    let safeUsers = cache.registeredUsers;

    if (
      !safeUsers ||
      now - (cache.registeredUsersTime || 0) > CACHE_TIME
    ) {
      const registeredUsersRaw = await Users.find({}).toArray();

      safeUsers = registeredUsersRaw.map((user: any) => {
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

      cache.registeredUsers = safeUsers;
      cache.registeredUsersTime = now;
    }

    let fullInfo = cache.fullInfo;

    if (
      !fullInfo ||
      now - (cache.fullInfoTime || 0) > CACHE_TIME
    ) {
      const fullInfoRaw = await UsersFullInfo.find(
        {},
        {
          projection: {
            _id: 0,
          },
        }
      ).toArray();

      fullInfo = fullInfoRaw.map((user: any) => {
        const info = user.HCAComplitInformation || {};

        return {
          ...user,
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
      });

      cache.fullInfo = fullInfo;
      cache.fullInfoTime = now;
    }

    let deploymentData = cache.deployment;

    if (
      !deploymentData ||
      now - (cache.deploymentTime || 0) > CACHE_TIME
    ) {
      deploymentData = await Deployment.find(
        {},
        {
          projection: {
            _id: 0,
          },
        }
      ).toArray();

      cache.deployment = deploymentData;
      cache.deploymentTime = now;
    }

    return {
      success: true,
      data: {
        profile: profile || null,
        registeredUsers: safeUsers || [],
        fullInfo: fullInfo || [],
        deployedLength: deploymentData || [],
      },
    };
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);

    return {
      success: false,
      message: "Failed to fetch dashboard data",
      data: null,
    };
  }
};