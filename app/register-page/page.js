import Navbar from "@/components/navbar";

export default function RegisterPage() {
return (
  <div>
    <Navbar />
      <div className="flex flex-col justify-center items-center pt-24">
        <h1 className="text-5xl font-bold">Register</h1>
        <form className="flex flex-col gap-4 mt-4">
          <input type="text" placeholder="Username" className="input input-bordered w-full max-w-xs" required />
          <input type="text" placeholder="Full Name" className="input input-bordered w-full max-w-xs" required />
          <input type="email" placeholder="Email" className="input input-bordered w-full max-w-xs" required />
          <input type="password" placeholder="Password" className="input input-bordered w-full max-w-xs" required />
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
        <p className="mt-4">Already have an account? <a href="/register-page" className="text-primary">Login</a></p>
      </div>
  </div>
)
}