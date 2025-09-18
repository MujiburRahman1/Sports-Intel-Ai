"use client";

import { useState } from "react";

interface WalletInfo {
  address?: string;
  balance?: string;
  currency?: string;
}

interface PaymentInfo {
  paymentIntent?: any;
  success?: boolean;
  message?: string;
}

export default function CrossmintWallet() {
  const [userId, setUserId] = useState("user_" + Math.random().toString(36).substr(2, 9));
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({});
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock response for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      const mockResult = {
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        balance: "0.00",
        currency: "USDC"
      };
      
      setWalletInfo(mockResult);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const getBalance = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock response for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      const mockBalance = {
        balance: (Math.random() * 100).toFixed(2),
        currency: "USDC"
      };
      
      setWalletInfo(prev => ({ ...prev, ...mockBalance }));
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock response for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      const mockPayment = {
        success: true,
        message: "✅ Payment processed successfully! Premium access granted.",
        paymentIntent: {
          id: `pi_${Math.random().toString(36).substr(2, 9)}`,
          amount: "5.00",
          currency: "USDC",
          status: "succeeded"
        }
      };
      
      setPaymentInfo(mockPayment);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-blue-500/20 rounded-xl p-4 bg-slate-900/70 text-slate-100 shadow-lg shadow-black/20">
      <h3 className="font-semibold text-cyan-300 mb-4">💰 Crypto Wallet & Payments</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-white mb-1">User ID</label>
          <input
            className="w-full border rounded p-2 bg-white text-black"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID"
          />
        </div>

        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={createWallet}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Wallet"}
          </button>
          
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            onClick={getBalance}
            disabled={loading}
          >
            {loading ? "Loading..." : "Check Balance"}
          </button>
        </div>

        {walletInfo.address && (
          <div className="p-3 bg-slate-800 rounded">
            <p className="text-sm text-green-400">Wallet Address: {walletInfo.address}</p>
            {walletInfo.balance && (
              <p className="text-sm text-blue-400">Balance: {walletInfo.balance} {walletInfo.currency}</p>
            )}
          </div>
        )}

        <div className="border-t border-slate-600 pt-3">
          <h4 className="text-sm font-medium text-white mb-2">Premium Payment</h4>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            onClick={processPayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay $5 USDC for Premium"}
          </button>

          {paymentInfo.success && (
            <div className="p-3 bg-green-900/30 rounded mt-2">
              <p className="text-sm text-green-400"> {paymentInfo.message}</p>
              {paymentInfo.paymentIntent && (
                <p className="text-xs text-slate-300 mt-1">
                  Payment Intent: {paymentInfo.paymentIntent.id} - {paymentInfo.paymentIntent.amount} {paymentInfo.paymentIntent.currency} - {paymentInfo.paymentIntent.status}
                </p>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-900/30 rounded">
            <p className="text-sm text-red-400">❌ {error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
