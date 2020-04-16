export default (url: string): string => `
  <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="description" content="medanhost" />
      <meta name="author" content="medanhost" />
      <meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width" />
      <title>Medanhost Booking</title>
    </head>
    <body>
      <p>Hello,</p>
      <p>Thank you for shopping with us. Please click the following link to complete your payment.</p>
      <a href="${url}" target="_blank">Click here!</a>
    </body>
  </html>
`;
