"use client";
import React, {useState} from "react";
import {MinefieldConfig} from "@/app/_components/Minefield/MinefieldConfig";
import {MinefieldGameStartModel} from "@/app/_components/Minefield/Models/MinefieldGameStartModel";
import {useAuthentication} from "@/app/feature/authentication/AuthenticationProviderHook";
import {ApiClient} from "@/app/feature/http/ApiClient";
import {MineBetResponse} from "@/app/_components/Minefield/Models/MineBetResponse";
import {MinefieldGrid} from "@/app/_components/Minefield/MinefieldGrid";
import {ClickMineResponse} from "@/app/_components/Minefield/Models/ClickMineResponse";
import {MinefieldCashoutResponse} from "@/app/_components/Minefield/Models/MinefieldCashoutResponse";

export function MinefieldContainer() {

  const {user, modifyBalance} = useAuthentication();
  const [bombCount, setBombCount] = useState<number>(1);
  const [recentBetAmount, setRecentBetAmount] = useState<number>(1);
  const [gameId, setGameId] = useState<string | null>(null);
  const [configError, setConfigError] = useState(null);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [fields, setFields] = useState<boolean[]>([]);

  // Computed values
  const gameStarted = gameId !== null;
  const gameLost = Array.from(revealed).some(index => fields[index]);
  const gameFinished = fields.filter(item => item !== undefined).length === 25;
  const revealedCount = revealed ? revealed.size : 0;

  const [previousBetAmount, setPreviousBetAmount] = useState<number>(1);
  const [previousBombCount, setPreviousBombCount] = useState<number>(1);


  const handleStartGame = async (startModel: MinefieldGameStartModel) => {
    resetGame();
    try {
      const startNewGame = await ApiClient.post<MineBetResponse>('/games/minefield', {
        bombCount: startModel.bombCount,
        betAmount: startModel.betAmount,
      });
      setBombCount(startModel.bombCount);
      setRecentBetAmount(startModel.betAmount);

      setPreviousBetAmount(startModel.betAmount);
      setPreviousBombCount(startModel.bombCount);

      modifyBalance(startNewGame.currentBalance);
      setGameId(startNewGame.gameId);
    } catch(error) {
      // @ts-ignore
      setConfigError(error.data.error);
    }
  }

  const resetGame = () => {
    setGameId(null);
    setConfigError(null);
    setFields([]);
    setRevealed(new Set());

    setPreviousBombCount(0);
    setPreviousBetAmount(0);
  }

  const handleCashout = async () => {
    try {

      const result = await ApiClient.post<MinefieldCashoutResponse>('/games/minefield/cashout', {
        gameId: gameId,
      });

      setFields(result.fields);
      modifyBalance(result.newBalance);
      setGameId(null);

    } catch (e) {

    }
  }


  // what happens when we click the tile
  const handleClickTile = async (position: number) => {

    if (!gameStarted) {
      // TODO: maybe an error

    }

    try {
      const result = await ApiClient.post<ClickMineResponse>('/games/minefield/click', {
        gameId: gameId,
        position: position,
      });

      setRevealed(prevRevealed => {
        const newRevealed = new Set(prevRevealed);
        newRevealed.add(result.flaggedPosition);
        return newRevealed;
      });

      if (!result.success && result.field !== null) {
        setFields(prevState => {
          return result.field!;
        });
        setGameId(prevState => {
          return null;
        });
        const audio = new Audio("/assets/audio/mine-audio.mp3");
        await audio.play();
        return;
      }


      if (!result.success) {
        return;
      }

      setFields(prevFields => {
        const newFields = [...prevFields];
        newFields[result.flaggedPosition] = false; // The position is safe (not a bomb)
        return newFields;
      });

      const audio = new Audio("/assets/audio/win-audio.mp3");
      await audio.play();


    } catch (err) {

    }
  }

  function calculateProfit(): number {
    if (revealedCount === 0) {
      return 0;
    }

    const multiplier = calculateMinesMultiplier(previousBombCount, revealedCount);
    const profit = recentBetAmount * (multiplier - 1);
    return profit;
  }


  return(

    <div className="flex flex-col md:flex-row w-full bg-background text-white rounded-lg">
      {/* Configuration Panel */}
      <div className="w-full md:w-[380px] p-6 bg-primary rounded-l-lg border-r border-gray-800">
        <MinefieldConfig
          gameStarted={gameStarted}
          setBetAmount={setRecentBetAmount}
          betAmount={recentBetAmount}
          bombCount={bombCount}
          setBombCount={setBombCount}
          handleClickBet={handleStartGame}
          handleCashout={handleCashout}
          payout={ calculateProfit() }
        />
      </div>


      <div className="flex-1 flex flex-col w-full">
        <MinefieldGrid
          handleTileClick={handleClickTile}
          revealed={revealed}
          fields={fields}
          gameLost={gameLost}
          gameFinished={gameFinished}
          totalWinnings={calculateProfit()}
          multiplier={calculateMinesMultiplier(previousBombCount, revealedCount)}
        />
      </div>
    </div>
  )

}



function combinations(n: number, r: number): number {
  if (r < 0 || r > n) {
    return 0;
  }

  if (r > n / 2) {
    r = n - r;
  }

  let result = 1;
  for (let i = 1; i <= r; i++) {
    result = (result * (n - i + 1)) / i;
  }

  return result;
}


function calculateMinesMultiplier(bombCount: number, revealedTiles: number): number {
  const TOTAL_TILES = 25;
  const HOUSE_EDGE = 0.99;

  if (revealedTiles <= 0) {
    return 1.0;
  }

  const diamondCount = TOTAL_TILES - bombCount;
  const totalCombinations = combinations(TOTAL_TILES, revealedTiles);
  const successfulCombinations = combinations(diamondCount, revealedTiles);

  if (successfulCombinations === 0) {
    return Infinity;
  }
  const fairMultiplier = totalCombinations / successfulCombinations;
  const finalMultiplier = fairMultiplier * HOUSE_EDGE;
  return finalMultiplier;
}