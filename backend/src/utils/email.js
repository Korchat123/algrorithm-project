import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'mock@ethereal.email',
      pass: process.env.EMAIL_PASS || 'mockpass'
    }
  });
}

export async function sendVerificationEmail(email, name, token) {
  // For development, use Ethereal or similar
  const transporter = createTransporter();

  const verificationUrl = `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/verify/${token}`;

  const info = await transporter.sendMail({
    from: '"Algorithm Lab" <noreply@algorithmlab.com>',
    to: email,
    subject: "Verify your account",
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Please click the link below to verify your account. This link expires in 20 minutes.</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `
  });

  console.log("Message sent: %s", info.messageId);
  // Preview URL: nodemailer.getTestMessageUrl(info)
}

export async function sendPasswordChangedEmail(email, name) {
  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: '"Algorithm Lab" <noreply@algorithmlab.com>',
    to: email,
    subject: 'Your password was changed',
    html: `
      <h1>Password changed</h1>
      <p>Hello ${name}, this confirms that your Algorithm Lab password was changed.</p>
      <p>If you did not make this change, contact an administrator immediately.</p>
    `
  });

  console.log("Password change email sent: %s", info.messageId);
}
