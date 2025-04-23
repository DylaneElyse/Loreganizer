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
            <Image
              src="/loreganizer-logo.png"
              alt="Loreganizer"
              width={500}
              height={400}
              className="max-w-sm rounded-lg"
            />
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-5xl font-bold">Loreganizer</h1>
              <p className="py-6">
                A campaign management tool for your favourite games.
              </p>
              <Link href="/characters" className="btn btn-primary">
                <p>View Characters</p>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
              <Image
                src="/loreganizer-logo.png"
                alt="Loreganizer"
                width={500}
                height={400}
                className="max-w-sm rounded-lg"
              />
              <div className="flex flex-col justify-center items-center">
                <h1 className="text-5xl font-bold">Loreganizer</h1>
                <p className="py-6">
                  A campaign management tool for your favourite games.
                </p>
                <Link href="/register" className="btn btn-primary">
                  <p>Get Started</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
