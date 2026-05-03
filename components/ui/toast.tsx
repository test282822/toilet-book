"use client"

import * as React from "react"
import { Toaster as HotToaster } from "react-hot-toast"

export function Toaster() {
  return (
    <HotToaster
      position="bottom-right"
      toastOptions={{
        className: "",
        style: {
          background: "white",
          color: "#1e293b",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 40px -5px rgba(0,0,0,0.12), 0 4px 20px -5px rgba(0,0,0,0.08)",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: 500,
        },
        success: {
          iconTheme: {
            primary: "#0ea5e9",
            secondary: "white",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "white",
          },
        },
      }}
    />
  )
}
