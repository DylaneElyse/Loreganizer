"use client";

import Navbar from "@/components/navbar";
import { useUserAuth } from "@/_utils/auth-context";
import { useState } from "react";

export default function LoginPage() {
  const { user, logIn, firebaseSignOut } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      await logIn(email, password);
      console.log("Login form submitted");
    } catch (logInError) {
      setError(logInError.message);
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      {user ? (
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <h1 className="text-5xl font-bold">Welcome back, {user.email}</h1>
            <button className="btn btn-primary" onClick={firebaseSignOut}>
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center pt-24">
          <h1 className="text-5xl font-bold">Login</h1>
          <form className="flex flex-col gap-4 mt-4 w-96">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              required
              className="input input-bordered w-full"
            />
            <div className="relative w-full">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                required
                className="input input-bordered w-full"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm pr-1 hover:text-purple-600 cursor-pointer"
              >
                {passwordVisible ? "Hide" : "Show"}
              </button>
            </div>{" "}
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Login
            </button>
          </form>
          <p className="mt-4">
            Need an account?{" "}
            <a
              href="/register-page"
              className="text-primary hover:text-purple-600 cursor-pointer"
            >
              Register
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
