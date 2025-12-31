import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AttendanceRecord } from './entities/attendance-record.entity';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, subDays, format } from 'date-fns';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private attendanceRepository: Repository<AttendanceRecord>,
  ) {}

  async getTodayAttendance() {
    try {
      // For demo dashboard, get the most recent attendance date and count unique staff
      const records = await this.attendanceRepository.find({
        relations: ['user', 'device'],
        order: {
          attendanceDate: 'DESC',
        },
        take: 100, // Get most recent 100 records for demo
      });
      console.log(`[AttendanceService] Found ${records.length} attendance records`);

    if (records.length === 0) {
      return {
        present: 0,
        absent: 0,
        late: 0,
        onLeave: 0,
        total: 0,
        biometric: 0,
        faceRecognition: 0,
        qrCode: 0,
      };
    }

    // Get the most recent attendance date
    const mostRecentDate = records[0].attendanceDate;
    if (!mostRecentDate) {
      return {
        present: 0,
        absent: 0,
        late: 0,
        onLeave: 0,
        total: 0,
        biometric: 0,
        faceRecognition: 0,
        qrCode: 0,
      };
    }

    // Filter records for the most recent date only
    const todayRecords = records.filter((r) => {
      if (!r.attendanceDate) return false;
      return format(r.attendanceDate, 'yyyy-MM-dd') === format(mostRecentDate, 'yyyy-MM-dd');
    });

    // Count unique staff members by status (one record per user per day)
    const uniqueUsersByStatus = new Map<string, Set<string>>();
    uniqueUsersByStatus.set('present', new Set());
    uniqueUsersByStatus.set('absent', new Set());
    uniqueUsersByStatus.set('late', new Set());
    uniqueUsersByStatus.set('onLeave', new Set());

    todayRecords.forEach((record) => {
      const userId = record.user?.id;
      if (!userId) return;
      
      const status = record.status;
      if (uniqueUsersByStatus.has(status)) {
        uniqueUsersByStatus.get(status)!.add(userId);
      }
    });

    const present = uniqueUsersByStatus.get('present')!.size;
    const absent = uniqueUsersByStatus.get('absent')!.size;
    const late = uniqueUsersByStatus.get('late')!.size;
    const onLeave = uniqueUsersByStatus.get('onLeave')!.size;

    // Count methods from all records (not unique)
    const biometric = todayRecords.filter((r) => r.method === 'biometric').length;
    const faceRecognition = todayRecords.filter((r) => r.method === 'face').length;
    const qrCode = todayRecords.filter((r) => r.method === 'qr').length;

    return {
      present,
      absent,
      late,
      onLeave,
      total: present + absent + late + onLeave,
      biometric,
      faceRecognition,
      qrCode,
    };
    } catch (error) {
      console.error('[AttendanceService] Error in getTodayAttendance:', error);
      throw error;
    }
  }

  async getWeeklyStats() {
    // For demo dashboard, return all attendance data grouped by day name
    const records = await this.attendanceRepository.find({
      relations: ['user'],
      order: {
        attendanceDate: 'DESC',
      },
      take: 200, // Get most recent 200 records for demo
    });

    const stats: any = {};

    // Group by day name from attendance dates
    records.forEach((record) => {
      if (!record.attendanceDate) return;
      
      const dayName = format(record.attendanceDate, 'EEEE').toLowerCase();
      
      if (!stats[dayName]) {
        stats[dayName] = {
          present: 0,
          absent: 0,
          late: 0,
        };
      }

      if (record.status === 'present') {
        stats[dayName].present++;
      } else if (record.status === 'absent') {
        stats[dayName].absent++;
      } else if (record.status === 'late') {
        stats[dayName].late++;
      }
    });

    // Ensure all weekdays are present with at least 0 values
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    weekdays.forEach((day) => {
      if (!stats[day]) {
        stats[day] = { present: 0, absent: 0, late: 0 };
      }
    });

    return stats;
  }

  async getRecords() {
    // For demo dashboard, return all attendance records (not just today)
    const records = await this.attendanceRepository.find({
      relations: ['user', 'device'],
      order: {
        attendanceDate: 'DESC',
        checkInTime: 'ASC',
      },
      take: 100, // Get most recent 100 records for demo
    });

    return records.map((record) => ({
      id: record.id,
      name: record.user?.name || 'Unknown',
      role: record.user?.role || 'Unknown',
      checkIn: record.checkInTime ? this.formatTime(record.checkInTime) : null,
      checkOut: record.checkOutTime ? this.formatTime(record.checkOutTime) : null,
      status: record.status,
      method: record.method,
      deviceId: record.device?.id || null,
      zone: record.zone,
      date: record.attendanceDate ? format(record.attendanceDate, 'yyyy-MM-dd') : null,
    }));
  }

  private formatTime(date: Date | string): string {
    if (typeof date === 'string') {
      // Handle PostgreSQL TIME format (HH:mm:ss or HH:mm:ss.SSS)
      // If it's already a time string, parse it directly
      const timeMatch = date.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.(\d+))?$/);
      if (timeMatch) {
        const hours = timeMatch[1].padStart(2, '0');
        const minutes = timeMatch[2];
        return `${hours}:${minutes}`;
      }
      // Try to parse as Date if it's a full datetime string
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      }
      // If all else fails, return the string as-is (truncated to HH:mm)
      return date.substring(0, 5);
    }
    // If it's a Date object, format it normally
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    // Fallback
    return String(date);
  }
}

