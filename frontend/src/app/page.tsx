<<<<<<< HEAD
"use client"

import Image from "next/image"
import { useState } from "react"
import { AuthProvider } from "@/context/AuthContext"
=======
import { redirect } from "next/navigation";
>>>>>>> be3c3665f72b6d9f45a97345e9ddd33bbe4f7de7

export default function Home() {
  redirect("/login");
}
<<<<<<< HEAD

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
}
=======
>>>>>>> be3c3665f72b6d9f45a97345e9ddd33bbe4f7de7
