import Link from "next/link"
import { useUserAuth } from "@/_utils/auth-context"

export default function Navbar() {
  const { user, firebaseSignOut } = useUserAuth()

  if (user) {
    return (
      <div>
      <div className="navbar bg-accent">
      <Link href="/" className="flex-1">
        <h1 className="btn btn-ghost text-xl">Loreganizer</h1>
      </Link>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
        <li><Link href="/campaign">Campaign</Link></li>
        <li>
          <details>
          <summary>Account</summary>
          <ul className="bg-base-100 rounded-t-none p-2">
            <li onClick={firebaseSignOut} className="cursor-pointer">Logout</li>
          </ul>
          </details>
        </li>
        </ul>
      </div>
      </div>
    </div>
    )
  }

  if (!user) {
    return (
    <div>
      <div className="navbar bg-accent">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Loreganizer</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
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