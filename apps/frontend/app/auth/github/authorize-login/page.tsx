"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function GitHubCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Processing GitHub login...");
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");

        // Handle OAuth errors from GitHub
        if (error) {
          setStatus("error");
          setMessage(`GitHub OAuth error: ${error}`);
          return;
        }

        // Handle missing authorization code
        if (!code) {
          setStatus("error");
          setMessage("Authorization code missing from GitHub callback");
          return;
        }

        setMessage("Exchanging authorization code for access token...");

        // Call backend to exchange code for tokens
        const params = new URLSearchParams();
        params.append("code", code);
        if (state) {
          params.append("state", state);
        }

        const response = await fetch(
          `http://localhost:3000/auth/github/authorize-login?${params.toString()}`
        );

        console.log(response.ok);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Authentication failed: ${response.status} - ${errorText}`
          );
        }

        const data = await response.json();

        console.log(data);

        // Store authentication data (in a real app, use secure storage)
        localStorage.setItem("jwt_token", data.jwt);
        localStorage.setItem("user", JSON.stringify(data.user));

        setUserInfo(data.user);
        setStatus("success");
        setMessage("Login successful! Redirecting to home page...");

        // Redirect to home page after 3 seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } catch (error) {
        console.error("GitHub OAuth callback error:", error);
        setStatus("error");
        setMessage(
          `Authentication failed: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
        <div className="text-center">
          {/* Loading State */}
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              <h2 className="text-xl font-semibold text-black">
                Authenticating...
              </h2>
              <p className="text-gray-600">{message}</p>
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <div className="flex flex-col items-center gap-4">
              <div className="text-green-500 text-5xl">✓</div>
              <h2 className="text-xl font-semibold text-green-600">Welcome!</h2>
              <p className="text-gray-600">{message}</p>

              {/* User Info Display */}
              {userInfo && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg w-full">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    User Information:
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>Display Name:</strong> {userInfo.displayName}
                    </p>
                    <p>
                      <strong>Provider:</strong> {userInfo.provider}
                    </p>
                    <p>
                      <strong>GitHub ID:</strong> {userInfo.githubId}
                    </p>
                    {userInfo.avatarUrl && (
                      <div className="flex items-center gap-2 mt-2">
                        <img
                          src={userInfo.avatarUrl}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-xs">
                          Avatar loaded successfully
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className="flex flex-col items-center gap-4">
              <div className="text-red-500 text-5xl">✗</div>
              <h2 className="text-xl font-semibold text-red-600">
                Authentication Failed
              </h2>
              <p className="text-gray-600 text-sm">{message}</p>

              {/* Debug Information */}
              <div className="mt-4 p-4 bg-red-50 rounded-lg w-full">
                <h3 className="text-sm font-semibold text-red-700 mb-2">
                  Debug Information:
                </h3>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    <strong>Code:</strong>{" "}
                    {searchParams.get("code") ? "Present" : "Missing"}
                  </p>
                  <p>
                    <strong>State:</strong>{" "}
                    {searchParams.get("state") ? "Present" : "Missing"}
                  </p>
                  <p>
                    <strong>Error:</strong>{" "}
                    {searchParams.get("error") || "None"}
                  </p>
                  <p>
                    <strong>Current URL:</strong> {window.location.href}
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.push("/")}
                className="mt-4 px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                Return to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
