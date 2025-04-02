import Navbar from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div>
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <Image src="/loreganizer-logo.png" alt="Loreganizer" width={500} height={400} className="max-w-sm rounded-lg" /> 
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-5xl font-bold">Loreganizer</h1>
              <p className="py-6">A campaign management tool for your favorite games.</p>
              <Link href="/register-page" className="btn btn-primary">
                <p>Get Started</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
)}
