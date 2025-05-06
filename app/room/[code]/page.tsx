"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Users, Copy, Menu, Home, DollarSign, ArrowRight } from "lucide-react"
import Link from "next/link"
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
  isAdmin?: boolean
}

interface Transaction {
  from: string
  to: string
  amount: number
}

export default function RoomPage({ params }: { params: { code: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isAdmin = searchParams.get("admin") === "true"
  const playerName = searchParams.get("name") || "Player"

  // Use useRef to create a stable player ID that doesn't change on re-renders
  const currentPlayerIdRef = useRef(`player-${Date.now()}`)
  const currentPlayerId = currentPlayerIdRef.current

  const [players, setPlayers] = useState<Player[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [showBuyInSheet, setShowBuyInSheet] = useState(false)
  const [showCashOutSheet, setShowCashOutSheet] = useState(false)
  const [showAddPlayerSheet, setShowAddPlayerSheet] = useState(false)
  const [showSettlementSheet, setShowSettlementSheet] = useState(false)
  const [newPlayerName, setNewPlayerName] = useState("")
  const [showMenu, setShowMenu] = useState(false)
  const [totalPot, setTotalPot] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
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

  // Initialize room with current player
  useEffect(() => {
    // Only run this effect once
    if (isInitialized) return

    const currentPlayer: Player = {
      id: currentPlayerId,
      name: playerName,
      buyIns: [],
      cashOuts: [],
      isAdmin,
    }

    // In a real app, you would fetch existing players from a database
    // For demo purposes, we'll add some sample players if the user is not an admin
    let initialPlayers = [currentPlayer]

    if (!isAdmin) {
      initialPlayers = [
        ...initialPlayers,
        {
          id: "admin-1",
          name: "Admin",
          buyIns: [20],
          cashOuts: [],
          isAdmin: true,
        },
        {
          id: "player-2",
          name: "John",
          buyIns: [20],
          cashOuts: [],
        },
        {
          id: "player-3",
          name: "Sarah",
          buyIns: [20, 10],
          cashOuts: [15],
        },
      ]
    }

    setPlayers(initialPlayers)
    setTotalPot(calculatePotAmount(initialPlayers))
    setIsInitialized(true)
  }, [playerName, isAdmin, currentPlayerId, isInitialized])

  // Check if all players have cashed out
  useEffect(() => {
    if (players.length === 0) return

    const everyPlayerHasCashedOut = players.every((player) => {
      const totalBuyIn = player.buyIns.reduce((sum, amount) => sum + amount, 0)
      const totalCashOut = player.cashOuts.reduce((sum, amount) => sum + amount, 0)
      return totalCashOut > 0 || totalBuyIn === 0
    })

    const remainingPot = calculatePotAmount(players)

    setAllCashedOut(everyPlayerHasCashedOut && remainingPot === 0)

    if (everyPlayerHasCashedOut && remainingPot === 0 && isAdmin) {
      calculateSettlement()
    }
  }, [players, isAdmin])

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

  const getCurrentStack = (player: Player) => {
    return getTotalBuyIns(player) - getTotalCashOuts(player)
  }

  const getNetAmount = (player: Player) => {
    return getTotalCashOuts(player) - getTotalBuyIns(player)
  }

  const canControlPlayer = (player: Player) => {
    return isAdmin || player.id === currentPlayerId
  }

  const copyRoomCode = () => {
    navigator.clipboard.writeText(params.code)
    toast({
      title: "Copied to clipboard",
      description: "Room code has been copied to clipboard",
    })
  }

  const getPlayerNameById = (id: string) => {
    const player = players.find((p) => p.id === id)
    return player ? player.name : "Unknown"
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-white">
      {/* App Header */}
      <header className="sticky top-0 z-10 bg-[#0f4c29] text-white p-4 flex items-center">
        <Sheet open={showMenu} onOpenChange={setShowMenu}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-[#0a3b1f] h-8 w-8 p-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] sm:w-[300px]">
            <SheetHeader>
              <SheetTitle className="flex items-center">
                <PokerChip className="mr-2 h-5 w-5" /> Poker Night
              </SheetTitle>
              <SheetDescription>Room: {params.code}</SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-[#0f4c29]">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <div
                className="flex items-center space-x-2 text-gray-700 hover:text-[#0f4c29] cursor-pointer"
                onClick={copyRoomCode}
              >
                <Copy className="h-5 w-5" />
                <span>Copy Room Code</span>
              </div>
              {isAdmin && allCashedOut && (
                <div
                  className="flex items-center space-x-2 text-gray-700 hover:text-[#0f4c29] cursor-pointer"
                  onClick={() => setShowSettlementSheet(true)}
                >
                  <DollarSign className="h-5 w-5" />
                  <span>Settle Payments</span>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <h1 className="text-xl font-bold text-center flex-1 flex items-center justify-center">
          <PokerChip className="mr-2 h-5 w-5" /> Room {params.code}
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 poker-felt text-white">
        {/* Pot Summary */}
        <div className="bg-[#0a3b1f] p-4 rounded-lg mb-6 shadow-md border border-[#0d4023]">
          <div className="text-sm text-gray-300 mb-1">Total Pot</div>
          <div className="text-3xl font-bold text-white flex items-center">
            <PokerChip className="mr-2 h-6 w-6" />${totalPot}
          </div>
        </div>

        {/* Settlement Banner (if all players have cashed out) */}
        {isAdmin && allCashedOut && (
          <div
            className="bg-[#0a3b1f] p-3 rounded-lg mb-6 shadow-md border border-[#0d4023] flex items-center justify-between cursor-pointer"
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

        {/* Players Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center text-white">
            <Users className="mr-2 h-5 w-5" /> Players
          </h2>
          {isAdmin && (
            <Sheet open={showAddPlayerSheet} onOpenChange={setShowAddPlayerSheet}>
              <SheetTrigger asChild>
                <Button size="sm" className="bg-[#0a3b1f] hover:bg-[#072b16] text-white shadow-sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Player
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[300px]">
                <SheetHeader>
                  <SheetTitle>Add New Player</SheetTitle>
                  <SheetDescription>Enter the name of the player joining the game.</SheetDescription>
                </SheetHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="playerName" className="text-gray-700">
                      Player Name
                    </Label>
                    <Input
                      id="playerName"
                      placeholder="Enter player name"
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      className="h-12 border-gray-300"
                    />
                  </div>
                </div>
                <SheetFooter>
                  <Button
                    onClick={handleAddPlayer}
                    className="w-full h-12 text-base bg-[#0f4c29] hover:bg-[#0a3b1f] shadow-md"
                  >
                    Add Player
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          )}
        </div>

        <div className="space-y-4 mb-6">
          {players.map((player) => (
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
              isAdmin={isAdmin}
              canControl={canControlPlayer(player)}
              currentStack={getCurrentStack(player)}
              currentPlayerId={currentPlayerId}
            />
          ))}
        </div>

        {/* Player Balances */}
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-3 text-white">Player Balances</h3>
          <div className="space-y-2 bg-[#0a3b1f] p-4 rounded-lg shadow-md border border-[#0d4023]">
            {players.map((player) => (
              <div key={player.id} className="flex justify-between items-center py-3 border-b border-[#0d4023]">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#e6f0eb] flex items-center justify-center mr-3 text-[#0f4c29]">
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
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 bg-[#0a3b1f] border-t border-[#0d4023] p-4 flex justify-between items-center text-white">
        <Link href="/" className="text-white flex flex-col items-center">
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Button
          onClick={copyRoomCode}
          variant="ghost"
          className="text-white flex flex-col items-center h-auto py-1 hover:bg-[#072b16]"
        >
          <Copy className="h-6 w-6" />
          <span className="text-xs mt-1">Share</span>
        </Button>

        {isAdmin && (
          <Button
            onClick={() => setShowAddPlayerSheet(true)}
            variant="ghost"
            className="text-white flex flex-col items-center h-auto py-1 hover:bg-[#072b16]"
          >
            <Plus className="h-6 w-6" />
            <span className="text-xs mt-1">Add</span>
          </Button>
        )}

        {isAdmin && allCashedOut ? (
          <Button
            onClick={() => setShowSettlementSheet(true)}
            variant="ghost"
            className="text-white flex flex-col items-center h-auto py-1 hover:bg-[#072b16]"
          >
            <DollarSign className="h-6 w-6" />
            <span className="text-xs mt-1">Settle</span>
          </Button>
        ) : (
          <Button variant="ghost" className="text-white flex flex-col items-center h-auto py-1 hover:bg-[#072b16]">
            <PokerChip className="h-6 w-6" />
            <span className="text-xs mt-1">Pot: ${totalPot}</span>
          </Button>
        )}
      </div>

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
