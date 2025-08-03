import Image from "next/image";
import { cn } from "@/lib/utils";
import { AppContent } from "@/app/components/layouts/AppContent";

const ceremoniesContent = [
  {
    label: "Semaphore",
    url: "https://semaphore.pse.dev/",
    image: "/ceremonies/semaphore.svg",
    className: "filter invert",
  },
  {
    label: "Anon Aadhar",
    url: "https://anon-aadhaar.pse.dev",
    image: "/ceremonies/anon-adhaar.svg",
  },
  {
    label: "zkp2p",
    url: "https://zkp2p.xyz/",
    image: "/ceremonies/zkp2p.png",
  },
  {
    label: "zkEmail",
    url: "https://zkemail.xyz/",
    image: "/ceremonies/zkemail.svg",
    className: "filter invert",
  },
  {
    label: "Self",
    url: "https://self.xyz/",
    image: "/ceremonies/self.svg",
  },
  {
    label: "RISC Zero",
    url: "https://www.risczero.com/",
    image: "/ceremonies/risczero.svg",
  },
  {
    label: "Privacy Pools",
    url: "https://privacypools.com/",
    image: "/ceremonies/privacypools.svg",
  },
];

export const TrustedBySection = () => {
  const firstRowItems = ceremoniesContent.slice(0, 5);
  const secondRowItems = ceremoniesContent.slice(5);

  return (
    <section className="bg-white">
      <AppContent className="py-20 lg:py-[100px] flex flex-col gap-10">
        <span className="text-[28px] font-poppins leading-[36px] font-normal text-center">
          External ceremonies who used p0tion
        </span>
        <div className="flex flex-col gap-8 lg:gap-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-14 lg:gap-8">
            {firstRowItems.map((item) => (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center"
              >
                <Image
                  src={item.image}
                  alt={item.label}
                  width={150}
                  height={75}
                  className={cn(
                    "w-full h-[50px] lg:h-[75px] object-contain hover:opacity-80 transition-opacity",
                    item.className
                  )}
                />
              </a>
            ))}
          </div>
          <div className="flex lg:flex-row flex-col items-center lg:justify-center lg:gap-8 gap-14">
            {secondRowItems.map((item) => (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[calc(20%-26px)] flex items-center justify-center"
              >
                <Image
                  src={item.image}
                  alt={item.label}
                  width={150}
                  height={75}
                  className={cn(
                    "w-full h-[50px] lg:h-[75px] object-contain hover:opacity-80 transition-opacity",
                    item.className
                  )}
                />
              </a>
            ))}
          </div>
        </div>
      </AppContent>
    </section>
  );
};
