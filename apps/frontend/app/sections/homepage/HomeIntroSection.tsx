import { AppContent } from "@/app/components/layouts/AppContent";
import { Icons } from "@/app/components/shared/Icons";
import { BulletPoint } from "@/app/components/ui/BulletPoint";
import Image from "next/image";

export const HomeIntroSection = () => {
  return (
    <section className="bg-gradient-homepage py-[140px]">
      <AppContent className="flex flex-col gap-28">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-[10px]">
            <small className="tracking-[-0.66px] text-black text-[30px] leading-[36px]">
              Secure. Scalable. Simplified.
            </small>
            <h1 className="text-[80px] text-black leading-[96px] font-medium tracking-[-1.76px]">
              p0tion: Your Go-To Toolkit for Automated Groth16 Phase 2 Trusted
              Setup Ceremonies.
            </h1>
          </div>
          <div className="ml-auto flex items-center">
            <Icons.ShapeIntroPage
              height={77}
              width={140}
            />
            <Icons.ShapeIntroPage
              height={77}
              width={140}
            />
          </div>
          <span className="text-4xl text-black lg:w-1/2">
            Our design philosophy ensures that p0tion stands as the optimal
            choice for running secure Groth16 zk-applications via automated
            phase2 ceremonies.
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12">
          <Image
            src="/illustrations/shape-homepage.svg"
            alt="p0tion"
            width={700}
            height={700}
          />
          <div className="flex flex-col gap-12">
            <BulletPoint
              title="Secure Groth16 circuits in Prod."
              description="Circom developers, including the MACI and QFI teams can implement continuous delivery of secure groth16 zkApps within an agile setting by automating phase2 ceremonies."
            />
            <BulletPoint
              title="Easy to read and use."
              description="Documentation and code is clear, concise, and articulate; someone new to the tool could pick it up and deploy a ceremony in under an hour."
            />
            <BulletPoint
              title="Ready to change."
              description="Developers can have confidence in the security of the ceremony tool and can fork/adapt the code for their own ceremony."
            />
            <BulletPoint
              title="Infrastructure as Code."
              description="Black-boxing the entire process for infrastructure setup, coordination, scaling and ceremony conduction."
            />
          </div>
        </div>
      </AppContent>
    </section>
  );
};
