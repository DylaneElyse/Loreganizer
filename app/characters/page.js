"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "@/_utils/auth-context";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/_utils/firebase";
import Link from "next/link";
import Navbar from "@/components/navbar";

export default function CharactersPage() {
  const { user } = useUserAuth();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const fetchCharacters = async () => {
  //   if (!user) {
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     setError(null);

  //     // Query the subcollection directly
  //     const charactersRef = collection(db, "users", user.uid, "characters");
  //     const q = query(
  //       charactersRef
  //       // orderBy("createdAt", "desc") // Now works without composite index
  //     );

  //     const querySnapshot = await getDocs(q);
  //     const charactersData = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       name: doc.data().name || "Unnamed Character",
  //       // species: doc.data().species || doc.data().Species || "Unknown",
  //       // class: doc.data().class || doc.data().Class || "Unknown",
  //       campaign: doc.data().campaign || doc.data().Campaign,
  //       // level: doc.data().level,
  //       // createdAt: doc.data().createdAt?.toDate() || new Date(),
  //       ...doc.data(),
  //     }));

  //     setCharacters(charactersData);
  //   } catch (err) {
  //     console.error("Error fetching characters:", err);
  //     setError(err.message || "Failed to load characters");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    const fetchCharacters = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Query the subcollection directly
        const charactersRef = collection(db, "users", user.uid, "characters");
        const q = query(
          charactersRef
          // orderBy("createdAt", "desc") // Now works without composite index
        );

        const querySnapshot = await getDocs(q);
        const charactersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || "Unnamed Character",
          // species: doc.data().species || doc.data().Species || "Unknown",
          // class: doc.data().class || doc.data().Class || "Unknown",
          campaign: doc.data().campaign || doc.data().Campaign,
          // level: doc.data().level,
          // createdAt: doc.data().createdAt?.toDate() || new Date(),
          ...doc.data(),
        }));

        setCharacters(charactersData);
      } catch (err) {
        console.error("Error fetching characters:", err);
        setError(err.message || "Failed to load characters");
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, [user]);

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Please login</h1>
              <p className="py-6">
                You need to be logged in to view your characters
              </p>
              <Link href="/login" className="btn btn-primary">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
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
            <button onClick={fetchCharacters} className="btn btn-sm">
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Characters</h1>
          <Link href="/characters/new" className="btn btn-primary">
            Create New Character
          </Link>
        </div>

        {characters.length === 0 ? (
          <div className="alert alert-info">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>
              You don&apos;t have any characters yet. Create your first one!
            </span>
          </div>
        ) : (
          // In your characters list rendering:
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map((character) => (
              <div key={character.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">{character.name}</h2>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {character.level && (
                      <div className="badge badge-accent">
                        Level {character.level}
                      </div>
                    )}
                  </div>

                  {/* Inventory Preview (shows first 3 items) */}
                  {character.inventory?.length > 0 && (
                    <div className="mb-2">
                      <h3 className="font-medium text-sm">
                        Inventory Preview:
                      </h3>
                      <ul className="text-xs space-y-1">
                        {character.inventory.slice(0, 3).map((item, index) => (
                          <li key={index}>• {item.name}</li>
                        ))}
                        {character.inventory.length > 3 && (
                          <li>+ {character.inventory.length - 3} more...</li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="card-actions justify-end">
                    <Link
                      href={`/characters/${character.id}/edit`}
                      className="btn btn-secondary btn-sm"
                    >
                      Edit Character
                    </Link>
                    <Link
                      href={`/characters/${character.id}/inventory`}
                      className="btn btn-primary btn-sm"
                    >
                      View Inventory
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// "use client";

// import Navbar from "@/components/navbar";
// import Image from "next/image";
// import Link from "next/link";
// import { useUserAuth } from "@/_utils/auth-context";

// export default function Home() {
//   const { user } = useUserAuth();

//   return (
//     <div>
//       <Navbar />
//       {user ? (
//         <div className="min-h-screen bg-base-200">
//           <div className="flex-col lg:flex-row-reverse">
//             <h1>Your Characters</h1>
//           </div>
//         </div>
//       ) : (
//         <div>
//           <div className="hero min-h-screen bg-base-200">
//             <h1>Register or Login to view this content</h1>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
