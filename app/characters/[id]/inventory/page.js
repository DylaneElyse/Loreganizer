"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/_utils/auth-context";
import {
  getCharacterWithInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from "@/lib/firestore-helpers";
import { searchItems, getItemData } from "@/lib/item-helpers";
import Link from "next/link";
import Navbar from "@/components/navbar";
import CurrencyTracker from "./currency-tracker";

export default function CharacterInventoryPage({ params }) {
  const { id: characterId } = use(params);
  const { user } = useUserAuth();
  const [character, setCharacter] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customItem, setCustomItem] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
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

  // Handle outside clicks to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update suggestions when search term changes
  useEffect(() => {
    if (searchTerm.length > 1) {
      setSuggestions(searchItems(searchTerm));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleCurrencySave = (currency) => {
    // Save to Firestore or your state management
    console.log("Currency updated:", currency);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setSearchTerm(item.name);
    setShowSuggestions(false);
  };

  const handleAddItem = async () => {
    if (!selectedItem) return;
    try {
      setLoading(true);
      const itemData = {
        name: selectedItem.name,
        quantity: Number(quantity) || 1,
        type: selectedItem.type || "misc",
        weight: selectedItem.weight || 0,
        description: selectedItem.description || "",
        rarity: selectedItem.rarity || "common",
        ...selectedItem,
      };
      const addedItem = await addInventoryItem(user.uid, characterId, itemData);
      setInventory((prev) => [addedItem, ...prev]);
      setSearchTerm("");
      setSelectedItem(null);
      setQuantity(1);
      setError(null);
    } catch (err) {
      console.error("Failed to add item:", err);
      setError(err.message || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  const handleManualAdd = async () => {
    try {
      setLoading(true);
      const itemName = customItem.trim();

      if (!itemName) {
        setError("Please enter an item name");
        return;
      }

      const itemData = {
        name: itemName,
        quantity: Number(quantity) || 1,
        type: "manual entry",
        weight: 0,
        description: "",
        rarity: "unknown",
      };

      const addedItem = await addInventoryItem(user.uid, characterId, itemData);

      setInventory((prev) => [addedItem, ...prev]);

      setCustomItem("");
      {
        /* Clear the custom item input */
      }
      setQuantity(1);
      setError(null);
    } catch (err) {
      console.error("Failed to add custom item:", err);
      setError(err.message || "Failed to add custom item");
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
          <h1 className="text-3xl font-bold">
            {character?.name}&apos;s Inventory
          </h1>
          <Link href={`/characters`} className="btn btn-ghost">
            ← Back to Character
          </Link>
        </div>
        <div>
          <CurrencyTracker
            characterId={characterId}
            initialCurrency={character?.currency}
          />
        </div>
        <div className="bg-base-100 rounded-lg shadow-md p-6">
          {/* Add New Item Form */}
          {/* <div className="flex gap-2 mb-6 relative" ref={suggestionsRef}>
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search items from list..."
                className="input input-bordered w-full"
                disabled={loading}
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {suggestions.map((item) => (
                    <li
                      key={item.name}
                      className="px-4 py-2 hover:bg-base-200 cursor-pointer"
                      onClick={() => handleItemSelect(item)}
                    >
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        {item.type || "item"} • {item.rarity || "common"}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="input input-bordered w-20"
              disabled={loading || !selectedItem}
            />
            <button
              onClick={handleAddItem}
              className="btn btn-primary"
              disabled={loading || !selectedItem}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div> */}
          {/* Manual Add Item Form */}
          <div className="flex gap-2 mb-6 relative">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Add custom item..."
                className="input input-bordered w-full"
                disabled={loading}
                value={customItem}
                onChange={(e) => setCustomItem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualAdd()}
              />
            </div>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="input input-bordered w-20"
              disabled={loading}
            />
            <button
              onClick={handleManualAdd}
              className="btn btn-primary"
              disabled={loading || !customItem.trim()}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
          {/* Item Preview */}
          {selectedItem && (
            <div className="mb-6 p-4 bg-base-200 rounded-lg">
              <h3 className="font-bold text-lg">{selectedItem.name}</h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {selectedItem.equipment_category?.name && (
                  <span>Category: {selectedItem.equipment_category.name}</span>
                )}
                {selectedItem.weapon_category && (
                  <span>Weapon Type: {selectedItem.weapon_category}</span>
                )}
                {selectedItem.rarity && (
                  <span>Rarity: {selectedItem.rarity}</span>
                )}
                {selectedItem.weight && (
                  <span>Weight: {selectedItem.weight} lbs</span>
                )}
                {selectedItem.cost && (
                  <span>
                    Cost: {selectedItem.cost.quantity} {selectedItem.cost.unit}
                  </span>
                )}
                {selectedItem.damage && (
                  <span>
                    Damage: {selectedItem.damage.damage_dice}{" "}
                    {selectedItem.damage.damage_type?.name || ""}
                  </span>
                )}
                {selectedItem.range?.normal && (
                  <span>Range: {selectedItem.range.normal} ft</span>
                )}
              </div>
              {selectedItem.properties &&
                selectedItem.properties.length > 0 && (
                  <div className="mt-2">
                    <span className="font-medium">Properties: </span>
                    {selectedItem.properties
                      .map((prop) => prop.name)
                      .join(", ")}
                  </div>
                )}
              {selectedItem.description && (
                <p className="mt-2">{selectedItem.description}</p>
              )}
            </div>
          )}
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
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                      {item.equipment_category?.name && (
                        <span>{item.equipment_category.name}</span>
                      )}
                      {/* {item.weapon_category && (
                        <span>• {item.weapon_category}</span>
                      )}
                      {item.rarity && <span>• {item.rarity}</span>}
                      {item.weight && <span>• {item.weight} lbs</span>}
                      {item.cost && (
                        <span>
                          • {item.cost.quantity} {item.cost.unit}
                        </span>
                      )}
                      {item.damage && (
                        <span>
                          • {item.damage.damage_dice}{" "}
                          {item.damage.damage_type?.name}
                        </span>
                      )} */}
                    </div>
                    {item.properties && item.properties.length > 0 && (
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Properties: </span>
                        {item.properties.map((prop) => prop.name).join(", ")}
                      </div>
                    )}
                    {item.description && (
                      <p className="text-sm mt-1">{item.description}</p>
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
