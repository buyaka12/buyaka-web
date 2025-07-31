export type ClickMineResponse = {
  success: boolean;
  errorMessage?: string;
  flaggedPosition: number;
  field?: boolean[];
}