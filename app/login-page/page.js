"use client";

import Navbar from "@/components/navbar";
import { useUserAuth } from "@/_utils/auth-context";
import { useState } from "react";

export default function LoginPage() {
const { user, logIn, firebaseSignOut } = useUserAuth();
const [ email, setEmail ] = useState("");
const [ password, setPassword ] = useState("");

const handleSubmit = (event) => {
  event.preventDefault();
  logIn(email, password)
}

return (
  <div>
    <Navbar />
    {user ? (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <h1 className="text-5xl font-bold">Welcome back, {user.email}</h1>
          <button className="btn btn-primary" onClick={firebaseSignOut}>Logout</button>
        </div>
      </div>
    ) : (
      <div className="flex flex-col justify-center items-center pt-24">
        <h1 className="text-5xl font-bold">Login</h1>
        <form onClick={handleSubmit} className="flex flex-col gap-4 mt-4">
          <input 
            type="email"
            value={email} 
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email" 
            required 
            className="input input-bordered w-full max-w-xs" 
          />
          <input 
            type="password" 
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password" 
            required 
            className="input input-bordered w-full max-w-xs" 
          />
          <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Login</button>
        </form>
        <p className="mt-4">Need an account? <a href="/register-page" className="text-primary">Register</a></p>
      </div>
    )}
  </div>
)
}