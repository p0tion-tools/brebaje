import Image from "next/image";
import { Button } from "../ui/Button";
import { Icons } from "./Icons";
import { LINKS } from "@/app/config";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-black flex flex-col justify-center items-center gap-9 pt-10 pb-12">
      <Image
        src="/icons/footer-logo.svg"
        alt="footer icon"
        width={83}
        height={88}
      />
      <div className="flex items-center gap-6">
        <Link
          href={LINKS.DISCORD}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="sm"
            fontWeight="medium"
            variant="outline-white"
            isExternal
            icon={<Icons.Discord size={20} />}
            iconPosition="left"
          >
            Discord
          </Button>
        </Link>
        <Link
          href={LINKS.GITHUB}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="sm"
            fontWeight="medium"
            variant="outline-white"
            isExternal
            icon={<Icons.Github size={20} />}
            iconPosition="left"
          >
            Github
          </Button>
        </Link>
      </div>
      <span className="text-secondary-500 text-xs font-medium">
        Toolkit for Groth16 Phase 2 Trusted Setup ceremonies.
      </span>
    </footer>
  );
};
