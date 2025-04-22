import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/_utils/firebase";
import { redirect } from "next/navigation";
import CharacterInventoryView from "./CharacterInventoryView";

export default async function CharacterInventoryPage({ params }) {
  const user = auth.currentUser;

  if (!user) {
    redirect("/login");
  }

  try {
    const characterRef = doc(db, "users", user.uid, "characters", params.id);
    const docSnap = await getDoc(characterRef);

    if (!docSnap.exists()) {
      redirect("/characters");
    }

    const characterData = docSnap.data();
    return (
      <CharacterInventoryView
        characterName={characterData.name}
        inventory={characterData.inventory || []}
        characterId={params.id}
      />
    );
  } catch (error) {
    console.error("Error fetching inventory:", error);
    redirect("/characters");
  }
}
