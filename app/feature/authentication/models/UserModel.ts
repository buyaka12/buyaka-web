export type UserModel = {
  id: string;
  username: string;
  email: string;
  password: string;
  claims: string[];
  wallet: WalletModel;
}


export type WalletModel = {
  address: string;
  balance: number;
}