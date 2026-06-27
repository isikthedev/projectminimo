import React from "react"

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-6 w-6 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
        M
      </div>
      <span className="font-semibold text-foreground">Minimo</span>
    </div>
  )
}
