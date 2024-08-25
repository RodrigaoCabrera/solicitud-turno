import type { APIRoute } from "astro";
import { disableOldAppoinment } from "@/scripts/disableOldAppointment";

export const POST: APIRoute = async ({ request }) => {
  try {
    await disableOldAppoinment();
    return new Response(
      JSON.stringify({ message: "Appointments updated successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error updating appointments:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
