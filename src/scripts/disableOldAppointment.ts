import { and, eq, lt } from "drizzle-orm";
import { Appointments } from "../../db/schema";
import { db } from "../../db/db";

export async function disableOldAppoinment() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  try {
    const result = await db
      .update(Appointments)
      .set({ isActive: false })
      .where(
        and(
          eq(Appointments.isActive, true),
          lt(Appointments.date, yesterdayStr)
        )
      )
      .execute();
  } catch (error) {
    console.error("Error al actualizar las citas:", error);
    throw error; // Re-lanzar el error para manejarlo en el endpoint API
  }
}
