"use client";
import Navbar from "@/components/navbar";
import { useUserAuth } from "@/_utils/auth-context";
import { useState } from "react";

export default function RegisterPage() {
const { user, signUp } = useUserAuth();
// const [ fullName, setFullName ] = useState("");
const [ email, setEmail ] = useState("");
const [ password, setPassword ] = useState("");
const [ error, setError ] = useState(null);

const handleSubmit = (event) => {
  event.preventDefault();
  signUp(email, password,)
  console.log("Registration form submitted");
}
return (
  <div>
    <Navbar />
      <div className="flex flex-col justify-center items-center pt-24">
        <h1 className="text-5xl font-bold">Register</h1>
        <form className="flex flex-col gap-4 mt-4">
          {/* <input 
            type="text" 
            placeholder="Full Name" 
            onChange={(event) => setFullName(event.target.value)}
            value={fullName}
            required 
            className="input input-bordered w-full max-w-xs" 
          /> */}
          <input 
            type="email" 
            placeholder="Email" 
            onChange={(event) => setEmail(event.target.value)}
            value={email}
            required 
            className="input input-bordered w-full max-w-xs" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            required 
            className="input input-bordered w-full max-w-xs" 
          />
          <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Register</button>
        </form>
        <p className="mt-4">Already have an account? <a href="/register-page" className="text-primary">Login</a></p>
      </div>
  </div>
)
}