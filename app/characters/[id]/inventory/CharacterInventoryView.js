"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/_utils/firebase";
import { useUserAuth } from "@/_utils/auth-context";

export default function CharacterInventoryView({
  characterName,
  inventory,
  characterId,
  userId, // Passed from server component
}) {
  const { user } = useUserAuth(); // Client-side auth check for UI
  const [items, setItems] = useState(inventory);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(false);

  // Client-side protection (optional double-check)
  if (!user) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Please login</h1>
            <Link href="/login" className="btn btn-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Rest of your component logic...
  const addItem = async () => {
    if (!newItem.trim()) return;

    try {
      setLoading(true);
      const updatedItems = [...items, { name: newItem, quantity: 1 }];
      await updateDoc(doc(db, "users", userId, "characters", characterId), {
        inventory: updatedItems,
      });
      setItems(updatedItems);
      setNewItem("");
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your component code
}
