"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function MailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, checkAuth } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setIsChecking(true);
        const isValid = await checkAuth();
        if (!isValid) {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        router.push("/auth/login");
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [checkAuth, router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Verifying authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Redirecting to login...</div>
      </div>
    );
  }

  return <>{children}</>;
}