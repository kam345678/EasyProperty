"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  getAllContracts,
  deleteContract,
} from "@/services/contracts.service"
import ModalAlert from "@/components/ModalAlert"

export default function ContractsPage() {
  const router = useRouter()

  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("info")
  const [alertMessage, setAlertMessage] = useState("")
  const [alertConfirmAction, setAlertConfirmAction] = useState<(() => void) | undefined>(undefined)

  const fetchContracts = async () => {
    try {
      setLoading(true)
      const data = await getAllContracts()
      setContracts(data)
    } catch (err: any) {
      console.error(err)
      setError("Failed to load contracts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContracts()
  }, [])

  const handleView = (id: string) => {
    router.push(`/admin/Contracts/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/Contracts/${id}?edit=true`)
  }

  const handleDelete = (id: string) => {
    setAlertType("info")
    setAlertMessage("Are you sure you want to delete this contract?")
    setAlertConfirmAction(() => async () => {
      try {
        await deleteContract(id)
        await fetchContracts()
        setAlertType("success")
        setAlertMessage("Contract deleted successfully")
        setAlertConfirmAction(undefined)
      } catch (err) {
        console.error("Delete failed", err)
        setAlertType("error")
        setAlertMessage("Failed to delete contract")
        setAlertConfirmAction(undefined)
      }
    })
    setAlertOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Contracts Management</h1>
          <button
            onClick={() => router.push("/admin/Register")}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition"
          >
            + Create Contract
          </button>
        </div>

        {loading && (
          <div className="text-center py-10 font-semibold">Loading contracts...</div>
        )}

        {error && (
          <div className="text-center py-10 text-red-500 font-semibold">{error}</div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-600 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4">Room</th>
                  <th className="px-6 py-4">Tenant</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Start Date</th>
                  <th className="px-6 py-4">End Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr
                    key={contract._id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4 font-medium">
                      {contract?.roomId?.roomNumber || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {contract?.tenantId?.profile?.fullName || "-"}
                    </td>
                    <td className="px-6 py-4 capitalize">
                      {contract.type}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(contract.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(contract.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-200">
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => handleView(contract._id)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-500"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(contract._id)}
                        className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(contract._id)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ModalAlert
        open={alertOpen}
        type={alertType}
        message={alertMessage}
        onClose={() => {
          setAlertOpen(false)
          setAlertConfirmAction(undefined)
        }}
        onConfirm={alertConfirmAction}
      />
    </div>
  )
}