// app/api/admin/dashboard/system-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { requireAuthFromRequest } from '@/lib/auth';
import os from 'os';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthFromRequest(request, 'admin');
    
    // Check database connection
    let dbStatus = 'disconnected';
    let dbLatency = null;
    
    try {
      const start = Date.now();
      await connectToDatabase();
      dbLatency = Date.now() - start;
      dbStatus = 'connected';
    } catch (error) {
      dbStatus = 'error';
    }

    // Get server info
    const serverInfo = {
      uptime: Math.floor(process.uptime()),
      memory: process.memoryUsage(),
      cpu: os.loadavg(),
      platform: process.platform,
      nodeVersion: process.version
    };

    // Get session stats (you'll need to implement your session store)
    const activeSessions = await getActiveSessionCount(); // Implement this based on your auth system

    // Calculate storage (implement based on your storage system)
    const storageUsed = await calculateStorageUsed(); // Implement this

    // Get last backup time (implement based on your backup system)
    const lastBackup = await getLastBackupTime(); // Implement this

    return NextResponse.json({
      success: true,
      data: {
        server: {
          status: 'online',
          uptime: formatUptime(serverInfo.uptime),
          memory: formatMemory(serverInfo.memory),
          cpu: serverInfo.cpu,
          platform: serverInfo.platform,
          nodeVersion: serverInfo.nodeVersion
        },
        database: {
          status: dbStatus,
          latency: dbLatency,
          lastBackup
        },
        system: {
          activeSessions,
          storageUsed,
          lastChecked: new Date().toISOString()
        }
      }
    });

  } catch (error: any) {
    console.error('Error fetching system status:', error);

    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        server: { status: 'online' },
        database: { status: 'error' },
        system: { activeSessions: 0, storageUsed: 0 }
      }
    });
  }
}

// Helper functions
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  
  return parts.join(' ') || '0m';
}

function formatMemory(memory: NodeJS.MemoryUsage): any {
  return {
    rss: `${Math.round(memory.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)} MB`,
    external: `${Math.round(memory.external / 1024 / 1024)} MB`
  };
}

// These functions need to be implemented based on your system
async function getActiveSessionCount(): Promise<number> {
  // Implement based on your session store (e.g., Redis, database, etc.)
  return 12; // Placeholder
}

async function calculateStorageUsed(): Promise<number> {
  // Implement based on your storage system
  return 45; // Placeholder percentage
}

async function getLastBackupTime(): Promise<string> {
  // Implement based on your backup system
  return new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(); // 2 hours ago
}