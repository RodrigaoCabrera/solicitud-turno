import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";
import defaultTheme from "tailwindcss/defaultTheme";

import { EmailData } from "@/types/appointments";

interface EmailTemplateProps {
  appointmentData: EmailData;
  calendarLink?: string;
  isEmailForProfessional: boolean;
}
const baseUrl = import.meta.env.BASE_URL || "";

const AppointmentCreated: React.FC<Readonly<EmailTemplateProps>> = ({
  appointmentData,
  calendarLink,
  isEmailForProfessional,
}) => {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            fontFamily: {
              sans: [
                "League Spartan Variable",
                ...defaultTheme.fontFamily.sans,
              ],
            },
            fontSize: {
              xs: "0.75rem", // 12px
              sm: "0.875rem", // 14px
              m: "1rem", // 16px
              lg: "1.125rem", // 18px
              xl: "1.25rem", // 20px
              "2xl": "1.5rem", // 24px
              "3xl": "1.875rem", // 30px
              "4xl": "2.25rem", // 36px
              "5xl": "3rem", // 48px
            },
          },
        },
      }}
    >
      <Html>
        <Head />
        <Body style={main}>
          <Section className="w-full rounded-lg bg-[#F8F8F8] py-4 mt-3 max-w-[391px]">
            <Container className="max-w-[275px] mx-auto">
              <Row>
                <Column>
                  <Img
                    src={`${baseUrl}/check-verified.png`}
                    width="63"
                    height="63"
                    alt="Check verified"
                    className="mx-auto"
                  />
                </Column>
              </Row>

              <Row>
                <Column>
                  <Text className="text-lg text-black text-center font-semibold mt-3 m-0">
                    ¡Listo!
                  </Text>
                </Column>
              </Row>

              <Row>
                <Column>
                  <Text className="text-m font-medium mb-2 max-w-[220px] text-center leading-4 mx-auto">
                    {isEmailForProfessional
                      ? "Se creó un nuevo turno"
                      : "Ya agendaste tu turno con la Dra. Carolina Fagalde."}
                  </Text>
                </Column>
              </Row>

              <Row>
                <Column className="inline-block mr-3 pt-1">
                  <Img
                    src={`${baseUrl}/calendar.png`}
                    width="15"
                    height="15"
                    alt="Icono de calendario"
                    className="inline-block"
                  />
                </Column>
                <Column className="inline-block text-sm">
                  {appointmentData.date}
                </Column>
              </Row>
              <Row className="mt-2">
                <Column className="inline-block mr-3 pt-1">
                  <Img
                    src={`${baseUrl}/clock.png`}
                    width="15"
                    height="15"
                    alt="Icono de calendario"
                    className="inline-block"
                  />
                </Column>
                <Column className="inline-block text-sm">
                  {appointmentData.time}
                </Column>
              </Row>
              <Row className="mt-2">
                <Column className="inline-block mr-3 pt-1">
                  <Img
                    src={`${baseUrl}/office.png`}
                    width="15"
                    height="15"
                    alt="Icono de calendario"
                    className="inline-block"
                  />
                </Column>
                <Column className="inline-block text-sm">
                  {appointmentData.modality === "online"
                    ? "Online - Vía Google meet"
                    : `Presencial - Consultorio: ${appointmentData.address}`}
                </Column>
              </Row>
              <Row className="mt-2">
                <Column className="inline-block mr-3 pt-1">
                  <Img
                    src={`${baseUrl}/medical-cross.png`}
                    width="15"
                    height="15"
                    alt="Icono de calendario"
                    className="inline-block"
                  />
                </Column>
                <Column className="inline-block text-sm">
                  {appointmentData.healthInsurance}
                </Column>
              </Row>

              <Row className="mt-2 pt-2 border-t-[1px] border-solid border-black">
                <Column>
                  <span className="text-sm inline-block mr-1">Paciente:</span>
                  <span className="text-sm inline-block mr-1">
                    {appointmentData.patientName}
                  </span>
                  <span className="text-sm">
                    {appointmentData.patientLastName}
                  </span>
                </Column>
              </Row>
              <Row>
                <Column className="mt-1">
                  <span className="text-sm inline-block mr-1">Tutor:</span>
                  <span className="text-sm inline-block mr-1">
                    {appointmentData.tutorName}
                  </span>
                  <span className="text-sm">
                    {appointmentData.tutorLastName}
                  </span>
                </Column>
              </Row>
            </Container>
          </Section>
          <Container className="mt-5 max-w-[295px]">
            <Row className="mb-2">
              <Column className="text-xs text-center leading-4 mx-auto">
                Te pedimos llegar con unos 10 o 15min de antelación para evitar
                contratiempos.
              </Column>
            </Row>
            <Row className="mt-3 mb-2 max-w-[250px]">
              <Column className="text-xs text-center leading-4 mx-auto">
                En el caso de tener que abonar la consulta podrás gestionar el
                pago directamente en el consultorio.
              </Column>
            </Row>
            {calendarLink && (
              <Row className="max-w-[250px]">
                <Column>
                  <Link className="text-black underline" href={calendarLink}>
                    <Text className="text-xs text-center mx-auto">
                      Agregar turno a google calendar
                    </Text>
                  </Link>
                </Column>
              </Row>
            )}

            <Row className="max-w-[250px]">
              <Column>
                <Link
                  className="w-full px-2 py-2 duration-150 rounded-full max-w-[250px] mx-auto bg-transparent border-[1px] border-solid border-[#94A3B8] mt-5 text-center no-underline inline-block text-black"
                  href="/"
                >
                  <Text className="text-xs uppercase mx-auto my-0 ">
                    Volver al sitio
                  </Text>
                </Link>
              </Column>
            </Row>

            <Row className="max-w-[250px]">
              <Column>
                <Link className="text-black underline" href="/cancelar-turno">
                  <Text className="text-xs text-center mx-auto">
                    Cancelar turno
                  </Text>
                </Link>
              </Column>
            </Row>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
};
export default AppointmentCreated;
