"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { BrowserWallet } from "@meshsdk/core";

export const useCardanoAuth = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticateWithCardano = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Get available wallets and connect to the first one
      const installedWallets = BrowserWallet.getInstalledWallets();

      if (installedWallets.length === 0) {
        throw new Error(
          "No Cardano wallet detected. Please install a wallet extension."
        );
      }

      // Connect to the first available wallet
      const wallet = await BrowserWallet.enable(installedWallets[0].name);

      if (!wallet) {
        throw new Error("Failed to connect to wallet");
      }

      // Step 2: Get wallet address
      const usedAddresses = await wallet.getUsedAddresses();
      const userAddress = usedAddresses[0];

      if (!userAddress) {
        throw new Error("Could not get wallet address");
      }

      // Step 3: Request nonce from backend
      const nonceResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/cardano/generate-nonce`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userAddress }),
        }
      );

      if (!nonceResponse.ok) {
        throw new Error("Failed to generate nonce");
      }

      const { nonce } = await nonceResponse.json();

      // Step 4: Convert nonce to hex format for signing (browser-compatible)
      const encoder = new TextEncoder();
      const nonceBytes = encoder.encode(nonce);
      const nonceHex = Array.from(nonceBytes)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      // Request wallet signature (only takes hex payload, not address)
      const signature = await wallet.signData(nonceHex);

      // Step 5: Verify signature with backend
      const verifyResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/cardano/verify-signature`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userAddress,
            signature,
          }),
        }
      );

      if (!verifyResponse.ok) {
        throw new Error("Failed to verify signature");
      }

      const { user, jwt } = await verifyResponse.json();

      // Step 6: Login user
      login(jwt, user);

      return { success: true };
    } catch (err: any) {
      const errorMessage = err?.message || "Authentication failed";
      setError(errorMessage);
      console.error("Cardano authentication error:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    authenticateWithCardano,
    loading,
    error,
  };
};
