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

interface CashOutModalProps {
  isOpen: boolean
  onClose: () => void
  onCashOut: (amount: number) => void
  playerName: string
  maxAmount: number
}

export default function CashOutModal({ isOpen, onClose, onCashOut, playerName, maxAmount }: CashOutModalProps) {
  const [amount, setAmount] = useState(maxAmount.toString())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cashOutAmount = Number.parseFloat(amount)
    if (cashOutAmount > 0 && cashOutAmount <= maxAmount) {
      onCashOut(cashOutAmount)
      setAmount("0") // Reset
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-0 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Cash Out</DialogTitle>
          <DialogDescription className="text-gray-600">
            Enter the amount {playerName} wants to cash out.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cashOutAmount" className="text-gray-700">
                Amount ($)
              </Label>
              <Input
                id="cashOutAmount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                max={maxAmount}
                step="1"
                className="border-gray-300"
              />
              <p className="text-xs text-gray-500">Maximum available: ${maxAmount}</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              disabled={maxAmount <= 0}
            >
              Cash Out
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
