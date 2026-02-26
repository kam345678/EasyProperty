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
          'payment.status': 'paid', // 👈 แก้จาก status เป็น payment.status
          updatedAt: { $gte: firstDayOfMonth } 
        } 
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: '$amounts.grandTotal' } // 👈 แก้จาก totalAmount เป็น amounts.grandTotal
        } 
      }
    ]);

    // 3. นับงานซ่อม (เช็คคำสะกด in-progress หรือ in_progress)
    const pendingMaintenance = await this.maintenanceModel.countDocuments({
      status: { $in: ['pending', 'in_progress'] } // 👈 ใน Service แจ้งซ่อมเพื่อนใช้ in_progress (underscore)
    });

    // 4. ✅ ดึง Invoice ล่าสุด: แก้ไขการ Populate ชื่อผู้เช่า
    const recentInvoices = await this.invoiceModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('tenantId'); // ดึงมาทั้งก้อนก่อน แล้วค่อยไป map profile.fullName

    const monthlyRevenue = revenueData[0]?.total || 0;

    return {
      stats: {
        monthlyRevenue,
        occupancyRate: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0,
        pendingMaintenance,
        availableRooms,
      },
      recentInvoices: recentInvoices.map(inv => ({
        id: inv._id,
        invoiceNo: inv.billingPeriod ? `INV-${inv.billingPeriod}-${inv._id.toString().slice(-3)}` : `#${inv._id.toString().slice(-4)}`,
        // ✅ แก้ไข: ดึงชื่อจาก profile.fullName
        tenant: inv.tenantId?.profile?.fullName || inv.tenantId?.email || 'ไม่ระบุชื่อ',
        amount: inv.amounts?.grandTotal || 0, // ส่งเป็นเลขไปก่อน แล้วให้ frontend localeString เอง
        status: inv.payment?.status // 👈 ดึงจาก payment.status
      })),
      revenueChart: [
        { month: 'Jan', revenue: 45000 },
        { month: 'Feb', revenue: 52000 },
        { month: 'Mar', revenue: monthlyRevenue }, // ค่าจริงเดือนนี้
      ]
    };
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    throw error;
  }
}
}