// @/lib/firestore-helpers.js
import { db } from "@/_utils/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";

export const getCharacterWithInventory = async (userId, characterId) => {
  try {
    const [character, inventory] = await Promise.all([
      getDoc(doc(db, "users", userId, "characters", characterId)),
      getDocs(
        collection(db, "users", userId, "characters", characterId, "inventory")
      ),
    ]);

    if (!character.exists()) {
      throw new Error("Character not found");
    }

    return {
      character: {
        id: character.id,
        ...character.data(),
        createdAt: character.data().createdAt?.toDate() || null,
      },
      inventory: inventory.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || null,
      })),
    };
  } catch (error) {
    console.error("Error getting character and inventory:", error);
    throw error;
  }
};

export const addInventoryItem = async (userId, characterId, item) => {
  try {
    const docRef = await addDoc(
      collection(db, "users", userId, "characters", characterId, "inventory"),
      {
        ...item,
        createdAt: serverTimestamp(),
      }
    );
    return { id: docRef.id, ...item };
  } catch (error) {
    console.error("Error adding inventory item:", error);
    throw error;
  }
};

export const updateInventoryItem = async (
  userId,
  characterId,
  itemId,
  updates
) => {
  try {
    await updateDoc(
      doc(db, "users", userId, "characters", characterId, "inventory", itemId),
      {
        ...updates,
        updatedAt: serverTimestamp(),
      }
    );
  } catch (error) {
    console.error("Error updating inventory item:", error);
    throw error;
  }
};

export const deleteInventoryItem = async (userId, characterId, itemId) => {
  try {
    await deleteDoc(
      doc(db, "users", userId, "characters", characterId, "inventory", itemId)
    );
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    throw error;
  }
};
