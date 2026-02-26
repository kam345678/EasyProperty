import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DashboardAdminService {
  constructor(
    @InjectModel('Room') private readonly roomModel: Model<any>,
    @InjectModel('Invoice') private readonly invoiceModel: Model<any>,
    @InjectModel('Maintenance') private readonly maintenanceModel: Model<any>,
  ) {}

  async getStats() {
    try {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // 1. สถิติห้องพัก
      const [totalRooms, availableRooms, occupiedRooms] = await Promise.all([
        this.roomModel.countDocuments(),
        this.roomModel.countDocuments({ status: 'available' }),
        this.roomModel.countDocuments({ status: 'occupied' }),
      ]);

      // 2. คำนวณรายได้จาก Invoice ที่จ่ายแล้วของเดือนนี้
      const revenueData = await this.invoiceModel.aggregate([
        { 
          $match: { 
            status: 'paid', 
            updatedAt: { $gte: firstDayOfMonth } 
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      // 3. นับงานซ่อมที่ค้างอยู่
      const pendingMaintenance = await this.maintenanceModel.countDocuments({
        status: { $in: ['pending', 'in-progress'] }
      });

      // 4. ดึง Invoice ล่าสุด 5 รายการ
      const recentInvoices = await this.invoiceModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('tenantId', 'fullName'); // ตรวจสอบว่าชื่อฟิลด์ใน Schema ตรงกัน

      // 5. ข้อมูลกราฟรายได้ (ตัวอย่าง 6 เดือนย้อนหลัง)
      // เพื่อนสามารถใช้ aggregate ทำข้อมูลจริงได้ แต่เบื้องต้นส่งค่า Static ผสมค่าจริงไปก่อน
      const revenueChart = [
        { month: 'Nov', revenue: 30000 },
        { month: 'Dec', revenue: 50000 },
        { month: 'Jan', revenue: 80000 },
        { month: 'Feb', revenue: revenueData[0]?.total || 0 },
      ];

      return {
        stats: {
          monthlyRevenue: revenueData[0]?.total || 0,
          occupancyRate: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0,
          pendingMaintenance,
          availableRooms,
        },
        recentInvoices: recentInvoices.map(inv => ({
          id: inv._id,
          invoiceNo: inv.invoiceNumber || `#INV-${inv._id.toString().slice(-4)}`,
          tenant: inv.tenantId?.fullName || 'ไม่ระบุชื่อ',
          amount: `฿${inv.totalAmount?.toLocaleString() || 0}`,
          status: inv.status
        })),
        revenueChart
      };
    } catch (error) {
      console.error("Dashboard Stats Error:", error);
      throw error;
    }
  }
}