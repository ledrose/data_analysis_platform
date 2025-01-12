'use client'

import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center space-x-4">
        <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
        <nav>
          <ul className="flex space-x-2">
          <li>
            <Link href="/"><Button variant="ghost">Home</Button></Link>
          </li>
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