// /src/pages/login.js

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "../../components/ui/button";
import { Link } from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Attempting to sign in with email:", email);
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      console.log("Sign-in result:", result);

      if (result.error) {
        // Log the full error to the browser console for debugging
        console.error("Login failed:", result.error);
        alert("Login failed: " + result.error); // Show a user-friendly error message
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      // Catch any unexpected client-side errors
      console.error("An unexpected error occurred:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <main>
      <div className="login-card">
        <h1 className="login-header">Login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="email-label" htmlFor="email">
              Email
            </label>
            <input
              className="email-input"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="pass-label" htmlFor="password">
              Password
            </label>
            <input
              className="pass-input"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div style={{ marginTop: '10px' }}>
          <Link href="/auth/forgot-password"
            className="link">Forgot Password?
          </Link>
        </div>
        </form>
      </div>
    </main>
  );
}