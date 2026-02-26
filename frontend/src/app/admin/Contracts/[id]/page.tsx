"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Pencil, Trash2, Save, FileText, User, DoorOpen, CalendarDays, Banknote, ArrowLeft, X } from "lucide-react"
import ModalAlert from "@/components/ModalAlert"

// ✅ import service functions
import {
  getContractById,
  updateContract,
  deleteContract,
} from "@/services/contracts.service"

export default function ContractDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const [contract, setContract] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"success" | "error" | "info">("info")
  const [modalMessage, setModalMessage] = useState("")
  const [confirmAction, setConfirmAction] = useState<null | (() => void)>(null)

  // ✅ ใช้ service แทน fetch ตรงๆ
  useEffect(() => {
    const fetchContract = async () => {
      try {
        if (!id) return
        const data = await getContractById(id as string)
        setContract(data)
      } catch (err) {
        console.error("Failed to load contract", err)
      } finally {
        setLoading(false)
      }
    }

    fetchContract()
  }, [id])

  const handleChange = (e: any) => {
    const { name, value } = e.target

    if (name === "deposit") {
      setContract((prev: any) => ({
        ...prev,
        financials: {
          ...prev.financials,
          deposit: Number(value),
        },
      }))
      return
    }

    setContract((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async () => {
    try {
      await updateContract(id as string, {
        startDate: contract.startDate,
        endDate: contract.endDate,
        status: contract.status,
        financials: {
          deposit: Number(contract.financials?.deposit ?? 0),
          advancePayment: Number(contract.financials?.advancePayment ?? 0),
        },
      })

      setModalType("success")
      setModalMessage("อัปเดตสัญญาสำเร็จ")
      setConfirmAction(null)
      setModalOpen(true)
    } catch (err: any) {
      console.error("Update error:", err)

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "เกิดข้อผิดพลาดในการอัปเดต"

      const message = Array.isArray(backendMessage)
        ? backendMessage.join("\n")
        : backendMessage

      setModalType("error")
      setModalMessage("อัปเดตไม่สำเร็จ:\n" + message)
      setConfirmAction(null)
      setModalOpen(true)
    }
  }

  const handleDelete = async () => {
    setModalType("info")
    setModalMessage("คุณแน่ใจหรือไม่ว่าต้องการลบสัญญานี้?")
    setConfirmAction(() => async () => {
      try {
        await deleteContract(id as string)
        setModalType("success")
        setModalMessage("ลบสัญญาสำเร็จ")
        setConfirmAction(null)
        setModalOpen(true)
        router.push("/admin/contracts")
      } catch (err) {
        setModalType("error")
        setModalMessage("เกิดข้อผิดพลาดในการลบ")
        setConfirmAction(null)
        setModalOpen(true)
      }
    })
    setModalOpen(true)
    return
  }

  const statusConfig: Record<string, { label: string; classes: string }> = {
    active: {
      label: "Active",
      classes: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    },
    completed: {
      label: "Completed",
      classes: "bg-sky-100 text-sky-700 border border-sky-200",
    },
    cancelled: {
      label: "Cancelled",
      classes: "bg-rose-100 text-rose-700 border border-rose-200",
    },
  }

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          <span className="text-sm font-medium tracking-wide">กำลังโหลด...</span>
        </div>
      </div>
    )

  if (!contract)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        ไม่พบข้อมูลสัญญา
      </div>
    )

  const currentStatus = statusConfig[contract.status] ?? {
    label: contract.status,
    classes: "bg-slate-100 text-slate-600 border border-slate-200",
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ─── Top Header Bar ─── */}
      <div className="bg-white border-b border-slate-200 sticky ">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin/Contracts")}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-xs font-medium text-slate-400 tracking-widest uppercase">สัญญาเช่า</p>
              <h1 className="text-xl font-bold text-slate-800 leading-tight">รายละเอียดสัญญา</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${currentStatus.classes}`}>
              {currentStatus.label}
            </span>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
              >
                <Pencil size={14} /> แก้ไข
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  <X size={14} /> ยกเลิก
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
                >
                  <Save size={14} /> บันทึก
                </button>
              </>
            )}

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-4 py-2 rounded-lg text-sm transition-colors border border-rose-200"
            >
              <Trash2 size={14} /> ลบ
            </button>
          </div>
        </div>
      </div>

      {/* ─── Page Body ─── */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-5">

        {/* ─── Section: Contract Info ─── */}
        <SectionCard icon={<FileText size={16} />} title="ข้อมูลสัญญา">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InfoField label="Contract ID" value={contract._id} mono />
            <InfoField label="ประเภทสัญญา" value={contract.type} />
            <InfoField
              label="วันที่สร้าง"
              value={new Date(contract.createdAt).toLocaleString("th-TH")}
            />
          </div>
        </SectionCard>

        {/* ─── Section: Tenant Info ─── */}
        <SectionCard icon={<User size={16} />} title="ข้อมูลผู้เช่า">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoField label="ชื่อ-นามสกุล" value={contract.tenantId?.profile?.fullName} />
            <InfoField label="Email" value={contract.tenantId?.email} />
            <InfoField label="เบอร์โทร" value={contract.tenantId?.profile?.phone} />
            <InfoField label="เลขบัตรประชาชน" value={contract.tenantId?.profile?.idCardNumber} mono />
            <InfoField
              label="วันเกิด"
              value={
                contract.tenantId?.profile?.birthDate
                  ? new Date(contract.tenantId.profile.birthDate).toLocaleDateString("th-TH")
                  : "—"
              }
            />
          </div>
        </SectionCard>

        {/* ─── Section: Room Info ─── */}
        <SectionCard icon={<DoorOpen size={16} />} title="ข้อมูลห้องพัก">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <InfoField label="หมายเลขห้อง" value={contract.roomId?.roomNumber} highlight />
            <InfoField label="ชั้น" value={contract.roomId?.floor} />
            <InfoField label="ประเภทห้อง" value={contract.roomId?.roomType} />
            <InfoField
              label="ราคา"
              value={contract.roomId?.prices ? `฿${contract.roomId.prices.toLocaleString()}` : "—"}
            />
            <InfoField label="สถานะห้อง" value={contract.roomId?.status} />
            <InfoField label="สิ่งอำนวยความสะดวก" value={contract.roomId?.amenities?.join(", ")} />
            <InfoField label="มิเตอร์น้ำล่าสุด" value={contract.roomId?.lastMeterReading?.water} />
            <InfoField label="มิเตอร์ไฟล่าสุด" value={contract.roomId?.lastMeterReading?.electric} />
          </div>
        </SectionCard>

        {/* ─── Section: Editable Fields ─── */}
        <SectionCard icon={<CalendarDays size={16} />} title="ช่วงเวลาสัญญาและการเงิน">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                วันเริ่มสัญญา
              </label>
              <input
                type="date"
                name="startDate"
                value={contract.startDate?.split("T")[0] || ""}
                disabled={!isEditing}
                onChange={handleChange}
                className={inputClass(isEditing)}
              />
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                วันสิ้นสุดสัญญา
              </label>
              <input
                type="date"
                name="endDate"
                value={contract.endDate?.split("T")[0] || ""}
                disabled={!isEditing}
                onChange={handleChange}
                className={inputClass(isEditing)}
              />
            </div>

            {/* Deposit */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                เงินมัดจำ (บาท)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">฿</span>
                <input
                  type="number"
                  name="deposit"
                  value={contract.financials?.deposit ?? 0}
                  disabled={!isEditing}
                  onChange={handleChange}
                  className={`${inputClass(isEditing)} pl-7`}
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                สถานะสัญญา
              </label>
              <select
                name="status"
                value={contract.status}
                disabled={!isEditing}
                onChange={handleChange}
                className={inputClass(isEditing)}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

          </div>

          {isEditing && (
            <div className="mt-5 pt-5 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleUpdate}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-sm"
              >
                <Save size={14} /> บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          )}
        </SectionCard>

      </div>
      <ModalAlert
        open={modalOpen}
        type={modalType}
        message={modalMessage}
        onClose={() => {
          setModalOpen(false)
          setConfirmAction(null)
        }}
        onConfirm={confirmAction ?? undefined}
      />
    </div>
  )
}

/* ─────────────────────────────────────────── */
/*  Helper: input class                        */
/* ─────────────────────────────────────────── */
function inputClass(isEditing: boolean) {
  return [
    "w-full rounded-lg border px-3 py-2.5 text-sm transition-all duration-200 outline-none",
    isEditing
      ? "border-slate-300 bg-white text-slate-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      : "border-transparent bg-slate-100 text-slate-700 cursor-default select-none",
  ].join(" ")
}

/* ─────────────────────────────────────────── */
/*  Subcomponent: SectionCard                  */
/* ─────────────────────────────────────────── */
function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100 bg-slate-50">
        <span className="text-slate-400">{icon}</span>
        <h2 className="text-sm font-bold text-slate-700 tracking-wide">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

/* ─────────────────────────────────────────── */
/*  Subcomponent: InfoField                    */
/* ─────────────────────────────────────────── */
function InfoField({
  label,
  value,
  mono = false,
  highlight = false,
}: {
  label: string
  value?: string | number | null
  mono?: boolean
  highlight?: boolean
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
      <p
        className={[
          "text-sm",
          mono ? "font-mono text-slate-600 text-xs bg-slate-100 px-2 py-1 rounded-md inline-block" : "",
          highlight ? "text-lg font-bold text-slate-800" : "text-slate-700 font-medium",
          !value ? "text-slate-400 italic" : "",
        ].join(" ")}
      >
        {value ?? "—"}
      </p>
    </div>
  )
}