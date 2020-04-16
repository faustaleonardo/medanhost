export default (firstName: string, otpCode: number): string => `
  <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="description" content="medanhost" />
      <meta name="author" content="medanhost" />
      <meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width" />
      <title>Medanhost OTP Code</title>
    </head>
    <body>
      <p>Hello,</p>
      <p>Thank you for joining us. Please use this code to login to Medanhost</p>
      <h1>${otpCode}</h1>
    </body>
  </html>
`;
