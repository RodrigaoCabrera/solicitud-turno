import { createHash } from "node:crypto";
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
} from "valibot";
import { db, eq, ProfessionalProfile, Availability } from "astro:db";

import { APIRoute } from "astro";

const ProfessionalEmail = pipe(
  string("The email must be a valid email address"),
  nonEmpty("Please enter your email."),
  email("The email is badly formatted.")
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
    tuition: string(),
    profession: string(),
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
  tuition: string;
  profession: string;
  sessionTime: number;
}

// Create id
const generateId = (str: string) => {
  return createHash("sha256").update(str).digest("hex");
};

// Response
const res = (
  body: { message: string; data?: ProfessionalData },
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

  // Genereta id for professional
  const professionalId = generateId(professionalProfile.tuition);

  // Insert professional data
  await db
    .insert(ProfessionalProfile)
    .values({
      id: professionalId,
      ...professionalProfile,
    })
    .onConflictDoNothing();

  // Insert availability data
  const availabilityData = availability.map((data) => {
    return {
      id: data.dayOfWeek,
      professionalId,
      ...data,
    };
  });

  await db.insert(Availability).values(availabilityData).onConflictDoNothing();
  return res(
    {
      message: "Perfil profesional creado con éxito",
      data: professionalProfile,
    },
    { status: 200 }
  );
};
