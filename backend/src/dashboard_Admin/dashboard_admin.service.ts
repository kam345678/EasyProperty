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
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      );

      // 1. สถิติห้องพัก (เหมือนเดิม แต่เช็ค Status ให้ดี)
      const [totalRooms, availableRooms, occupiedRooms] = await Promise.all([
        this.roomModel.countDocuments(),
        this.roomModel.countDocuments({ status: 'available' }),
        this.roomModel.countDocuments({ status: 'occupied' }),
      ]);

      // 2. ✅ แก้ไขรายได้: ดึงจาก amounts.grandTotal และเช็ค payment.status
      const revenueData = await this.invoiceModel.aggregate([
        {
          $match: {
            'payment.status': 'paid',
            updatedAt: { $gte: firstDayOfMonth },
          },
        },
        { $group: { _id: null, total: { $sum: '$amounts.grandTotal' } } },
      ]);

      // 3. นับงานซ่อม (เช็คคำสะกด in-progress หรือ in_progress)
      const pendingMaintenance = await this.maintenanceModel.countDocuments({
        status: { $in: ['pending', 'in-progress'] },
      });

      // 4. ดึง Invoice ล่าสุด 5 รายการ
      const recentInvoices = await this.invoiceModel
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('tenantId'); // ดึงมาทั้งก้อนก่อน แล้วค่อยไป map profile.fullName

      // 5. ข้อมูลกราฟรายได้ทั้งปีปัจจุบัน (Jan–Dec)

      const currentYear = today.getFullYear().toString();

      const revenueChartData = await this.invoiceModel.aggregate([
        {
          $match: {
            'payment.status': 'paid',
            billingPeriod: { $regex: `^${currentYear}-` }, // เอาเฉพาะปีปัจจุบัน
          },
        },
        {
          $group: {
            _id: '$billingPeriod',
            total: { $sum: '$amounts.grandTotal' },
          },
        },
      ]);

      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      // สร้าง array 12 เดือน และใส่ค่า 0 ไว้ก่อน
      const revenueChart = monthNames.map((month, index) => {
        const monthKey = `${currentYear}-${String(index + 1).padStart(2, '0')}`;
        const found = revenueChartData.find((item) => item._id === monthKey);

        return {
          month,
          revenue: found ? found.total : 0,
        };
      });

      return {
        stats: {
          monthlyRevenue: revenueData[0]?.total || 0,
          occupancyRate:
            totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0,
          pendingMaintenance,
          availableRooms,
        },
        recentInvoices: recentInvoices.map((inv) => ({
          id: inv._id,
          invoiceNo:
            inv.invoiceNumber || `#INV-${inv._id.toString().slice(-4)}`,
          tenant: inv.tenantId?.fullName || 'ไม่ระบุชื่อ',
          amount: `฿${inv.amounts?.grandTotal?.toLocaleString() || 0}`,
          status: inv.payment?.status,
        })),
        revenueChart,
      };
    } catch (error) {
      console.error('Dashboard Stats Error:', error);
      throw error;
    }
  }
}
