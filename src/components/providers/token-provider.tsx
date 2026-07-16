"use client";

import { createContext, useContext } from "react";

const TokenContext = createContext<string | null>(null);

export function TokenProvider({ token, children }: { token: string | null; children: React.ReactNode }) {
  return <TokenContext.Provider value={token}>{children}</TokenContext.Provider>;
}

export function useAccessToken() {
  return useContext(TokenContext);
}
