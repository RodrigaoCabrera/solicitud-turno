import { createHash } from "node:crypto";
import { format, diffMinutes } from "@formkit/tempo";
import {
  array,
  object,
  pipe,
  string,
  boolean,
  number,
  minValue,
  maxValue,
  email,
  nonEmpty,
  isoTime,
  safeParse,
  picklist,
  minLength,
  maxLength,
} from "valibot";
import { ProfessionalProfile, Availability } from "db/schema.ts";

import { APIRoute } from "astro";
import { db } from "db/db.ts";
import { eq, or } from "drizzle-orm";

const ProfessionalEmail = pipe(
  string("The email must be a valid email address"),
  nonEmpty("Please enter your email."),
  email("The email is badly formatted.")
);

// phone type
const Phone = pipe(
  string(),
  minLength(10, "The phone number must be at least 10 characters"),
  maxLength(13, "The phone number must not exceed 8 characters.")
);

const SessionTimeOptions = picklist(
  [10, 15, 30, 40, 1],
  "SessioTime mst be one of the following options: 10, 15, 30, 40 minutes, or 1 hours"
);

const dayOfWeekRange = pipe(
  number("EL dia de la semana debe ser un número"),
  minValue(0, "The value minimun for day of week must be 0"),
  maxValue(6, "The value maximun for day of week must be 6")
);
const IsoTimeSchema = pipe(string(), isoTime("The time is badly formatted."));

// Request schema
const professionalDataSchema = object({
  professionalProfile: object({
    firstName: string(),
    lastName: string(),
    email: ProfessionalEmail,
    phone: Phone,
    registrationNumber: string(),
    profession: string(),
    aboutMe: string(),
    address: string(),
    sessionTime: SessionTimeOptions,
  }),

  availability: array(
    object({
      dayOfWeek: dayOfWeekRange,
      startTimeAM: IsoTimeSchema,
      endTimeAM: IsoTimeSchema,
      startTimePM: IsoTimeSchema,
      endTimePM: IsoTimeSchema,
    })
  ),
});

interface ProfessionalData {
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
  profession: string;
  sessionTime: number;
}

interface Availability {
  dayOfWeek: number;
  startTimeAM: string;
  endTimeAM: string;
  startTimePM: string;
  sessionAmount: number;
}

// Create id
const generateId = (str: string) => {
  return createHash("sha256").update(str).digest("hex");
};

// Response
const res = (
  body: { message: string; professionalId?: string },
  {
    status,
    statusText,
    headers,
  }: { status?: number; statusText?: string; headers?: Headers }
) => new Response(JSON.stringify(body), { status, statusText, headers });

export const POST: APIRoute = async ({ params, request }) => {
  // Validar si los datos enviados son los que corresponden
  const { success, output, issues } = safeParse(
    professionalDataSchema,
    await request.json()
  );

  if (!success)
    return res(
      { message: `Bad request: ${issues[0].message}` },
      { status: 400 }
    );

  // Obtener los datos del profesional
  const data = output;
  const { professionalProfile, availability } = data;

  // Verify if there's a profile with the same email o phone number
  const existingProfile = await db
    .select({
      email: ProfessionalProfile.email,
      registrationNumber: ProfessionalProfile.registrationNumber,
      phone: ProfessionalProfile.phone,
    })
    .from(ProfessionalProfile)
    .where(
      or(
        eq(ProfessionalProfile.email, output.professionalProfile.email),
        eq(
          ProfessionalProfile.registrationNumber,
          output.professionalProfile.registrationNumber
        ),
        eq(ProfessionalProfile.phone, output.professionalProfile.phone)
      )
    );

  // Existing email error message
  if (existingProfile.length > 0) {
    if (existingProfile[0].email === output.professionalProfile.email) {
      return res(
        {
          message: `The email '${existingProfile[0].email}' is already registered`,
        },
        { status: 409 }
      );
    } else if (
      existingProfile[0].registrationNumber ===
      output.professionalProfile.registrationNumber
    ) {
      return res(
        {
          message: `The registration number: '${output.professionalProfile.registrationNumber}' is already registered`,
        },
        { status: 409 }
      );
    } else {
      return res(
        {
          message: `The phone number: '${output.professionalProfile.phone}' is already registered`,
        },
        { status: 409 }
      );
    }
  }

  // Genereta id for professional
  const professionalId = generateId(professionalProfile.registrationNumber);

  // Insert professional data
  await db
    .insert(ProfessionalProfile)
    .values({
      id: professionalId,
      ...professionalProfile,
    })
    .onConflictDoNothing();

  // Insert availability data

  // Calculate sessionTime amount
  const sessionTime = professionalProfile.sessionTime;

  const availabilityData = availability.map((data) => {
    const sessionStartAM = data.startTimeAM; //"09:00";
    const sessionEndAM = data.endTimeAM; // "11:00";
    const sessionsAmountAM =
      diffMinutes(
        new Date(`${format(new Date(), "YYYY-MM-DD")} ${sessionEndAM}`),
        `${format(new Date(), "YYYY-MM-DD")} ${sessionStartAM}`
      ) / sessionTime;

    const sessionStartPM = data.startTimePM;
    const sessionEndPM = data.endTimePM;
    const sessionsAmountPM =
      diffMinutes(
        new Date(`${format(new Date(), "YYYY-MM-DD")} ${sessionEndPM}`),
        `${format(new Date(), "YYYY-MM-DD")} ${sessionStartPM}`
      ) / sessionTime;

    const sessionAmount = sessionsAmountAM + sessionsAmountPM;

    return {
      id: data.dayOfWeek,
      professionalId,
      sessionAmount,
      ...data,
    };
  });

  await db.insert(Availability).values(availabilityData).onConflictDoNothing();
  return res(
    {
      message: "Perfil profesional creado con éxito",
      professionalId,
    },
    { status: 200 }
  );
};
