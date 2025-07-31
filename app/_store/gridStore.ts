import { create } from 'zustand';

type GridStore = {
	selectedGrid: { [key: number]: boolean };
	setSelectedGrid: (selectedGrid: { [key: number]: boolean }) => void;
	handleSelectGrid: (index: number) => void;
	numberOfSuccessfulClicks: number;
	setNumberOfSuccessfulClicks: (numberOfSuccessfulClicks: number) => void;
	resetGrid: () => void;
	gameId: string | null;
	setGameId: (gameId: string) => void;
};

export const useGridStore = create<GridStore>((set) => ({
	selectedGrid: {},
	numberOfSuccessfulClicks: 0,
	setNumberOfSuccessfulClicks: (numberOfSuccessfulClicks) =>
		set({ numberOfSuccessfulClicks }),
	setSelectedGrid: (selectedGrid) => set({ selectedGrid }),
	handleSelectGrid: (index) => {
		set((state) => {
			const newSelectedGrid = { ...state.selectedGrid };
			newSelectedGrid[index] = true;
			return { selectedGrid: newSelectedGrid };
		});
	},
	resetGrid: () => set({ selectedGrid: {}, numberOfSuccessfulClicks: 0 }),
	gameId: null,
	setGameId: (gameId: string) => set({ gameId }),
}));
