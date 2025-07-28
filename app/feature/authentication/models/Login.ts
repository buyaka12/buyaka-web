export type LoginRequest = {
  email: string;
  password: string;
  twoFactorCode?: string;
  twoFactorRecoveryCode?: string;
}

export type LoginErrorResponse = {
  type: string;
  title: string;
  status: number;
  detail: string;
}