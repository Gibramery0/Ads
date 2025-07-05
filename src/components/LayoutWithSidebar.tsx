"use client"

import { useState } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"
import { cn } from "@/lib/utils"

interface LayoutWithSidebarProps {
  children: React.ReactNode
}

export default function LayoutWithSidebar({ children }: LayoutWithSidebarProps) {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header onSidebarToggle={toggleSidebar} />
      
      <div className="flex flex-1">
        <Sidebar
          isHidden={isSidebarHidden}
          onToggle={toggleSidebar}
        />

        <main className={cn(
          "flex-1 transition-all duration-150",
          isSidebarHidden ? "ml-0" : "ml-12"
        )}>
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
