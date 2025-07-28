"use client";
import {useCommonStore} from "@/app/_store/commonStore";
import {Coffee, Coins, User} from "lucide-react";
import Link from "next/link";
import React, {useEffect, useState} from 'react';
import AuthModal from './ui/AuthModal';
import {useAuthentication} from "@/app/feature/authentication/AuthenticationProviderHook";
import {UserBalanceNumber} from "@/app/_components/UserBalanceNumber";

export default function Navbar() {
  const {balance, clearCommonState} = useCommonStore();
  const [showAuth, setShowAuth] = useState(false);
  const {isLoading, user, logout} = useAuthentication();

  useEffect(() => {
    console.log('user', user);
  }, [user]);


  return (
    <nav className="top-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <span
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Stakers
            </span>

            <img
              src="/assets/stake-logo.svg"
              alt="Logo"
              width={96}
              height={24}
              className="h-6 sm:h-7 w-auto"
            />
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            {user && user.wallet ? (
              <>
                <div
                  className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 text-white min-w-[120px] justify-center">
                  <Coins className="w-5 h-5 text-blue-400"/>
                  <span className="text-base font-medium">
                    <UserBalanceNumber />
                  </span>
                  <span className="ml-2 text-xs text-gray-300 font-semibold">Account Balance</span>
                </div>

              </>
            ) : null}
            <a
              href="https://www.agrandexchange.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-blue-500 hover:bg-blue-600 transition-colors p-2.5 sm:p-3 rounded-xl inline-flex items-center justify-center"
            >
              <Coffee className="w-5 h-5 text-white"/>
              <span className="hidden sm:inline text-white ml-2 font-medium">
    Play Our Rsps
  </span>
            </a>

          </div>
          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <span
                  className="font-semibold text-white text-lg px-4 py-2 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 shadow-sm">
                  {user.username}
                </span>
                <button
                  className="px-5 py-2 rounded-full border-2 border-red-500 text-red-500 font-bold bg-transparent hover:bg-red-500 hover:text-white transition-all duration-150 focus:outline-none shadow-sm"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold shadow-md hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition-all duration-150 focus:outline-none"
                onClick={() => setShowAuth(true)}
              >
                <User className="w-5 h-5"/>
                Login / Register
              </button>
            )}
          </div>
        </div>
      </div>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)}/>
    </nav>
  );
}
