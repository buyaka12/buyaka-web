import {useAuthentication} from "@/app/feature/authentication/AuthenticationProviderHook";
import {useState} from "react";
import {MinefieldGameStartModel} from "@/app/_components/Minefield/Models/MinefieldGameStartModel";


type MinefieldConfigProps = {
  gameStarted: boolean;
  betAmount: number;
  setBetAmount: (value: number) => void;
  bombCount: number;
  setBombCount: (value: number) => void;
  handleClickBet: (model: MinefieldGameStartModel) => void;
  handleCashout: () => void;
  payout: number;
}

export function MinefieldConfig(
  {
    gameStarted,
    betAmount,
    setBetAmount,
    bombCount,
    setBombCount,
    handleCashout,
    handleClickBet,
    payout
  }: MinefieldConfigProps
) {
  const {user} = useAuthentication();
  const betButtonDisabled = gameStarted || (user && (user!.wallet.balance < betAmount));


  return (
    <div className="flex flex-col gap-6 p-4 text-white max-w-md mx-auto rounded-lg">

      <div className={'flex flex-col gap-6 aria-disabled:opacity-50 aria-disabled:pointer-events-none'}
           aria-disabled={gameStarted}>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-[#b0b9d2]">Bet Amount</span>
            <span className="text-white">
            {user?.wallet.balance ? user?.wallet.balance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) : ""}
          </span>
          </div>

          <div className="flex bg-[#1e2a36] rounded-md overflow-hidden">
            <div className="flex-1 flex items-center relative">
              <input
                type="number"
                id="betAmount"
                value={betAmount !== null ? betAmount : ""}
                min={1}
                onChange={(e) => setBetAmount(parseInt(e.target.value))}
                className="w-full bg-[#1e2a36] px-3 py-3 outline-none"
                disabled={gameStarted}
                onClick={(e) => e.currentTarget.select()}
              />
            </div>

            <button
              className="bg-[#1e2a36] px-6 border-l border-[#2c3a47] hover:bg-[#2c3a47] disabled:pointer-events-none transition-colors"
              onClick={() =>
                betAmount && betAmount > 0 && setBetAmount(betAmount / 2)
              }
              disabled={gameStarted}>
              ½
            </button>

            <button
              className="bg-[#1e2a36] px-6 border-l border-[#2c3a47] hover:bg-[#2c3a47] transition-colors disabled:pointer-events-none"
              onClick={() => betAmount && betAmount > 0 && setBetAmount(betAmount * 2)}
              disabled={gameStarted}>
              2×
            </button>
          </div>

          {user && (betAmount > user.wallet.balance) ? (
            <p className="mt-1 text-sm font-medium text-red-500">
              Insufficient balance!
            </p>
          ) : null}
        </div>


        <div>
          <div className="flex justify-between mb-2">
            <span className="text-[#b0b9d2]">Mines</span>
            <span className="text-white">
            {bombCount}
          </span>
          </div>
          <div>
            <input type="range" id="volume" name="volume"
                   defaultValue={bombCount}
                   onChange={e => setBombCount(parseInt(e.target.value))}
                   min="1"
                   max="24"
                   disabled={gameStarted}
                   className="
          w-full
          h-2
          cursor-pointer
          appearance-none
          rounded-lg
          bg-gray-800
          border border-gray-700
          focus:outline-none

          /* Thumb: Webkit */
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-indigo-600
          [&::-webkit-slider-thumb]:mt-[0px] /* ⬅️ THE FIX */

          /* Thumb: Firefox */
          [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:w-5
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-accent
        "/>
          </div>
        </div>

        <button
          disabled={betButtonDisabled ?? true}
          onClick={() => handleClickBet({
            betAmount: betAmount,
            bombCount: bombCount
          })}
          className="w-full bg-[#4cd964] hover:bg-[#3cc153] disabled:bg-[#2c3a47]
        disabled:text-gray-400 text-black font-medium py-4 rounded-md transition-colors">
          Bet
        </button>
      </div>

      {gameStarted ? (
        <>
          <p>Net Profit: <span className={'text-emerald-300'}>{payout.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}</span></p>

          <button
            onClick={handleCashout}
            className="w-full bg-[#4cd964] hover:bg-[#3cc153] disabled:bg-[#2c3a47]
        disabled:text-gray-400 text-black font-medium py-4 rounded-md transition-colors">
            Cash-Out
          </button>

        </>


      ) : null}

    </div>
  )
}