import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

export default async function sendEmail(data: any) {
  // console.log(data)
  const mailerSend = new MailerSend({
    apiKey: String(process.env.MAILSEND_API_KEY),
  });

  const sentFrom = new Sender(
    "abhrajitrath@trial-3vz9dlezw0plkj50.mlsender.net",
    "Abhrajit Rath"
  );

  const recipients = [new Recipient(data.email, data.name)];

  if (!data.email || !data.name) return;

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("Recharge Success!")
    .setText(
      `Hi, Recharge of Rs ${data.amount} has been done on this ${data.operator} number : ${data.phone}, Enjoy our service!`
    );

  await mailerSend.email.send(emailParams);
}
