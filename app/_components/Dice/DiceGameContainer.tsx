"use client";
import React from "react";
import ConfigForDice from "./ConfigForDice";
import DiceComponent from "./DiceComponent";
import {ApiClient} from "@/app/feature/http/ApiClient";
import {useAuthentication} from "@/app/feature/authentication/AuthenticationProviderHook";

type ResultModel = {
  isWin: boolean;
  randomNumber: number;
}

type DiceGameResponse = {
  isWin: boolean;
  rolled: number;
  staringBalance: number;
  newBalance: number;
  amountWon: number;
}

function DiceGameContainer() {
  const {user, modifyBalance} = useAuthentication();
  const [multiplier, setMultiplier] = React.useState<number>(2);
  const [gameStarted, setGameStarted] = React.useState<boolean>(false);
  const [targetNumber, setTargetNumber] = React.useState<number>(0);
  const [value, setValue] = React.useState([50]);
  const [winChance, setWinChance] = React.useState(50);

  const [betDisabled, setBetDisabled] = React.useState(false);
  const [result, setResult] = React.useState<ResultModel[]>([]);



  const handleBet = async (betAmount: number) => {
    if (!user) return;

    setBetDisabled(true);

    try {
      modifyBalance(user.wallet.balance - betAmount);
      setGameStarted(true);
      const httpDiceRoll = await ApiClient.post<DiceGameResponse>('/games/dice', {
        betAmount: betAmount,
        rollOver: value[0]
      });

      modifyBalance(httpDiceRoll.newBalance);
      setTargetNumber(httpDiceRoll.rolled);
      setResult([...result, {isWin: httpDiceRoll.isWin, randomNumber: httpDiceRoll.rolled}]);
    } catch (e) {

    }

    setBetDisabled(false);
  };

  return (
    <div className="flex flex-col md:flex-row bg-background gap-4 md:gap-8 p-4 w-full max-w-6xl mx-auto">
      <div className="w-full md:w-1/3 bg-primary">
        <ConfigForDice onBet={handleBet} betDisabled={betDisabled} />
      </div>
      <div className="w-full md:w-2/3">
        <DiceComponent
          value={value}
          setValue={setValue}
          winChance={winChance}
          setWinChance={setWinChance}
          multiplier={multiplier}
          setMultiplier={setMultiplier}
          targetNumber={targetNumber}
          gameStarted={gameStarted}
          result={result}
        />
      </div>
    </div>
  );
}

export default DiceGameContainer;
