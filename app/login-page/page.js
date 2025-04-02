import Navbar from "@/components/navbar";

export default function LoginPage() {
return (
  <div>
    <Navbar />
      <div className="flex flex-col justify-center items-center pt-24">
        <h1 className="text-5xl font-bold">Login</h1>
        <form className="flex flex-col gap-4 mt-4">
          <input type="email" placeholder="Email" className="input input-bordered w-full max-w-xs" required />
          <input type="password" placeholder="Password" className="input input-bordered w-full max-w-xs" required />
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <p className="mt-4">Don't have an account? <a href="/register-page" className="text-primary">Register</a></p>
      </div>
  </div>
)
}