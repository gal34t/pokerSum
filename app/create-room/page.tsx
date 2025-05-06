"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Copy, Check } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import PokerChip from "@/components/poker-chip"

export default function CreateRoom() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [roomName, setRoomName] = useState("")
  const [adminName, setAdminName] = useState("")
  const [buyInAmount, setBuyInAmount] = useState("")
  const [roomCode, setRoomCode] = useState("")
  const [copied, setCopied] = useState(false)

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault()

    // Generate a random room code
    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomCode(generatedCode)

    // Move to the success step
    setStep(2)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "Room code has been copied to clipboard",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const handleEnterRoom = () => {
    router.push(`/room/${roomCode}?admin=true&name=${encodeURIComponent(adminName)}`)
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
          {step === 1 ? "Create Room" : "Room Created"}
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        {step === 1 ? (
          <form onSubmit={handleCreateRoom} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="roomName" className="text-gray-700">
                Room Name
              </Label>
              <Input
                id="roomName"
                placeholder="Friday Night Poker"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
                className="h-12 border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminName" className="text-gray-700">
                Your Name (Admin)
              </Label>
              <Input
                id="adminName"
                placeholder="Your name"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                required
                className="h-12 border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyInAmount" className="text-gray-700">
                Default Buy-in Amount ($)
              </Label>
              <Input
                id="buyInAmount"
                type="number"
                placeholder="20"
                value={buyInAmount}
                onChange={(e) => setBuyInAmount(e.target.value)}
                required
                min="1"
                className="h-12 border-gray-300"
              />
            </div>

            <Button type="submit" className="w-full h-12 text-base bg-[#0f4c29] hover:bg-[#0a3b1f] shadow-md mt-6">
              Create Room
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col items-center py-6">
              <div className="text-5xl font-bold tracking-wider mb-2 text-[#0f4c29]">{roomCode}</div>
              <p className="text-gray-600">Room code</p>
            </div>

            <div className="bg-[#e6f0eb] p-4 rounded-lg">
              <h3 className="font-medium mb-3 text-gray-900">Room Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Name:</span>
                  <span className="font-medium">{roomName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Admin:</span>
                  <span className="font-medium">{adminName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Buy-in Amount:</span>
                  <span className="font-medium">${buyInAmount}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCopyCode}
              variant="outline"
              className="w-full h-12 text-base border-[#0f4c29] text-[#0f4c29] hover:bg-[#e6f0eb] shadow-sm flex items-center justify-center"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-5 w-5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-5 w-5" /> Copy Room Code
                </>
              )}
            </Button>

            <Button
              onClick={handleEnterRoom}
              className="w-full h-12 text-base bg-[#0f4c29] hover:bg-[#0a3b1f] shadow-md"
            >
              Enter Room
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
