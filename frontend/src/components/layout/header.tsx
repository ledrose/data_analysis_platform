'use client'

import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center space-x-4">
        <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
        <nav>
          <ul className="flex space-x-2">
            <li><Button variant="ghost">Dashboard</Button></li>
            <li><Button variant="ghost">Datasets</Button></li>
            <li><Button variant="ghost">Analysis</Button></li>
          </ul>
        </nav>
      </div>
      <div className="flex items-center space-x-2">
        <span>ledrose</span>
        <UserCircle className="h-8 w-8" />
      </div>
    </header>
  )
}