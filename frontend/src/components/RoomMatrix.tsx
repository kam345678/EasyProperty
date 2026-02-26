// components/RoomMatrix.tsx
export default function RoomMatrix({ floors, onRoomClick }: { floors: any[], onRoomClick: (room: any) => void }) {
  return (
    <div className="space-y-10 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
      {floors.map((floor) => (
        <div key={floor.floor} className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-slate-100 rounded-full"></div>
          <h4 className="font-black mb-6 text-slate-400 uppercase italic tracking-tighter text-sm">
            Floor {floor.floor}
          </h4>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {floor.rooms.map((room: any) => (
              <button
                key={room._id}
                onClick={() => onRoomClick(room)}
                className={`group relative h-16 rounded-2xl font-black text-lg transition-all active:scale-90 shadow-md flex items-center justify-center overflow-hidden ${
                  room.status === 'available' ? 'bg-emerald-500 text-white hover:bg-emerald-600' :
                  room.status === 'occupied' ? 'bg-rose-500 text-white hover:bg-rose-600' : 
                  'bg-amber-500 text-white hover:bg-amber-600'
                }`}
              >
                <span className="relative z-10">{room.roomNumber}</span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}