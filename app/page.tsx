"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, DollarSign, ArrowRight } from "lucide-react"
import PlayerCard from "@/components/player-card"
import BuyInSheet from "@/components/buy-in-sheet"
import CashOutSheet from "@/components/cash-out-sheet"
import SettlementSheet from "@/components/settlement-sheet"
import { toast } from "@/hooks/use-toast"
import PokerChip from "@/components/poker-chip"

interface Player {
  id: string
  name: string
  buyIns: number[]
  cashOuts: number[]
  active: boolean
}

interface Transaction {
  from: string
  to: string
  amount: number
}

export default function HomePage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [showBuyInSheet, setShowBuyInSheet] = useState(false)
  const [showCashOutSheet, setShowCashOutSheet] = useState(false)
  const [showAddPlayerSheet, setShowAddPlayerSheet] = useState(false)
  const [showSettlementSheet, setShowSettlementSheet] = useState(false)
  const [newPlayerName, setNewPlayerName] = useState("")
  const [totalPot, setTotalPot] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [allCashedOut, setAllCashedOut] = useState(false)

  // Calculate total pot without setting state
  const calculatePotAmount = (playerList: Player[]) => {
    return playerList.reduce((sum, player) => {
      const buyIns = player.buyIns.reduce((total, amount) => total + amount, 0)
      const cashOuts = player.cashOuts.reduce((total, amount) => total + amount, 0)
      return sum + buyIns - cashOuts
    }, 0)
  }

  // Check if all players have cashed out
  useEffect(() => {
    if (players.length === 0) return

    const activePlayersExist = players.some((player) => player.active)
    const remainingPot = calculatePotAmount(players)

    setAllCashedOut(!activePlayersExist && remainingPot === 0)

    if (!activePlayersExist && remainingPot === 0) {
      calculateSettlement()
    }
  }, [players])

  const calculateSettlement = () => {
    // Calculate each player's net position
    const playerBalances = players.map((player) => {
      const totalBuyIn = player.buyIns.reduce((sum, amount) => sum + amount, 0)
      const totalCashOut = player.cashOuts.reduce((sum, amount) => sum + amount, 0)
      return {
        id: player.id,
        name: player.name,
        balance: totalCashOut - totalBuyIn, // positive means they won, negative means they lost
      }
    })

    // Sort by balance (ascending for debtors, descending for creditors)
    const debtors = playerBalances.filter((p) => p.balance < 0).sort((a, b) => a.balance - b.balance)
    const creditors = playerBalances.filter((p) => p.balance > 0).sort((a, b) => b.balance - a.balance)

    const newTransactions: Transaction[] = []

    // Calculate minimum transactions
    let i = 0,
      j = 0
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i]
      const creditor = creditors[j]

      // Amount to transfer is the minimum of what the debtor owes and what the creditor is owed
      const amount = Math.min(Math.abs(debtor.balance), creditor.balance)

      if (amount > 0) {
        newTransactions.push({
          from: debtor.id,
          to: creditor.id,
          amount: Math.round(amount * 100) / 100, // Round to 2 decimal places
        })
      }

      // Update balances
      debtor.balance += amount
      creditor.balance -= amount

      // Move to next player if their balance is settled
      if (Math.abs(debtor.balance) < 0.01) i++
      if (Math.abs(creditor.balance) < 0.01) j++
    }

    setTransactions(newTransactions)
  }

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return

    const newPlayer: Player = {
      id: "player-" + Date.now().toString(),
      name: newPlayerName,
      buyIns: [],
      cashOuts: [],
      active: true,
    }

    const updatedPlayers = [...players, newPlayer]
    setPlayers(updatedPlayers)
    setTotalPot(calculatePotAmount(updatedPlayers))
    setNewPlayerName("")
    setShowAddPlayerSheet(false)

    toast({
      title: "Player added",
      description: `${newPlayerName} has been added to the game`,
    })
  }

  const handleBuyIn = (playerId: string, amount: number) => {
    const updatedPlayers = players.map((player) => {
      if (player.id === playerId) {
        return {
          ...player,
          buyIns: [...player.buyIns, amount],
        }
      }
      return player
    })

    setPlayers(updatedPlayers)
    setTotalPot(calculatePotAmount(updatedPlayers))
    setShowBuyInSheet(false)

    toast({
      title: "Buy-in successful",
      description: `${selectedPlayer?.name} bought in for $${amount}`,
    })
  }

  const handleCashOut = (playerId: string, amount: number) => {
    const updatedPlayers = players.map((player) => {
      if (player.id === playerId) {
        return {
          ...player,
          cashOuts: [...player.cashOuts, amount],
          active: false, // Mark player as inactive after cash out
        }
      }
      return player
    })

    setPlayers(updatedPlayers)
    setTotalPot(calculatePotAmount(updatedPlayers))
    setShowCashOutSheet(false)

    toast({
      title: "Cash-out successful",
      description: `${selectedPlayer?.name} cashed out $${amount}`,
    })
  }

  const getTotalBuyIns = (player: Player) => {
    return player.buyIns.reduce((sum, amount) => sum + amount, 0)
  }

  const getTotalCashOuts = (player: Player) => {
    return player.cashOuts.reduce((sum, amount) => sum + amount, 0)
  }

  const getNetAmount = (player: Player) => {
    return getTotalCashOuts(player) - getTotalBuyIns(player)
  }

  const getPlayerNameById = (id: string) => {
    const player = players.find((p) => p.id === id)
    return player ? player.name : "Unknown"
  }

  // Get active players
  const activePlayers = players.filter((player) => player.active)

  // Get cashed out players
  const cashedOutPlayers = players.filter((player) => !player.active)

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-900 text-gray-100">
      {/* Main Content */}
      <main className="flex-1 px-4 pt-6 pb-4 poker-felt text-white">
        {/* Pot Summary */}
        <div className="bg-[#0a3b1f] p-4 rounded-lg mb-6 shadow-md border border-[#072b16]">
          <div className="text-sm text-gray-400 mb-1">Total Pot</div>
          <div className="text-3xl font-bold text-white flex items-center">
            <PokerChip className="mr-2 h-6 w-6" />${totalPot}
          </div>
        </div>

        {/* Settlement Banner (if all players have cashed out) */}
        {allCashedOut && players.length > 0 && (
          <div
            className="bg-[#0a3b1f] p-3 rounded-lg mb-6 shadow-md border border-[#072b16] flex items-center justify-between cursor-pointer"
            onClick={() => setShowSettlementSheet(true)}
          >
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-400" />
              <span className="font-medium">All players cashed out</span>
            </div>
            <div className="flex items-center text-green-400">
              <span className="mr-1">Settle payments</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        )}

        {/* Active Players Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center text-white">
            <Users className="mr-2 h-5 w-5" /> Active Players
          </h2>
          <Button
            size="sm"
            className="bg-[#0f4c29] hover:bg-[#0a3b1f] text-white shadow-md"
            onClick={() => setShowAddPlayerSheet(true)}
          >
            Add Player
          </Button>
        </div>

        {activePlayers.length === 0 ? (
          <div className="bg-[#0a3b1f] p-4 rounded-lg mb-6 shadow-md border border-[#072b16] text-center">
            <p className="text-gray-400">No active players. Add players to start the game.</p>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {activePlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onBuyIn={() => {
                  setSelectedPlayer(player)
                  setShowBuyInSheet(true)
                }}
                onCashOut={() => {
                  setSelectedPlayer(player)
                  setShowCashOutSheet(true)
                }}
                totalBuyIn={getTotalBuyIns(player)}
              />
            ))}
          </div>
        )}

        {/* Cashed Out Players Section */}
        {cashedOutPlayers.length > 0 && (
          <>
            <div className="flex items-center mb-4 mt-8">
              <h2 className="text-lg font-bold flex items-center text-white">
                <DollarSign className="mr-2 h-5 w-5" /> Cashed Out Players
              </h2>
            </div>

            <div className="space-y-2 bg-[#0a3b1f] p-4 rounded-lg shadow-md border border-[#072b16]">
              {cashedOutPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex justify-between items-center py-3 ${
                    index !== cashedOutPlayers.length - 1 ? "border-b border-gray-700" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3 text-white">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{player.name}</span>
                  </div>
                  <div
                    className={
                      getNetAmount(player) > 0
                        ? "text-green-400 font-medium"
                        : getNetAmount(player) < 0
                          ? "text-red-400 font-medium"
                          : "text-white font-medium"
                    }
                  >
                    {getNetAmount(player) > 0 ? "+" : ""}
                    {getNetAmount(player)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Add Player Sheet */}
      <Sheet open={showAddPlayerSheet} onOpenChange={setShowAddPlayerSheet}>
        <SheetContent side="bottom" className="h-[300px] bg-[#0a3b1f] text-white border-t border-[#072b16]">
          <SheetHeader>
            <SheetTitle className="text-white">Add New Player</SheetTitle>
            <SheetDescription className="text-gray-400">
              Enter the name of the player joining the game.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="playerName" className="text-gray-300">
                Player Name
              </Label>
              <Input
                id="playerName"
                placeholder="Enter player name"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                className="h-12 border-gray-600 text-white bg-[#0f2b1a]"
              />
            </div>
          </div>
          <SheetFooter>
            <Button
              onClick={handleAddPlayer}
              className="w-full h-12 text-base bg-[#0f4c29] hover:bg-[#0a3b1f] text-white shadow-md"
            >
              Add Player
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Buy-in Sheet */}
      <BuyInSheet
        isOpen={showBuyInSheet}
        onClose={() => setShowBuyInSheet(false)}
        onBuyIn={(amount) => {
          if (selectedPlayer) {
            handleBuyIn(selectedPlayer.id, amount)
          }
        }}
        playerName={selectedPlayer?.name || ""}
      />

      {/* Cash-out Sheet */}
      <CashOutSheet
        isOpen={showCashOutSheet}
        onClose={() => setShowCashOutSheet(false)}
        onCashOut={(amount) => {
          if (selectedPlayer) {
            handleCashOut(selectedPlayer.id, amount)
          }
        }}
        playerName={selectedPlayer?.name || ""}
        totalPot={totalPot}
      />

      {/* Settlement Sheet */}
      <SettlementSheet
        isOpen={showSettlementSheet}
        onClose={() => setShowSettlementSheet(false)}
        transactions={transactions}
        getPlayerName={getPlayerNameById}
        players={players}
      />
    </div>
  )
}
