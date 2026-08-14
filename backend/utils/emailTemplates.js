export const welcomeEmailTemplate = (member) => `
  <div style="font-family: Helvetica, Arial, sans-serif; background:#0a0a0a; color:#f5f5f5; padding:40px;">
    <h1 style="letter-spacing:2px; font-size:24px;">WELCOME TO THE CREW</h1>
    <p style="font-size:16px; line-height:1.6;">Hey ${member.fullName.split(" ")[0]},</p>
    <p style="font-size:16px; line-height:1.6;">
      You're officially on our list. We'll see you somewhere &mdash; on a road that isn't
      on Google Maps, most likely.
    </p>
    <p style="font-size:14px; color:#999; margin-top:32px;">— The Crew</p>
  </div>
`;

export const adminNotificationTemplate = (member) => `
  <div style="font-family: Helvetica, Arial, sans-serif; padding:24px;">
    <h2>New crew application</h2>
    <ul>
      <li><strong>Name:</strong> ${member.fullName}</li>
      <li><strong>Email:</strong> ${member.email}</li>
      <li><strong>Phone:</strong> ${member.phone || "-"}</li>
      <li><strong>Instagram:</strong> ${member.instagramUsername || "-"}</li>
      <li><strong>City:</strong> ${member.city || "-"}</li>
      <li><strong>Age:</strong> ${member.age || "-"}</li>
      <li><strong>Why they travel:</strong> ${member.reason || "-"}</li>
      <li><strong>Interests:</strong> ${member.travelInterests || "-"}</li>
    </ul>
  </div>
`;

export const customerWelcomeEmailTemplate = (customer) => `
  <div style="font-family: Helvetica, Arial, sans-serif; background:#0a0a0a; color:#f5f5f5; padding:40px;">
    <h1 style="letter-spacing:2px; font-size:24px;">WELCOME TO THE CREW</h1>
    <p style="font-size:16px; line-height:1.6;">Hey ${customer.name.split(" ")[0]},</p>
    <p style="font-size:16px; line-height:1.6;">
      You're in — both the community and your account are set up under
      <strong>${customer.email}</strong>. From here you can browse trips, book a seat,
      and track everything from your account.
    </p>
    <p style="font-size:14px; color:#999; margin-top:24px;">
      For your security, we never include your password in email. If this wasn't you,
      just ignore this message.
    </p>
    <p style="font-size:14px; color:#999; margin-top:32px;">— The Crew</p>
  </div>
`;

export const passwordResetEmailTemplate = (customer, resetUrl) => `
  <div style="font-family: Helvetica, Arial, sans-serif; background:#0a0a0a; color:#f5f5f5; padding:40px;">
    <h1 style="letter-spacing:2px; font-size:22px;">RESET YOUR PASSWORD</h1>
    <p style="font-size:16px; line-height:1.6;">Hey ${customer.name.split(" ")[0]},</p>
    <p style="font-size:16px; line-height:1.6;">
      We got a request to reset your password. This link is valid for 1 hour:
    </p>
    <p style="margin:24px 0;">
      <a href="${resetUrl}" style="background:#c98a4b; color:#0a0a0a; padding:12px 24px; border-radius:999px; text-decoration:none; font-weight:600;">
        Reset Password
      </a>
    </p>
    <p style="font-size:13px; color:#999;">
      If you didn't request this, you can safely ignore this email — your password won't change.
    </p>
  </div>
`;

export const bookingConfirmationEmailTemplate = (booking, trip, customer) => `
  <div style="font-family: Helvetica, Arial, sans-serif; background:#0a0a0a; color:#f5f5f5; padding:40px;">
    <h1 style="letter-spacing:2px; font-size:22px;">BOOKING CONFIRMED</h1>
    <p style="font-size:16px; line-height:1.6;">Hey ${customer.name.split(" ")[0]},</p>
    <p style="font-size:16px; line-height:1.6;">Your spot on <strong>${trip.title}</strong> is booked. Here's the summary:</p>
    <table style="width:100%; margin:20px 0; font-size:14px; border-collapse:collapse;">
      <tr><td style="padding:6px 0; color:#999;">Booking ID</td><td style="padding:6px 0; text-align:right;">${booking.bookingReference}</td></tr>
      <tr><td style="padding:6px 0; color:#999;">Destination</td><td style="padding:6px 0; text-align:right;">${trip.destination}</td></tr>
      <tr><td style="padding:6px 0; color:#999;">Trip Dates</td><td style="padding:6px 0; text-align:right;">${new Date(trip.startDate).toLocaleDateString()} – ${new Date(trip.endDate).toLocaleDateString()}</td></tr>
      <tr><td style="padding:6px 0; color:#999;">Seats</td><td style="padding:6px 0; text-align:right;">${booking.seats}</td></tr>
      <tr><td style="padding:6px 0; color:#999;">Total Amount</td><td style="padding:6px 0; text-align:right;">₹${booking.totalAmount}</td></tr>
      <tr><td style="padding:6px 0; color:#999;">Payment Method</td><td style="padding:6px 0; text-align:right;">${booking.paymentMethod}</td></tr>
      <tr><td style="padding:6px 0; color:#999;">Payment Status</td><td style="padding:6px 0; text-align:right;">${booking.paymentStatus}</td></tr>
      <tr><td style="padding:6px 0; color:#999;">Booking Status</td><td style="padding:6px 0; text-align:right;">${booking.bookingStatus}</td></tr>
    </table>
    ${
      booking.paymentMethod === "COD"
        ? '<p style="font-size:13px; color:#c98a4b;">This booking is Cash on Delivery — payment is still pending and will be collected as arranged.</p>'
        : ""
    }
    <p style="font-size:14px; color:#999; margin-top:24px;">You can view this booking anytime from My Bookings in your account.</p>
  </div>
`;

export const adminBookingNotificationTemplate = (booking, trip, customer) => `
  <div style="font-family: Helvetica, Arial, sans-serif; padding:24px;">
    <h2>New booking: ${booking.bookingReference}</h2>
    <ul>
      <li><strong>Customer:</strong> ${customer.name} (${customer.email}, ${customer.phone || "-"})</li>
      <li><strong>Trip:</strong> ${trip.title} — ${trip.destination}</li>
      <li><strong>Seats:</strong> ${booking.seats}</li>
      <li><strong>Total:</strong> ₹${booking.totalAmount}</li>
      <li><strong>Payment Method:</strong> ${booking.paymentMethod}</li>
      <li><strong>Payment Status:</strong> ${booking.paymentStatus}</li>
    </ul>
  </div>
`;
