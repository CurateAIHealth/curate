
import clientPromise from "@/Lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

interface RosterEntry {
  Date: string;
  Day: string;
  StaffId: string;
  StaffName: string;
  ServiceState: string;
  CompOffDate: string;
}

interface HolidayRosterDocument {
  Month: number;
  Year: number;
  Entries: RosterEntry[];
  Revision: number;
  CreatedAt: Date;
  UpdatedAt: Date;
  UpdatedBy: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  entries?: RosterEntry[];
  revision?: number;
  exists?: boolean;
  month?: number;
  year?: number;
  updatedAt?: Date | null;
  updatedBy?: string | null;
  code?: string;
}

const getCollection = async () => {
  const cluster = await clientPromise;
  const db = cluster.db("CurateInformation");

  const collection = db.collection<HolidayRosterDocument>(
    "HolidyRoaster"
  );

  await collection.createIndex(
    { Year: 1, Month: 1 },
    {
      unique: true,
      name: "unique_holiday_roster_month_year",
    }
  );

  return collection;
};

function isValidDate(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function getDayName(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day))
    .toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "UTC",
    });
}

function validateEntries(
  month: number,
  year: number,
  rawEntries: unknown
):
  | { valid: true; entries: RosterEntry[] }
  | { valid: false; message: string } {

  if (!Array.isArray(rawEntries) || rawEntries.length === 0) {
    return {
      valid: false,
      message: "At least one roster entry is required.",
    };
  }

  if (rawEntries.length > 100) {
    return {
      valid: false,
      message: "Maximum 100 roster entries allowed.",
    };
  }

  const entries: RosterEntry[] = [];

  for (let index = 0; index < rawEntries.length; index++) {
    const item = rawEntries[index] as Partial<RosterEntry>;

    if (!item || typeof item !== "object") {
      return {
        valid: false,
        message: `Invalid entry at row ${index + 1}.`,
      };
    }

    const dutyDate = item.Date;
    const compOffDate = item.CompOffDate;

    const staffId =
      typeof item.StaffId === "string"
        ? item.StaffId.trim()
        : "";

    const staffName =
      typeof item.StaffName === "string"
        ? item.StaffName.trim()
        : "";

    const serviceState =
      typeof item.ServiceState === "string"
        ? item.ServiceState.trim()
        : "Telangana";

    if (!isValidDate(dutyDate)) {
      return {
        valid: false,
        message: `Invalid duty date at row ${index + 1}.`,
      };
    }

    const [dutyYear, dutyMonth] = dutyDate
      .split("-")
      .map(Number);

    if (dutyYear !== year || dutyMonth !== month) {
      return {
        valid: false,
        message: `Duty date at row ${index + 1} must belong to the selected month.`,
      };
    }

    if (!staffId || !staffName) {
      return {
        valid: false,
        message: `Staff details are required at row ${index + 1}.`,
      };
    }

    if (!isValidDate(compOffDate)) {
      return {
        valid: false,
        message: `Invalid Comp-off date at row ${index + 1}.`,
      };
    }

    entries.push({
      Date: dutyDate,
      Day: getDayName(dutyDate),
      StaffId: staffId,
      StaffName: staffName,
      ServiceState: serviceState || "Telangana",
      CompOffDate: compOffDate,
    });
  }

  // Prevent duplicate duty dates.
  const dutyDates = entries.map((entry) => entry.Date);

  if (new Set(dutyDates).size !== dutyDates.length) {
    return {
      valid: false,
      message: "Duplicate duty dates are not allowed.",
    };
  }

  // Prevent duplicate Comp-off dates.
  const compOffDates = entries.map(
    (entry) => entry.CompOffDate
  );

  if (new Set(compOffDates).size !== compOffDates.length) {
    return {
      valid: false,
      message: "Duplicate Comp-off dates are not allowed.",
    };
  }

  // Comp-off date cannot overlap with a duty date.
  const dutyDateSet = new Set(dutyDates);

  if (compOffDates.some((date) => dutyDateSet.has(date))) {
    return {
      valid: false,
      message: "Comp-off date cannot overlap with a duty date.",
    };
  }

  return {
    valid: true,
    entries,
  };
}

export default async function HolidayRosterHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    // GET: Load monthly roster.
    if (req.method === "GET") {
      const month = Number(req.query.month);
      const year = Number(req.query.year);

      if (
        !Number.isInteger(month) ||
        month < 1 ||
        month > 12 ||
        !Number.isInteger(year) ||
        year < 2000 ||
        year > 2100
      ) {
        return res.status(400).json({
          success: false,
          message: "Valid month and year are required.",
        });
      }

      const collection = await getCollection();

      const roster = await collection.findOne(
        { Month: month, Year: year },
        {
          projection: {
            _id: 0,
            Month: 1,
            Year: 1,
            Entries: 1,
            Revision: 1,
            UpdatedAt: 1,
            UpdatedBy: 1,
          },
        }
      );

      // Older records without ServiceState remain supported.
      const entries = (roster?.Entries ?? []).map((entry) => ({
        ...entry,
        ServiceState: entry.ServiceState || "Telangana",
      }));

      return res.status(200).json({
        success: true,
        exists: Boolean(roster),
        month,
        year,
        entries,
        revision: roster?.Revision ?? 0,
        updatedAt: roster?.UpdatedAt ?? null,
        updatedBy: roster?.UpdatedBy ?? null,
      });
    }

    // POST: Create or update monthly roster.
    if (req.method === "POST") {
      const {
        month: rawMonth,
        year: rawYear,
        entries: rawEntries,
        revision: rawRevision,
        updatedBy: rawUpdatedBy,
      } = req.body ?? {};

      const month = Number(rawMonth);
      const year = Number(rawYear);
      const revision = Number(rawRevision);

      const updatedBy =
        typeof rawUpdatedBy === "string"
          ? rawUpdatedBy.trim()
          : "";

      if (
        !Number.isInteger(month) ||
        month < 1 ||
        month > 12 ||
        !Number.isInteger(year) ||
        year < 2000 ||
        year > 2100
      ) {
        return res.status(400).json({
          success: false,
          message: "Valid month and year are required.",
        });
      }

      if (!Number.isInteger(revision) || revision < 0) {
        return res.status(400).json({
          success: false,
          message: "Valid roster revision is required.",
        });
      }

      if (!updatedBy) {
        return res.status(400).json({
          success: false,
          message: "UpdatedBy is required.",
        });
      }

      const validation = validateEntries(
        month,
        year,
        rawEntries
      );

      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.message,
        });
      }

      const collection = await getCollection();

      const now = new Date();
      const nextRevision = revision + 1;

      const result = await collection.updateOne(
        {
          Month: month,
          Year: year,
          Revision: revision,
        },
        {
          $set: {
            Entries: validation.entries,
            Revision: nextRevision,
            UpdatedAt: now,
            UpdatedBy: updatedBy,
          },
          $setOnInsert: {
            Month: month,
            Year: year,
            CreatedAt: now,
          },
        },
        {
          upsert: true,
        }
      );

      if (!result.acknowledged) {
        throw new Error("MongoDB update was not acknowledged.");
      }

      return res.status(200).json({
        success: true,
        message: "Holiday roster saved successfully.",
        month,
        year,
        revision: nextRevision,
        entries: validation.entries,
      });
    }

    res.setHeader("Allow", ["GET", "POST"]);

    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed.`,
    });

  } catch (error: any) {
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        code: "ROSTER_CONFLICT",
        message:
          "This roster was changed by another user. Reload the roster before saving again.",
      });
    }

    console.error("Holiday Roster API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while processing holiday roster.",
    });
  }
}
