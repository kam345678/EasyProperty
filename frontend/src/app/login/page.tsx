"use client"

import Image from "next/image"
import { useState, ChangeEvent, FormEvent } from "react"
import { signIn } from "@/lib/api";
import { getProfile } from "@/lib/auth";

export default function Home() {
  const [mode, setMode] = useState<"login"| "forgot">("login")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e?: FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    try {
      const data = await signIn({ email, password });
      console.log("Login success:", data);

      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);

      const user = await getProfile();
      console.log("Profile:", user);


      if (user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/tenant/dashboard";
      }

    } catch (err:any) {
      console.error("ERROR:", err);
      setError(err?.message || "Login failed");
    }
  }
  return (
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

                  <form className="space-y-5" onSubmit={handleLogin}>
                    <Input placeholder="Email" onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                    <Input placeholder="Password" type="password" onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
                    {error && (
                      <p className="text-red-500 text-sm text-left -mt-2">
                        {error}
                      </p>
                    )}

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
  )
}

/* Reusable Components */

function Input({ placeholder, type = "text", onChange }: { placeholder: string; type?: string; onChange?: (e: ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full rounded-xl border border-slate-200 px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
    />
  )
}

function Button({ text, onClick }: { text: string; onClick?: () => void }) {
  return (
    <button
      type="submit"
      onClick={onClick}
      className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white py-3.5 font-bold transition-all shadow-lg shadow-slate-200"
    >
      {text}
    </button>
  )
}