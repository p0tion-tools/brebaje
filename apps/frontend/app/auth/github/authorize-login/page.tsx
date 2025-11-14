"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

function GitHubAuthCallbackInternal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent running multiple times
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const jwt = searchParams.get("jwt");
    const userParam = searchParams.get("user");
    const error = searchParams.get("error");
    const success = searchParams.get("success");

    if (error) {
      console.error("GitHub OAuth error:", error);
      router.push("/?error=" + encodeURIComponent(error));
      return;
    }

    if (success && jwt && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        login(jwt, user);

        // Small delay before redirect to ensure state is saved
        setTimeout(() => {
          router.push("/");
        }, 100);
      } catch (err) {
        console.error("Failed to parse user data:", err);
        router.push("/?error=auth_failed");
      }
    } else {
      router.push("/?error=missing_params");
    }
  }, [login, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-base">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-black text-lg">Completing authentication...</p>
      </div>
    </div>
  );
}

export default function GitHubAuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-light-base">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-black text-lg">Loading...</p>
          </div>
        </div>
      }
    >
      <GitHubAuthCallbackInternal />
    </Suspense>
  );
}
