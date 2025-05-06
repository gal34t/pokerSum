"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import PokerChip from "@/components/poker-chip"

export default function JoinRoom() {
  const router = useRouter()
  const [roomCode, setRoomCode] = useState("")
  const [playerName, setPlayerName] = useState("")
  const [isJoining, setIsJoining] = useState(false)

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault()
    setIsJoining(true)

    // In a real app, you would validate the room code against a database
    // For now, we'll just navigate to the room page
    setTimeout(() => {
      router.push(`/room/${roomCode}?name=${encodeURIComponent(playerName)}`)
    }, 1000)
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-white">
      {/* App Header */}
      <header className="sticky top-0 z-10 bg-[#0f4c29] text-white p-4 flex items-center">
        <Link href="/" className="text-white">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold text-center flex-1 flex items-center justify-center">
          <PokerChip className="mr-2 h-5 w-5" />
          Join Room
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        <form onSubmit={handleJoinRoom} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="roomCode" className="text-gray-700">
              Room Code
            </Label>
            <Input
              id="roomCode"
              placeholder="Enter 6-digit code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              required
              maxLength={6}
              className="h-12 border-gray-300 uppercase text-center text-xl tracking-wider"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="playerName" className="text-gray-700">
              Your Name
            </Label>
            <Input
              id="playerName"
              placeholder="Your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required
              className="h-12 border-gray-300"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base bg-[#0f4c29] hover:bg-[#0a3b1f] shadow-md mt-6"
            disabled={isJoining || !roomCode || !playerName}
          >
            {isJoining ? "Joining..." : "Join Room"}
          </Button>
        </form>
      </main>
    </div>
  )
}
