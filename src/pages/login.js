// pages/login.js

import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react"; // CRITICAL FIX: Import the signIn function
import Head from "next/head";
import Link from "next/link";

// You will need to make sure you have these components or similar ones
// from your project, or you can use standard HTML.
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Clear any previous errors
    setIsLoading(true);

    // CRITICAL FIX: Use the signIn function from NextAuth.js
    const result = await signIn("credentials", {
      redirect: false, // We will handle the redirect manually
      email,
      password,
    });

    // Log the result for debugging purposes
    console.log("NextAuth signIn result:", result);

    if (result.error) {
      // If there's an error, display it to the user
      setError("Invalid credentials. Please try again.");
    } else {
      // If login is successful, redirect to the dashboard
      console.log("Login successful. Redirecting to dashboard...");
      router.push("/dashboard");
    }

    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        {/* Use your Card component for styling */}
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Log In</CardTitle>
            <CardDescription>
              Enter your email and password to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password">Password</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging In..." : "Log In"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm">
              <Link
                href="/forgot-password"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
