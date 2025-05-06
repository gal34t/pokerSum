"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { DollarSign } from "lucide-react"

interface CashOutSheetProps {
  isOpen: boolean
  onClose: () => void
  onCashOut: (amount: number) => void
  playerName: string
  totalPot: number
}

export default function CashOutSheet({ isOpen, onClose, onCashOut, playerName, totalPot }: CashOutSheetProps) {
  const [amount, setAmount] = useState("0")

  useEffect(() => {
    if (isOpen) {
      // Default to half the pot as a starting point
      setAmount(Math.floor(totalPot / 2).toString())
    }
  }, [isOpen, totalPot])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cashOutAmount = Number.parseFloat(amount)
    if (cashOutAmount >= 0 && cashOutAmount <= totalPot) {
      onCashOut(cashOutAmount)
    }
  }

  const handleSliderChange = (value: number[]) => {
    setAmount(value[0].toString())
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[350px] bg-[#0a3b1f] text-white border-t border-[#072b16]">
        <SheetHeader>
          <SheetTitle className="flex items-center text-white">
            <DollarSign className="mr-2 h-5 w-5" /> Cash Out
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            Enter the amount {playerName} wants to cash out.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cashOutAmount" className="text-gray-300">
                Amount ($)
              </Label>
              <Input
                id="cashOutAmount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                max={totalPot}
                step="1"
                className="h-12 bg-[#072b16] border-[#0f4c29] text-white text-center text-xl"
              />

              <div className="pt-4">
                <Slider
                  defaultValue={[0]}
                  max={totalPot}
                  step={1}
                  value={[Number(amount)]}
                  onValueChange={handleSliderChange}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$0</span>
                  <span>Total Pot: ${totalPot}</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                You can cash out any amount from $0 (lose everything) up to ${totalPot} (win everything)
              </p>
            </div>
          </div>
          <SheetFooter>
            <Button
              type="submit"
              className="w-full h-12 text-base bg-[#0f4c29] hover:bg-[#0a3b1f] text-white shadow-md"
            >
              Cash Out
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
