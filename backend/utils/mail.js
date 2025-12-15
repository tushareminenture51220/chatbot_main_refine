import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendOtpMail = async (to, otp) => {
  const msg = {
    to,
    from: {
      email: "no-reply@eminenture.info",
      name: "Eminenture Support",
    },
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`,
    html: `
      <p>Your OTP for password reset is:</p>
      <h2>${otp}</h2>
      <p>This OTP expires in 5 minutes.</p>
    `,
  };

  await sgMail.send(msg);
};
