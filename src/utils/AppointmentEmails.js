const AppointmentConfirmEmail = (appointmentData) => {
  const { date, time, desc, username, length } = appointmentData;

  return ` 
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    h3 {
      color: #333333;
    }
    .appointment-details {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      margin-top: 20px;
      font-size: 14px;
      color: #555555;
    }
    .call-link {
      color: #007bff;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h3>Appointment Confirmed!</h3>
    <p>Hi ${username}, Thank you for scheduling your appointment with us. We're excited to see you! </p>
    
    <div class="appointment-details">
      <p><strong>Appointment Date & Time:</strong> ${date} at ${time}</p>
      <p><strong>Estimated Duration:</strong> ${length} minutes</p>
      <p><strong>Your Notes:</strong> ${desc}</p>
    </div>
    
    <p>If you have any questions or need to reschedule, please give us a call on <a href="tel:+1234567890" class="call-link"> +1234567890</a>.</p>
    
    <div class="footer">
      <p>Looking forward to seeing you,</p>
      <p>Whatever Company</p>
    </div>
  </div>
</body>
</html>`;
};

export { AppointmentConfirmEmail };

// hooks/emails/AppointmentCancelledEmail.js
const AppointmentCancelledEmail = (appointmentData) => {
  const { date, time, desc, username } = appointmentData;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Appointment Cancellation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h3 {
          color: #333333;
        }
        .appointment-details {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 20px;
          font-size: 14px;
          color: #555555;
        }
        .call-link {
          color: #007bff;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h3>Your Appointment Was Cancelled</h3>
        <p>Hi ${username}, We are so sorry, but we had to cancel your appointment. Please give us a call on +1234567890 to reschedule.</p>
        <div class="appointment-details">
          <p><strong>Appointment Date & Time:</strong> ${date} at ${time}</p>
          <p><strong>Your Notes:</strong> ${desc}</p>
        </div>
        <p>If you have any questions or would like to reschedule, please don't hesitate t give us a call on <a href="tel:+1234567890" class="call-link">+1234567890</a>.</p>
        <div class="footer">
          <p>Kind Regards,</p>
          <p>Whatever Company</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export { AppointmentCancelledEmail };

const AppointmentChangedEmail = (appointmentData, oldAppointmentData) => {
  const { date, time, desc, username, length } = appointmentData;
  const {
    date: oldDate,
    time: oldTime,
    desc: oldDesc,
    length: oldLength,
  } = oldAppointmentData || {};
  console.log("email appointmentData", appointmentData);
  console.log("email oldAppointmentData", oldAppointmentData);

  return ` 
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Changed</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    h3 {
      color: #333333;
    }
    .appointment-details {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      margin-top: 20px;
      font-size: 14px;
      color: #555555;
    }
    .call-link {
      color: #007bff;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h3>Appointment Changed!</h3>
    <p>Hi ${username}, Your appointment was changed. Please see the changes here: </p>
    
    <p>New Appointment Details</p
    <div class="appointment-details">
    <p><strong>Appointment Date & Time:</strong> ${date} at ${time}</p>
    <p><strong>Estimated Duration:</strong> ${length} minutes</p>
    <p><strong>Your Notes:</strong> ${desc}</p>
    </div>
    
    <p>Old Appointment Details</p
    <div class="appointment-details">
      <p><strong>Appointment Date & Time:</strong> ${oldDate} at ${oldTime}</p>
      <p><strong>Estimated Duration:</strong> ${oldLength} minutes</p>
      <p><strong>Your Notes:</strong> ${oldDesc}</p>
    </div>
    
    <p>If you have any questions or need to reschedule, pleas give us a call on <a href="tel:+1234567890" class="call-link">+1234567890 </a>.</p>
    
    <div class="footer">
      <p>Looking forward to seeing you,</p>
      <p>Whatever Company</p>
    </div>
  </div>
</body>
</html>`;
};

export { AppointmentChangedEmail };
