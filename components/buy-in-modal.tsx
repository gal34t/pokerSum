"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BuyInModalProps {
  isOpen: boolean
  onClose: () => void
  onBuyIn: (amount: number) => void
  playerName: string
}

export default function BuyInModal({ isOpen, onClose, onBuyIn, playerName }: BuyInModalProps) {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-0 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Buy In</DialogTitle>
          <DialogDescription className="text-gray-600">
            Enter the amount {playerName} wants to buy in for.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="buyInAmount" className="text-gray-700">
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
                className="border-gray-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              Buy In
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
