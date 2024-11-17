import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

export default async function sendEmail(data: any) {
  // console.log(data)
  const mailerSend = new MailerSend({
    apiKey: String(process.env.MAILSEND_API_KEY),
  });

  const sentFrom = new Sender(
    "subharthi@trial-v69oxl5r32rg785k.mlsender.net",
    "Subharthi Hazra"
  );

  const recipients = [new Recipient(data.email, data.name)];

  if (!data.email || !data.name) return;

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("Purchase Success!")
    .setText(
      `Hi, Purchase of Rs ${data.price} has been done on this ${data.operator} number : ${data.phone}, Enjoy our service!`
    );

  await mailerSend.email.send(emailParams);
}
