"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PokerChip from "./poker-chip"

interface BuyInSheetProps {
  isOpen: boolean
  onClose: () => void
  onBuyIn: (amount: number) => void
  playerName: string
}

export default function BuyInSheet({ isOpen, onClose, onBuyIn, playerName }: BuyInSheetProps) {
  const [amount, setAmount] = useState("20")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const buyInAmount = Number.parseFloat(amount)
    if (buyInAmount > 0) {
      onBuyIn(buyInAmount)
      setAmount("20") // Reset to default
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[300px] bg-[#0a3b1f] text-white border-t border-[#072b16]">
        <SheetHeader>
          <SheetTitle className="flex items-center text-white">
            <PokerChip className="mr-2 h-5 w-5" /> Buy In
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            Enter the amount {playerName} wants to buy in for.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="buyInAmount" className="text-gray-300">
                Amount ($)
              </Label>
              <Input
                id="buyInAmount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="1"
                className="h-12 bg-[#072b16] border-[#0f4c29] text-white text-center text-xl"
              />
            </div>
          </div>
          <SheetFooter>
            <Button
              type="submit"
              className="w-full h-12 text-base bg-[#0f4c29] hover:bg-[#0a3b1f] text-white shadow-md"
            >
              Buy In
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
