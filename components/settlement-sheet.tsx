"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ArrowRight, Check, DollarSign } from "lucide-react"
import { useState } from "react"

interface Transaction {
  from: string
  to: string
  amount: number
}

interface Player {
  id: string
  name: string
  buyIns: number[]
  cashOuts: number[]
  active: boolean
}

interface SettlementSheetProps {
  isOpen: boolean
  onClose: () => void
  transactions: Transaction[]
  getPlayerName: (id: string) => string
  players: Player[]
}

export default function SettlementSheet({
  isOpen,
  onClose,
  transactions,
  getPlayerName,
  players,
}: SettlementSheetProps) {

  // Calculate player summaries
  const playerSummary = players.reduce(
    (acc, player) => {
      const totalBuyIn = player.buyIns.reduce((sum, amount) => sum + amount, 0)
      const totalCashOut = player.cashOuts.reduce((sum, amount) => sum + amount, 0)
      const netAmount = totalCashOut - totalBuyIn

      acc[player.id] = {
        name: player.name,
        netAmount,
        status: netAmount > 0 ? "winner" : netAmount < 0 ? "loser" : "even",
      }

      return acc
    },
    {} as Record<string, { name: string; netAmount: number; status: string }>,
  )

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[90vh] sm:h-[80vh] overflow-y-auto bg-gray-900 text-white border-t border-[#072b16]"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center justify-center text-xl text-white">
            <DollarSign className="mr-2 h-5 w-5 text-green-400" /> Settlement
          </SheetTitle>
        </SheetHeader>

        <div className="py-4">
          {/* Game Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-center text-white">Game Summary</h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(playerSummary).map((player, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-center ${
                    player.status === "winner"
                      ? "bg-[#0f4c29] border border-[#0a3b1f]"
                      : player.status === "loser"
                        ? "bg-red-800 border border-red-900"
                        : "bg-[#1e3a8a] border border-[#1e3a8a]/70" // Blue for even players
                  }`}
                >
                  <div className="font-medium mb-1 text-white">{player.name}</div>
                  <div
                    className={`text-sm ${
                      player.status === "winner"
                        ? "text-green-400"
                        : player.status === "loser"
                          ? "text-red-400"
                          : "text-blue-300" // Blue text for even players
                    }`}
                  >
                    {player.netAmount > 0 ? "+" : ""}
                    {player.netAmount}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optimal Transfers */}
          <h3 className="text-lg font-medium mb-3 text-center text-white">Optimal Transfers</h3>

          {transactions.length === 0 ? (
            <div className="text-center text-gray-400 py-4">No transfers needed. Everyone is even!</div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <div
                  key={index}
                  className={"p-4 rounded-lg border bg-gray-800 border-gray-700 flex items-center justify-between"}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-red-900 flex items-center justify-center text-red-400 mr-2">
                      {getPlayerName(transaction.from).charAt(0)}
                    </div>
                    <div className="font-medium text-white">{getPlayerName(transaction.from)}</div>
                  </div>

                  <div className="flex items-center">
                    <ArrowRight className="h-5 w-5 text-gray-400 mx-2" />
                    <div className="bg-[#0f4c29] text-white px-3 py-1 rounded-full text-sm font-medium">
                      ${transaction.amount}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="font-medium text-white mr-2">{getPlayerName(transaction.to)}</div>
                    <div className="w-8 h-8 rounded-full bg-green-900 flex items-center justify-center text-green-400">
                      {getPlayerName(transaction.to).charAt(0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
