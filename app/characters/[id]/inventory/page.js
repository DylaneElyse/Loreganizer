"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/_utils/auth-context";
import {
  getCharacterWithInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from "@/lib/firestore-helpers";
import Link from "next/link";
import Navbar from "@/components/navbar";

export default function CharacterInventoryPage({ params }) {
  const { id: characterId } = params;
  const { user } = useUserAuth();
  const [character, setCharacter] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Load character and inventory data
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { character: characterData, inventory: inventoryData } =
          await getCharacterWithInventory(user.uid, characterId);

        setCharacter(characterData);
        setInventory(inventoryData);
        setError(null);
      } catch (err) {
        console.error("Failed to load inventory:", err);
        setError(err.message || "Failed to load inventory");
        router.push("/characters");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, characterId, router]);

  const handleAddItem = async () => {
    if (!newItem.name.trim()) return;

    try {
      setLoading(true);
      const addedItem = await addInventoryItem(user.uid, characterId, {
        name: newItem.name.trim(),
        quantity: Number(newItem.quantity) || 1,
      });

      setInventory((prev) => [addedItem, ...prev]);
      setNewItem({ name: "", quantity: 1 });
      setError(null);
    } catch (err) {
      console.error("Failed to add item:", err);
      setError(err.message || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      setLoading(true);
      await updateInventoryItem(user.uid, characterId, itemId, {
        quantity: Math.max(1, newQuantity),
      });

      setInventory((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      setError(null);
    } catch (err) {
      console.error("Failed to update quantity:", err);
      setError(err.message || "Failed to update quantity");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!confirm("Are you sure you want to remove this item?")) return;

    try {
      setLoading(true);
      await deleteInventoryItem(user.uid, characterId, itemId);
      setInventory((prev) => prev.filter((item) => item.id !== itemId));
      setError(null);
    } catch (err) {
      console.error("Failed to remove item:", err);
      setError(err.message || "Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Please login</h1>
              <p className="py-6">You need to be logged in to view inventory</p>
              <Link href="/login" className="btn btn-primary">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !character) {
    return (
      <div>
        <Navbar />
        <div className="hero min-h-screen bg-base-200">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="hero min-h-screen bg-base-200">
          <div className="alert alert-error max-w-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{character?.name}'s Inventory</h1>
          <Link href={`/characters/${characterId}`} className="btn btn-ghost">
            ← Back to Character
          </Link>
        </div>

        <div className="bg-base-100 rounded-lg shadow-md p-6">
          {/* Add New Item Form */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newItem.name}
              onChange={(e) =>
                setNewItem((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Item name"
              className="input input-bordered flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
              disabled={loading}
            />
            <input
              type="number"
              min="1"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem((prev) => ({
                  ...prev,
                  quantity: Math.max(1, parseInt(e.target.value) || 1),
                }))
              }
              className="input input-bordered w-20"
              disabled={loading}
            />
            <button
              onClick={handleAddItem}
              className="btn btn-primary"
              disabled={loading || !newItem.name.trim()}
            >
              {loading ? "Adding..." : "Add Item"}
            </button>
          </div>

          {/* Inventory List */}
          <div className="space-y-4">
            {inventory.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                {loading ? "Loading inventory..." : "No items in inventory"}
              </p>
            ) : (
              inventory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-base-200 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      className="btn btn-sm btn-square"
                      disabled={loading || item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="btn btn-sm btn-square"
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="btn btn-sm btn-error"
                    disabled={loading}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
