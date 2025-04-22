"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc, // Make sure getDoc is imported
} from "firebase/firestore";
import { db } from "@/_utils/firebase";
import { useUserAuth } from "@/_utils/auth-context";
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

  // Fetch character and inventory
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Get character document
        const characterRef = doc(
          db,
          "users",
          user.uid,
          "characters",
          characterId
        );
        const characterSnap = await getDoc(characterRef);

        if (!characterSnap.exists()) {
          router.push("/characters");
          return;
        }
        setCharacter(characterSnap.data());

        // Get inventory subcollection
        const inventoryRef = collection(
          db,
          "users",
          user.uid,
          "characters",
          characterId,
          "inventory"
        );
        const inventoryQuery = query(inventoryRef);
        const inventorySnap = await getDocs(inventoryQuery);

        const items = [];
        inventorySnap.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setInventory(items);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load inventory");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [characterId, user, router]);

  // ... rest of your component code remains the same ...
  const addItem = async () => {
    if (!newItem.name.trim() || !user) return;

    try {
      setLoading(true);
      const inventoryRef = collection(
        db,
        "users",
        user.uid,
        "characters",
        characterId,
        "inventory"
      );

      // Add new document to inventory subcollection
      const docRef = await addDoc(inventoryRef, {
        name: newItem.name.trim(),
        quantity: Math.max(1, newItem.quantity),
        createdAt: new Date(),
      });

      setInventory((prev) => [
        ...prev,
        {
          id: docRef.id,
          name: newItem.name.trim(),
          quantity: newItem.quantity,
        },
      ]);
      setNewItem({ name: "", quantity: 1 });
    } catch (err) {
      console.error("Error adding item:", err);
      setError("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (!user) return;

    try {
      setLoading(true);
      const itemRef = doc(
        db,
        "users",
        user.uid,
        "characters",
        characterId,
        "inventory",
        itemId
      );
      await updateDoc(itemRef, {
        quantity: Math.max(1, newQuantity),
      });

      setInventory((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Failed to update quantity");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    if (!user) return;

    try {
      setLoading(true);
      const itemRef = doc(
        db,
        "users",
        user.uid,
        "characters",
        characterId,
        "inventory",
        itemId
      );
      await deleteDoc(itemRef);

      setInventory((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

  // ... (keep your existing rendering code, but update the handlers to use item.id instead of index)

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
              onKeyDown={(e) => e.key === "Enter" && addItem()}
            />
            <input
              type="number"
              min="1"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem((prev) => ({
                  ...prev,
                  quantity: parseInt(e.target.value) || 1,
                }))
              }
              className="input input-bordered w-20"
            />
            <button
              onClick={addItem}
              className="btn btn-primary"
              disabled={loading || !newItem.name.trim()}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>

          {/* Inventory List */}
          <div className="space-y-4">
            {inventory.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                No items in inventory
              </p>
            ) : (
              inventory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-base-200 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="btn btn-sm btn-square"
                      disabled={item.quantity <= 1 || loading}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="btn btn-sm btn-square"
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
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
