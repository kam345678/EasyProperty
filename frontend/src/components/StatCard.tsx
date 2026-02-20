export default function StatCard({
  title,
  value,
  borderColor,
}: {
  title: string
  value: string
  borderColor: string
}) {
  return (
    <div className={`bg-white p-5 rounded-xl shadow border-l-4 ${borderColor}`}>
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  )
}