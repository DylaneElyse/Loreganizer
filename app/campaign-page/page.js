"use client";

import Navbar from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { useUserAuth } from "@/_utils/auth-context";

export default function Home() {
  const { user } = useUserAuth();

  return (
    <div>
      <Navbar />
      {user ? (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <h1>Campaign</h1>
        </div>
      </div>
      ) : (
      <div>
        <div className="hero min-h-screen bg-base-200">
          <h1>Register or Login to view this content</h1>
        </div>
      </div>
      )}
    </div>
  )


}