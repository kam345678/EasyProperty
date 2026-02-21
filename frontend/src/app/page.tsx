<<<<<<< HEAD
"use client"

import Image from "next/image"
import { useState } from "react"
import { AuthProvider } from "@/context/AuthContext"

export default function Home() {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login")

  return (
    <AuthProvider>
      <div className="flex h-screen min-h-screen bg-white">

        {/* LEFT SIDE */}
        <div className="w-1/2 h-screen bg-slate-50 px-10 sm:px-16 py-12 flex flex-col">

          {/* Logo - อยู่บนสุด */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold overflow-hidden">
              <Image
                src="/gemini.png"
                alt="Logo"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <span className="text-lg font-semibold">EasyProperty</span>
          </div>

          {/* MAIN CONTENT - ส่วนนี้จะดันให้เนื้อหาอยู่กึ่งกลางพอดี */}
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-md w-full">
              {/* LOGIN MODE */}
              {mode === "login" && (
                <div className="w-full transition-all text-center">
                  <h2 className="text-3xl font-bold mb-2">ยินดีต้อนรับ!</h2>
                  <p className="text-slate-500 mb-8 font-medium">
                    ป้อนข้อมูลประจำตัวของคุณเพื่อเข้าสู่ระบบ
                  </p>

                  <form className="space-y-5">
                    <Input placeholder="Email" />
                    <Input placeholder="Password" type="password" />

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                        <input type="checkbox" className="rounded border-slate-300" />
                        จดจำฉัน
                      </label>
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        ลืมรหัสผ่าน?
                      </button>
                    </div>

                    <Button text="Confirm" />
                  </form>

                  <div className="mt-6 text-sm text-slate-600">
                    ยังไม่มีบัญชี?{" "}
                    <button
                      onClick={() => setMode("register")}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      สมัครสมาชิก
                    </button>
                  </div>
                </div>
              )}

              {/* REGISTER MODE */}
              {mode === "register" && (
                <div className="w-full transition-all">
                  <h2 className="text-3xl font-bold mb-2 text-center">สร้างบัญชี!</h2>
                  <p className="text-slate-500 mb-8 font-medium text-center">
                    เราจะช่วยคุณจัดการบัญชีของคุณอย่างมีประสิทธิภาพ
                  </p>

                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="First name" />
                      <Input placeholder="Last name" />
                    </div>
                    <Input placeholder="Email address" />
                    <Input placeholder="Create password" type="password" />
                    <Input placeholder="Phone number" />
                    <Button text="Confirm" />
                  </form>

                  <div className="mt-6 text-sm text-slate-600">
                    มีบัญชีอยู่แล้ว?{" "}
                    <button
                      onClick={() => setMode("login")}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      เข้าสู่ระบบ
                    </button>
                  </div>
                </div>
              )}

              {/* FORGOT MODE */}
              {mode === "forgot" && (
                <div className="w-full transition-all">
                  <h2 className="text-3xl font-bold mb-2 text-center">ลืมรหัสผ่าน!</h2>
                  <p className="text-slate-500 mb-8 font-medium text-center">
                    ไม่ต้องห่วง! กรอกอีเมลของคุณเพื่อรีเซ็ตรหัสผ่าน
                  </p>

                  <form className="space-y-4">
                    <Input placeholder="Email" />
                    <Button text="Confirm" />
                  </form>

                  <div className="mt-6 text-sm text-center">
                    <button
                      onClick={() => setMode("login")}
                      className="text-blue-600 font-bold hover:underline "
                    >
                      กลับเข้าสู่ระบบ
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer - อยู่ล่างสุด */}
          <div className="text-xs text-slate-400 mt-8 pt-4 border-t border-slate-200">
            © 2026 EasyProperty • Property Management System
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="w-1/2 h-screen relative overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format&fit=crop"
            alt="Modern House"
            fill
            className="object-cover scale-105 hover:scale-100 transition-transform duration-700"
            priority
          />
          {/* Overlay จางๆ ให้ภาพดูหรูขึ้น */}
          <div className="absolute inset-0 bg-blue-900/10 shadow-inner"></div>
        </div>

      </div>
    </AuthProvider>
  )
}

/* Reusable Components */

function Input({ placeholder, type = "text" }: any) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
    />
  )
}

function Button({ text }: any) {
  return (
    <button
      type="button"
      className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white py-3.5 font-bold transition-all shadow-lg shadow-slate-200"
    >
      {text}
    </button>
  )
=======
import "../styles/globals.css";
export default function HomePage() {
    return (   
       <div className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-violet-500">
            <h1 className="text-2xl font-bold text-white">Welcome to the Home Page</h1>
       </div>
    );
>>>>>>> 756f3ace5007c52251664ca907f92b20e68a6cb3
}