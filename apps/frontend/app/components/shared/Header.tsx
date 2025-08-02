"use client";

import Image from "next/image";
import { Button } from "../ui/Button";
import Link from "next/link";
import { Icons } from "./Icons";
import { Modal } from "../ui/Modal";
import { useState } from "react";

export const Header = () => {
  const isLoggedIn = false;
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const [selectedLoginMethod, setSelectedLoginMethod] = useState<"github" | "ethereum" | "bandada" | null>(null);

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
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant={selectedLoginMethod === "github" ? "yellow" : "white"}
                fontWeight="regular"
                size="xs"
                onClick={() => setSelectedLoginMethod("github")}
                icon={<Icons.Github />}
              >
                Github
              </Button>
              <Button
                variant={selectedLoginMethod === "ethereum" ? "yellow" : "white"}
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
            </div>
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
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="logo p0tion"
              width={165}
              height={48}
            />
          </Link>
          {isLoggedIn ? (
            <Button
              fontWeight="medium"
              variant="outline-white"
              icon={<Icons.ArrowRight className="text-white" />}
            >
              Discord
            </Button>
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
