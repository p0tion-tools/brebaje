"use client";

import Image from "next/image";
import { Button } from "../ui/Button";
import Link from "next/link";
import { Icons } from "./Icons";
import { Modal } from "../ui/Modal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { useCardanoAuth } from "@/app/hooks/useCardanoAuth";

export const Header = () => {
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuth();
  const {
    authenticateWithCardano,
    loading: cardanoLoading,
    error: cardanoError,
  } = useCardanoAuth();
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedLoginMethod, setSelectedLoginMethod] = useState<
    "github" | "ethereum" | "bandada" | "cardano" | null
  >(null);

  const handleGithubLogin = async () => {
    try {
      // Call backend to get GitHub OAuth URL
      const response = await fetch(process.env.NEXT_PUBLIC_GITHUB_AUTH_URL!);
      const data = await response.json();
      console.log(data);

      // Redirect to GitHub OAuth
      router.push(data.authUrl);
    } catch (error) {
      console.error("GitHub OAuth initialization failed:", error);
    }
  };

  const handleCardanoLogin = async () => {
    const result = await authenticateWithCardano();
    if (result.success) {
      setIsOpenLoginModal(false);
      setSelectedLoginMethod(null);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpenLoginModal}
        onClose={() => setIsOpenLoginModal(false)}
      >
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-[34px]">
            <div className="flex flex-col gap-[18px]">
              <div className="flex items-center gap-1 mx-auto">
                <Icons.Logo />
                <span className="font-medium text-black text-[28px]">
                  Log in to your account
                </span>
              </div>
              <span className="text-black text-xs text-center">
                Login to your account to continue
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={selectedLoginMethod === "github" ? "yellow" : "white"}
                fontWeight="regular"
                size="xs"
                onClick={handleGithubLogin}
                icon={<Icons.Github />}
              >
                Github
              </Button>
              <Button
                variant={
                  selectedLoginMethod === "ethereum" ? "yellow" : "white"
                }
                fontWeight="regular"
                size="xs"
                className="!px-5"
                onClick={() => setSelectedLoginMethod("ethereum")}
                icon={<Icons.Ethereum />}
              >
                Ethereum
              </Button>
              <Button
                variant={selectedLoginMethod === "bandada" ? "yellow" : "white"}
                fontWeight="regular"
                size="xs"
                onClick={() => setSelectedLoginMethod("bandada")}
                icon={<Icons.Bandada />}
              >
                Bandada
              </Button>
              <Button
                variant={selectedLoginMethod === "cardano" ? "yellow" : "white"}
                fontWeight="regular"
                size="xs"
                onClick={handleCardanoLogin}
                disabled={cardanoLoading}
                icon={<Icons.Cardano />}
              >
                {cardanoLoading ? "Connecting..." : "Cardano"}
              </Button>
            </div>
            {cardanoError && (
              <div className="text-red-600 text-sm text-center px-4 py-2 bg-red-50 rounded">
                {cardanoError}
              </div>
            )}
          </div>
          <Button
            className="uppercase"
            variant="black"
            size="sm"
            icon={<Icons.ArrowRight className="!text-white" />}
            iconPosition="right"
            disabled={!selectedLoginMethod}
          >
            Login
          </Button>
        </div>
      </Modal>
      <header className="bg-black w-full py-5 sticky top-0 z-50">
        <div className="container flex items-center justify-between mx-auto">
          <div className="flex items-center gap-16">
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="logo p0tion"
                width={165}
                height={48}
              />
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/blog"
                className="text-white font-medium hover:text-yellow-400 transition-colors"
              >
                BLOG
              </Link>
              <Link
                href="/ppot"
                className="text-white font-medium hover:text-yellow-400 transition-colors"
              >
                PPOT
              </Link>
            </nav>
          </div>
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {user?.avatarUrl && (
                  <Image
                    src={user.avatarUrl}
                    alt={user.displayName}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-white font-medium">
                  {user?.displayName}
                </span>
                <Icons.ArrowRight
                  className={`text-white transform transition-transform ${isUserMenuOpen ? "rotate-90" : ""}`}
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50">
                  <Link
                    href="/coordinator"
                    className="block px-4 py-2 text-black hover:bg-gray-100 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Coordinator Panel
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                      router.push("/");
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              className="uppercase"
              onClick={() => setIsOpenLoginModal(true)}
            >
              Login
            </Button>
          )}
        </div>
      </header>
    </>
  );
};
