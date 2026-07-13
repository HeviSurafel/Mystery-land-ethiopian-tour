// app/api/inquiries/[id]/route.ts
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import Inquiry from '@/models/Inquiry';
import {emailService} from '@/lib/email/emailService';

// GET /api/inquiries/[id] - Get single inquiry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const inquiry = await Inquiry.findById((await params).id).lean();
    
    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    // Mark as read if it was new
    if (inquiry.status === 'new') {
      await Inquiry.findByIdAndUpdate((await params).id, {
        status: 'read',
        updatedAt: new Date()
      });
    }

    return NextResponse.json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inquiry' },
      { status: 500 }
    );
  }
}

// PATCH /api/inquiries/[id] - Update inquiry
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const inquiryId = (await params).id;
    
    // Add timestamp for status changes
    if (body.status === 'replied') {
      body.repliedAt = new Date();
    }
    if (body.status === 'resolved') {
      body.resolvedAt = new Date();
    }

    // Handle internal note addition
    if (body.note) {
      // Check if body.note is an object with note property or a string
      let noteToAdd;
      
      if (typeof body.note === 'object' && body.note.note) {
        // If it's already an object with note property
        noteToAdd = {
          note: body.note.note,
          createdBy: body.note.createdBy || body.user || 'Admin',
          createdAt: body.note.createdAt || new Date()
        };
      } else if (typeof body.note === 'string') {
        // If it's a string (the note content)
        noteToAdd = {
          note: body.note,
          createdBy: body.user || 'Admin',
          createdAt: new Date()
        };
      } else {
        // If it's some other structure
        noteToAdd = {
          note: String(body.note),
          createdBy: body.user || 'Admin',
          createdAt: new Date()
        };
      }
      
      // Push the properly formatted note
      await Inquiry.findByIdAndUpdate(
        inquiryId,
        {
          $push: { internalNotes: noteToAdd }
        }
      );
      
      // Remove note from body to avoid double processing
      delete body.note;
      delete body.user;
    }

    // Handle communication history
    if (body.communication) {
      await Inquiry.findByIdAndUpdate(
        inquiryId,
        {
          $push: { communicationHistory: body.communication }
        }
      );
      delete body.communication;
    }

    // Update inquiry with remaining fields
    const inquiry = await Inquiry.findByIdAndUpdate(
      inquiryId,
      {
        ...body,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    // Send reply email if provided
    if (body.replyMessage) {
      await emailService.sendReply(
        inquiry.email,
        body.replySubject || `Re: Your inquiry - We Travel Ethiopia Tours`,
        body.replyMessage,
        body.repliedBy
      );
    }

    return NextResponse.json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update inquiry' },
      { status: 500 }
    );
  }
}

// DELETE /api/inquiries/[id] - Delete inquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const inquiry = await Inquiry.findByIdAndDelete((await params).id);
    
    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete inquiry' },
      { status: 500 }
    );
  }
}