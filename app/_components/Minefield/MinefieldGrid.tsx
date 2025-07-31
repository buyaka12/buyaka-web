import {useState} from "react";

type MinefieldGridProps = {
  handleTileClick: (position: number) => void;
  revealed: Set<number>;
  fields: boolean[];
  gameLost: boolean;
  gameFinished: boolean;
}

export function MinefieldGrid({
                                handleTileClick,
                                revealed,
                                fields,
                                gameLost,
                                gameFinished
                              }: MinefieldGridProps) {


  return (
    <div className="grid grid-cols-5 gap-3 w-full max-w-xl mx-auto relative">

      {/*this is the game over overlay*/}
      <div
        className={`absolute inset-0 z-10 flex items-center justify-center bg-black/30
                   transition-opacity duration-300 ease-in-out
                   ${gameLost ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className={`bg-red-900 p-8 rounded-lg shadow-xl shadow-black/50
                     transition-all duration-300 ease-out delay-100
                     ${gameLost ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        >
          <img src={"/assets/mine.svg"} alt={'mine'} className={'w-12 h-12 mx-auto'}/>
          <p className={'mt-4 text-lg font-bold text-red-100'}>Game over!</p>
        </div>
      </div>


      {Array.from({length: 25}).map((_, index) => {
        const isRevealed = revealed.has(index) || gameLost || gameFinished;
        const isMine = fields[index] === true;

        // This logic greys out non-clicked bombs when the game is over
        const greyOutOnLoss = (gameLost || gameFinished) && !revealed.has(index) ? 'grayscale opacity-60' : '';

        return (
          <div
            key={index}
            className="group [perspective:1000px] aspect-square select-none"
            onClick={() => {
              handleTileClick(index);
            }}>
            <div
              className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isRevealed ? '[transform:rotateY(180deg)]' : ''}`}>
              <div
                className="absolute w-full h-full [backface-visibility:hidden] bg-[#2f4553]
                           border-b-8 border-b-[#1b3242] rounded-md cursor-pointer
                           hover:scale-105 active:scale-95 transition-transform">
              </div>

              <div
                className={`absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-primary flex items-center justify-center rounded-md`}
              >
                <img
                  src={isMine ? "/assets/mine.svg" : "/assets/diamond.svg"}
                  alt={isMine ? "bomb" : "diamond"}
                  className={`w-3/5 h-3/5 ${greyOutOnLoss}`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}