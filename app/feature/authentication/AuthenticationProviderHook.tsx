"use client";
import {createContext, useContext, useEffect, useState} from "react";
import type {ReactNode} from "react";
import {ApiClient} from "../http/ApiClient";
import axios from "axios";
import {LoginErrorResponse, LoginRequest} from "./models/Login";
import {UserModel, WalletModel} from "@/app/api/auth/UserModel";

type AuthenticationProviderProps = {
  isAuthenticated: boolean;
  user: UserModel | null;
  isLoading: boolean;
  hasErrors: boolean;
  errors: string[];
  attemptAuthentication: (login: LoginRequest) => Promise<LoginErrorResponse | null>;
  attemptRefresh: () => Promise<void>;
  logout: () => Promise<void>;
  modifyBalance: (newAmount: number) => void
}

type AuthenticationContextProps = {
  children: ReactNode;
}

const AuthenticationContext = createContext<AuthenticationProviderProps | undefined>(undefined);

function AuthenticationProvider({children}: AuthenticationContextProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [user, setUser] = useState<UserModel | null>(null);

  // Initialize authentication state on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        await attemptRefresh();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus().then();

    console.log('checkAuthStatus');
  }, []);


  const attemptAuthentication = async (login: LoginRequest): Promise<LoginErrorResponse | null> => {
    setErrors([]);
    try {
      // Make API call to authenticate
      await ApiClient.post('/identity/login?useCookies=true', login);
      await fetchProfile();
      return null;
    } catch (error) {
      let errorResponse: LoginErrorResponse = {
        status: 500,
        title: 'Authentication Failed',
        detail: 'Unknown error occurred',
        type: 'UnknownError'
      };

      if (axios.isAxiosError(error)) {
        errorResponse = {
          status: error.response?.status || 500,
          title: error.response?.data?.title || 'Authentication Failed',
          detail: error.response?.data?.detail || error.message,
          type: error.response?.data?.type || 'ApiError'
        };
      }

      if (errorResponse.detail === 'Failed') {
        errorResponse.detail = 'Wrong username or password.';
      }

      setErrors([errorResponse.detail]);
      return errorResponse;
    } finally {
      setIsLoading(false);
    }
  };

  async function fetchProfile() {
    // fetch claims
    try {
      const profileResponse = await ApiClient.get<UserModel>('/identity');
      setUser(profileResponse);
      setIsAuthenticated(true);
    } catch (e) {
      console.error(e);
    }

  }

  function modifyBalance(amount: number) {
    setUser(currentUser => {
      if (!currentUser) {
        return null;
      }
      return {
        ...currentUser,
        wallet: {
          ...currentUser.wallet,
          balance: amount,
        },
      };
    });
  }


  const attemptRefresh = async (): Promise<void> => {
    setIsLoading(true);
    await fetchProfile();
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    await ApiClient.post('/identity/logout');
    setIsAuthenticated(false);
    setUser(null);
    setIsLoading(false);
  };

  const hasErrors = (): boolean => {
    return errors.length > 0;
  };

  return (
    <AuthenticationContext.Provider value={{
      isAuthenticated,
      user,
      isLoading,
      errors,
      hasErrors: hasErrors(),
      attemptAuthentication,
      attemptRefresh,
      logout,
      modifyBalance
    }}>
      {children}
    </AuthenticationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthentication = (): AuthenticationProviderProps => {
  const ctx = useContext(AuthenticationContext);
  if (!ctx) {
    throw new Error("useAuthentication must be used within an AuthenticationProvider");
  }
  return ctx;
}

export default AuthenticationProvider;