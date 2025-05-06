"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DollarSign } from "lucide-react"
import PokerChip from "./poker-chip"

interface Player {
  id: string
  name: string
  buyIns: number[]
  cashOuts: number[]
  active: boolean
}

interface PlayerCardProps {
  player: Player
  onBuyIn: () => void
  onCashOut: () => void
  totalBuyIn: number
}

export default function PlayerCard({ player, onBuyIn, onCashOut, totalBuyIn }: PlayerCardProps) {
  return (
    <Card className="bg-[#0a3b1f] shadow-md border-[#072b16]">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-1">
            <div className="w-10 h-10 rounded-full bg-[#072b16] flex items-center justify-center mr-3 text-white">
              {player.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="font-medium text-white flex items-center">{player.name}</div>
              <div className="text-sm text-gray-400 mt-1">
                Total Buy-in: <span className="text-white font-medium">${totalBuyIn}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-green-500 text-green-400 hover:bg-green-900 h-10 w-10 p-0 rounded-full shadow-sm"
              onClick={onBuyIn}
            >
              <PokerChip className="h-5 w-5" />
              <span className="sr-only">Buy In</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-900 h-10 w-10 p-0 rounded-full shadow-sm"
              onClick={onCashOut}
            >
              <DollarSign className="h-5 w-5" />
              <span className="sr-only">Cash Out</span>
            </Button>
          </div>
        </div>

        {player.buyIns.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {player.buyIns.map((amount, index) => (
              <div key={index} className="bg-[#0f4c29] px-3 py-1 rounded-full flex items-center">
                <PokerChip className="h-4 w-4 mr-1 text-green-400" />
                <span className="text-white text-sm font-medium">${amount}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
