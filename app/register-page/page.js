"use client";
import Navbar from "@/components/navbar";
import { useUserAuth } from "@/_utils/auth-context";
import { useState } from "react";

export default function RegisterPage() {
  const { user, signUp } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Added state for confirm password
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      // Check if passwords match
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      console.log(email);
      console.log(password);
      await signUp(email, password, firstName, lastName);
      console.log("Registration form submitted");
    } catch (regError) {
      setError(regError.message);
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col justify-center items-center pt-24">
        <h1 className="text-5xl font-bold">Register</h1>
        <form className="flex flex-col gap-4 mt-4 w-96" onSubmit={handleSubmit}>
          <input
            type="first name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="First Name"
            required
            className="input input-bordered w-full"
          />
          <input
            type="last name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Last Name"
            required
            className="input input-bordered w-full"
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
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
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(event) => setConfirmPassword(event.target.value)}
            value={confirmPassword}
            required
            className="input input-bordered w-full"
          />
          {/* {error && <p className="text-red-500">{error}</p>}{" "} */}
          {/* Display error message */}
          {/* <button
            type="button"
            onClick={togglePasswordVisibility}
            className="btn btn-secondary mt-2"
          >
            {passwordVisible ? "Hide Password" : "Show Password"}
          </button> */}
          <button type="submit" className="btn btn-primary w-96">
            Register
          </button>
        </form>
        <p className="mt-4">
          Already have an account?{" "}
          <a
            href="/login-page"
            className="text-primary hover:text-purple-600 cursor-pointer"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
