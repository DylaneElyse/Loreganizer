"use client";

import { useEffect, useState } from "react";
import { useUserAuth } from "@/_utils/auth-context";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/_utils/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar";

export default function CharacterDetail({ params }) {
  const { id } = params;
  const { user } = useUserAuth();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // Updated path to use subcollection
        const characterRef = doc(db, "users", user.uid, "characters", id);
        const docSnap = await getDoc(characterRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCharacter(data);
          setFormData(data);
        } else {
          throw new Error("Character not found");
        }
      } catch (err) {
        console.error("Error fetching character:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Updated path to use subcollection
      const characterRef = doc(db, "users", user.uid, "characters", id);
      await updateDoc(characterRef, formData);
      setCharacter(formData);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating character:", err);
      setError("Failed to update character");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this character?")) {
      try {
        setLoading(true);
        // Updated path to use subcollection
        await deleteDoc(doc(db, "users", user.uid, "characters", id));
        router.push("/characters");
      } catch (err) {
        console.error("Error deleting character:", err);
        setError("Failed to delete character");
      } finally {
        setLoading(false);
      }
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
              <p className="py-6">
                You need to be logged in to view characters
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
          <div className="alert alert-error">
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
            <Link href="/characters" className="btn btn-sm btn-ghost">
              Back to Characters
            </Link>
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
          <Link href="/characters" className="btn btn-ghost">
            ← Back to Characters
          </Link>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary"
                >
                  Edit Character
                </button>
                <button onClick={handleDelete} className="btn btn-error">
                  Delete Character
                </button>
              </>
            ) : (
              <>
                <button onClick={handleSave} className="btn btn-primary">
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {isEditing ? (
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Character Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Species</span>
                    </label>
                    <input
                      type="text"
                      name="species"
                      value={formData.species || formData.Species || ""}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Class</span>
                    </label>
                    <input
                      type="text"
                      name="class"
                      value={formData.class || formData.Class || ""}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Level</span>
                    </label>
                    <input
                      type="number"
                      name="level"
                      value={formData.level || ""}
                      onChange={handleInputChange}
                      className="input input-bordered"
                      min="1"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Campaign</span>
                    </label>
                    <input
                      type="text"
                      name="campaign"
                      value={formData.campaign || formData.Campaign || ""}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Background</span>
                  </label>
                  <textarea
                    name="background"
                    value={formData.background || ""}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered h-24"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="card-title text-3xl">{character.name}</h2>
                <div className="flex gap-2 mb-4">
                  {(character.species || character.Species) &&
                    (character.class || character.Class) && (
                      <div className="badge badge-primary">
                        {character.species || character.Species}{" "}
                        {character.class || character.Class}
                      </div>
                    )}
                  {character.level && (
                    <div className="badge badge-secondary">
                      Level {character.level}
                    </div>
                  )}
                </div>

                {character.campaign || character.Campaign ? (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Campaign</h3>
                    <p>{character.campaign || character.Campaign}</p>
                  </div>
                ) : null}

                {character.background && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Background</h3>
                    <p className="whitespace-pre-line">
                      {character.background}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Strength</div>
                      <div className="stat-value">
                        {character.strength || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Dexterity</div>
                      <div className="stat-value">
                        {character.dexterity || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Constitution</div>
                      <div className="stat-value">
                        {character.constitution || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Intelligence</div>
                      <div className="stat-value">
                        {character.intelligence || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Wisdom</div>
                      <div className="stat-value">
                        {character.wisdom || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Charisma</div>
                      <div className="stat-value">
                        {character.charisma || "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
