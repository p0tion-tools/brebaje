import { AppContent } from "@/app/components/layouts/AppContent";
import { BulletPoint } from "@/app/components/ui/BulletPoint";
import { Card } from "@/app/components/ui/Card";
import { Icons } from "@/app/components/shared/Icons";
import Link from "next/link";

export default function PPOTPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-homepage py-[140px]">
        <AppContent className="flex flex-col gap-16">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-[10px]">
              <small className="tracking-[-0.66px] text-black text-[30px] leading-[36px]">
                Cardano Perpetual Powers of Tau
              </small>
              <h1 className="text-[80px] text-black leading-[96px] font-medium tracking-[-1.76px]">
                Empowering the Cardano Ecosystem with Secure Zero-Knowledge
                Infrastructure
              </h1>
            </div>
            <span className="text-4xl text-black lg:w-2/3">
              A cryptographic trusted setup ceremony generating secure public
              parameters for Zero-Knowledge proof systems, strengthening privacy
              and scalability across the Cardano blockchain.
            </span>
          </div>
        </AppContent>
      </section>

      {/* Ceremony Stats Section */}
      <section className="bg-white py-24">
        <AppContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-8">
              <div className="text-5xl font-bold text-black mb-8">40+</div>
              <div className="text-xl text-gray-600 mt-auto">
                Target Contributors
              </div>
            </Card>
            <Card className="text-center p-8">
              <div className="text-5xl font-bold text-black mb-8">
                Q4 2025 - Q1 2026
              </div>
              <div className="text-xl text-gray-600 mt-auto">
                Ceremony Timeline
              </div>
            </Card>
            <Card className="text-center p-8">
              <div className="text-5xl font-bold text-black mb-8">
                2<sup>23</sup>
              </div>
              <div className="text-xl text-gray-600 mt-auto">
                Constraints Supported
              </div>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto">
              This ceremony is part of a global initiative to strengthen the
              Cardano ecosystem, enabling advanced zero-knowledge applications
              that enhance privacy, scalability, and security for developers and
              users worldwide.
            </p>
          </div>
        </AppContent>
      </section>

      {/* What is PPOT Section */}
      <section className="bg-gray-50 py-24">
        <AppContent className="flex flex-col gap-12">
          <div>
            <h2 className="text-5xl font-bold text-black mb-6">
              What is Perpetual Powers of Tau?
            </h2>
            <p className="text-2xl text-gray-700 leading-relaxed">
              The Perpetual Powers of Tau ceremony is a multi-party computation
              protocol that generates cryptographic parameters required for
              zk-SNARK systems. These parameters enable zero-knowledge proofs,
              allowing users to verify computations without revealing the
              underlying data.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <BulletPoint
              title="Community-Driven Security"
              description="As long as one participant behaves honestly and destroys their secret randomness ('toxic waste'), the entire setup remains secure. No single entity controls the final parameters."
            />
            <BulletPoint
              title="BLS12-381 Elliptic Curve"
              description="Built on the industry-standard BLS12-381 curve, supporting circuits up to 2^23 constraints (~8 million), enabling complex zero-knowledge applications."
            />
            <BulletPoint
              title="Sequential Contribution Process"
              description="Participants download challenge files (~9GB), add secret randomness, generate response files, and permanently destroy their secret inputs to ensure security."
            />
            <BulletPoint
              title="Public Beacon Finalization"
              description="After all contributions, a public beacon is applied to ensure security even if participants collude, providing an additional layer of trustlessness."
            />
          </div>
        </AppContent>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-24">
        <AppContent>
          <h2 className="text-5xl font-bold text-black mb-12 text-center">
            How the Ceremony Works
          </h2>

          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black mb-2">
                  Registration
                </h3>
                <p className="text-lg text-gray-700">
                  Interested contributors register through the official form and
                  join the community Discord channel to coordinate
                  participation.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black mb-2">
                  Download Challenge
                </h3>
                <p className="text-lg text-gray-700">
                  Participants download challenge files (~9GB each) containing
                  the current state of the ceremony parameters.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black mb-2">
                  Contribute Randomness
                </h3>
                <p className="text-lg text-gray-700">
                  Using their local machine (16GB+ RAM recommended),
                  contributors add secret randomness to extend the cryptographic
                  parameters over a 3-4 hour window.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
                  4
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black mb-2">
                  Upload & Verify
                </h3>
                <p className="text-lg text-gray-700">
                  Response files are uploaded and verified by the community.
                  Contributors permanently destroy their secret inputs to
                  maintain security.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
                  5
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black mb-2">
                  Receive Rewards
                </h3>
                <p className="text-lg text-gray-700">
                  Verified contributors receive ADA rewards as appreciation for
                  strengthening the Cardano ecosystem. Voluntary participation
                  is also welcomed.
                </p>
              </div>
            </div>
          </div>
        </AppContent>
      </section>

      {/* Technical Requirements Section */}
      <section className="bg-gray-50 py-24">
        <AppContent>
          <h2 className="text-5xl font-bold text-black mb-12 text-center">
            Technical Requirements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-black mb-3">Hardware</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 16GB+ RAM (32GB recommended)</li>
                <li>• 20GB available storage space</li>
                <li>• Multi-core processor</li>
                <li>• Stable internet connection</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-black mb-3">Software</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Node.js ≥22.17.1</li>
                <li>• pnpm ≥9.0.0</li>
                <li>• Git for repository access</li>
                <li>• 3-4 hours of dedicated time</li>
              </ul>
            </Card>
          </div>
        </AppContent>
      </section>

      {/* CTA Section */}
      <section className="bg-black py-24">
        <AppContent className="text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Join the Ceremony
          </h2>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Be part of the global effort to strengthen privacy and security in
            the Cardano ecosystem. Every contribution matters.
          </p>
          <Link
            href="https://github.com/p0tion-tools/cardano-ppot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 rounded-lg text-xl transition-colors"
          >
            Visit Ceremony Repository
            <Icons.ArrowRight className="!text-black" />
          </Link>
        </AppContent>
      </section>
    </>
  );
}
