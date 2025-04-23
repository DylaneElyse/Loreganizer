"use client";
import { useState, useEffect } from "react";
import { useUserAuth } from "@/_utils/auth-context";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/_utils/firebase";

export default function CurrencyTracker({ characterId, initialCurrency }) {
  const { user } = useUserAuth();
  const [currency, setCurrency] = useState({
    pp: 0,
    gp: 0,
    ep: 0,
    sp: 0,
    cp: 0,
    ...initialCurrency,
  });
  const [loading, setLoading] = useState(false);

  // Update database when currency changes
  useEffect(() => {
    const updateDatabase = async () => {
      if (!user || !characterId) return;

      try {
        setLoading(true);
        const characterRef = doc(
          db,
          "users",
          user.uid,
          "characters",
          characterId
        );
        await updateDoc(characterRef, {
          currency: currency,
        });
      } catch (error) {
        console.error("Error updating currency:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce to prevent too many writes
    const timer = setTimeout(() => {
      updateDatabase();
    }, 500);

    return () => clearTimeout(timer);
  }, [currency, user, characterId]);

  const handleCurrencyChange = (type, value) => {
    const numValue = Math.max(0, Math.floor(Number(value) || 0));
    setCurrency((prev) => ({ ...prev, [type]: numValue }));
  };

  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Currency</h2>
        {loading && (
          <span className="loading loading-spinner loading-xs"></span>
        )}
      </div>

      <div className="flex flex-row justify-between items-center mb-2">
        {/* Platinum */}
        <div className="flex items-center gap-2">
          <label className="text-sm">Platinum:</label>
          <input
            type="number"
            min="0"
            value={currency.pp}
            onChange={(e) => handleCurrencyChange("pp", e.target.value)}
            className="input input-bordered input-sm w-28"
          />
        </div>

        {/* Gold */}
        <div className="flex items-center gap-2">
          <label className="text-sm">Gold:</label>
          <input
            type="number"
            min="0"
            value={currency.gp}
            onChange={(e) => handleCurrencyChange("gp", e.target.value)}
            className="input input-bordered input-sm w-28"
          />
        </div>

        {/* Electrum */}
        <div className="flex items-center gap-2">
          <label className="text-sm">Electrum:</label>
          <input
            type="number"
            min="0"
            value={currency.ep}
            onChange={(e) => handleCurrencyChange("ep", e.target.value)}
            className="input input-bordered input-sm w-28"
          />
        </div>

        {/* Silver */}
        <div className="flex items-center gap-2">
          <label className="text-sm">Silver:</label>
          <input
            type="number"
            min="0"
            value={currency.sp}
            onChange={(e) => handleCurrencyChange("sp", e.target.value)}
            className="input input-bordered input-sm w-28"
          />
        </div>

        {/* Copper */}
        <div className="flex items-center gap-2">
          <label className="text-sm">Copper:</label>
          <input
            type="number"
            min="0"
            value={currency.cp}
            onChange={(e) => handleCurrencyChange("cp", e.target.value)}
            className="input input-bordered input-sm w-28"
          />
        </div>
      </div>
    </div>
  );
}
