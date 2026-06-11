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
    now - applicationCacheTime < 300000
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




