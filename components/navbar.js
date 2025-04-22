import Link from "next/link"
import { useUserAuth } from "@/_utils/auth-context"

export default function Navbar() {
  const { user, firebaseSignOut } = useUserAuth()

  if (user) {
    return (
      <div>
        <div className="navbar bg-accent">
          <div className="flex-1 p-3">
            <h1 className="text-xl font-semibold">Loreganizer</h1>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/campaign-page">Campaigns</Link>
              </li>
              <li>
                <Link href="/characters-page">Characters</Link>
              </li>

              <li>
                <details>
                  <summary>Account</summary>
                  <ul className="bg-base-100 rounded-t-none p-2">
                    <li>
                      <Link href="/dashboard-page">Dashboard</Link>
                    </li>
                    <li onClick={firebaseSignOut} className="cursor-pointer">
                      <Link href="/">Logout</Link>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
    <div>
      <div className="navbar bg-accent">
        <div className="flex-1 p-3">
          <h1 className="text-xl font-semibold">Loreganizer</h1>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/login-page">Login</Link></li>
            <li>
              <Link href="/register-page">Register</Link>
              {/* <details>
                <summary>Parent</summary>
                <ul className="bg-base-100 rounded-t-none p-2">
                  <li><a>Link 1</a></li>
                  <li><a>Link 2</a></li>
                </ul>
              </details> */}
            </li>
          </ul>
        </div>
      </div>
    </div>
    )
  }
}