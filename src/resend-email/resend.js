import { Resend } from "resend";

const resend = new Resend("re_3MMhqDni_6fyGyLp4sg6dzzWSaEugq1kn");

resend.emails.send({
  from: "onboarding@resend.dev",
  to: "rodrigod33d@gmail.com",
  subject: "Hello World",
  html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
});
