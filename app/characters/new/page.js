"use client";

import { useState } from "react";
import { useUserAuth } from "@/_utils/auth-context";
import { db } from "@/_utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Link from "next/link";

export default function NewCharacterPage() {
  const { user } = useUserAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    campaign: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Add new character to user's characters subcollection
      const charactersRef = collection(db, "users", user.uid, "characters");
      await addDoc(charactersRef, {
        name: formData.name,
        campaign: formData.campaign,
        createdAt: new Date(),
      });

      // Redirect to characters list after creation
      router.push("/characters");
    } catch (err) {
      console.error("Error creating character:", err);
      setError(err.message || "Failed to create character");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
                You need to be logged in to create characters
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

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 max-w-md">
        <h1 className="text-3xl font-bold mb-6">Create New Character</h1>

        <form
          onSubmit={handleSubmit}
          className="card bg-base-100 shadow-xl p-6"
        >
          {error && (
            <div className="alert alert-error mb-4">
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
            </div>
          )}

          <div className="form-control mb-4">
            <label className="label" htmlFor="name">
              <span className="label-text">Character Name</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter character name"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control mb-6">
            <label className="label" htmlFor="campaign">
              <span className="label-text">Campaign</span>
            </label>
            <input
              type="text"
              id="campaign"
              name="campaign"
              value={formData.campaign}
              onChange={handleChange}
              placeholder="Enter campaign name"
              className="input input-bordered w-full"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Link href="/characters" className="btn btn-ghost">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Create Character"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
