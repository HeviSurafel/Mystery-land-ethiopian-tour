import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Booking from '@/models/Booking';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthFromRequest(req);
    
    if (!['admin', 'owner'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { type } = await req.json();
    const bookingId = (await params).id;

    const booking = await Booking.findById(bookingId)
      .populate('client')
      .populate({
        path: 'tour',
        populate: { path: 'destination' }
      });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Send reminder based on type
    if (type === 'client') {
      await sendReminderToClient(booking);
    }

    // Log reminder in booking
    if (!booking.reminders) {
      booking.reminders = [];
    }
    
    booking.reminders.push({
      type,
      sentTo: type === 'client' ? booking.client.email : null,
      sentBy: user.userId,
      sentAt: new Date()
    });

    await booking.save();

    return NextResponse.json({
      success: true,
      message: 'Reminder sent successfully'
    });

  } catch (error: any) {
    console.error('Error sending reminder:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

async function sendReminderToClient(booking: any) {
  // Implement your email sending logic here
  console.log(`Reminder email sent to ${booking.client.email} for booking ${booking._id}`);
  
  // Example using a real email service:
  // await sendEmail({
  //   to: booking.client.email,
  //   subject: `Reminder: Your upcoming tour - ${booking.tour.name}`,
  //   html: `
  //     <h1>Tour Reminder</h1>
  //     <p>Dear ${booking.client.name},</p>
  //     <p>This is a reminder about your upcoming tour:</p>
  //     <ul>
  //       <li><strong>Tour:</strong> ${booking.tour.name}</li>
  //       <li><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</li>
  //       <li><strong>Participants:</strong> ${booking.participants}</li>
  //     </ul>
  //     <p>We look forward to seeing you!</p>
  //   `
  // });
}