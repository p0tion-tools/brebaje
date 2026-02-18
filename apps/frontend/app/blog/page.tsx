import { AppContent } from "@/app/components/layouts/AppContent";
import { Icons } from "@/app/components/shared/Icons";
import Link from "next/link";
import { articles } from "./data/articles";

export default function BlogPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-homepage py-[140px]">
        <AppContent className="flex flex-col gap-16">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-[10px]">
              <small className="tracking-[-0.66px] text-black text-[30px] leading-[36px]">
                Brebaje Blog
              </small>
              <h1 className="text-[80px] text-black leading-[96px] font-medium tracking-[-1.76px]">
                Insights on Zero-Knowledge Proofs and Cryptographic Ceremonies
              </h1>
            </div>
            <span className="text-4xl text-black lg:w-2/3">
              Explore articles about zero-knowledge proofs, trusted setup
              ceremonies, and the future of privacy-preserving blockchain
              technology.
            </span>
          </div>
        </AppContent>
      </section>

      {/* Articles Section */}
      <section className="bg-white py-24">
        <AppContent>
          <div className="space-y-16 max-w-4xl">
            {articles.map((article) => (
              <article
                key={article.slug}
                className="group"
              >
                <h2 className="text-5xl font-bold text-black mb-4 group-hover:text-gray-700 transition-colors">
                  {article.title}
                </h2>
                <p className="text-2xl text-gray-600 mb-6 leading-relaxed">
                  {article.excerpt}
                </p>
                <Link
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center gap-2 text-yellow-600 font-medium text-lg hover:gap-3 transition-all"
                >
                  → Read
                </Link>
              </article>
            ))}

            {/* Empty State */}
            {articles.length === 0 && (
              <div className="text-center py-16">
                <p className="text-2xl text-gray-600">
                  No articles available yet. Check back soon!
                </p>
              </div>
            )}
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
            Participate in the Cardano Perpetual Powers of Tau ceremony and help
            strengthen the zero-knowledge proof infrastructure for the Cardano
            ecosystem.
          </p>
          <Link
            href="/ppot"
            className="inline-flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 rounded-lg text-xl transition-colors"
          >
            Learn About PPOT
            <Icons.ArrowRight className="!text-black" />
          </Link>
        </AppContent>
      </section>
    </>
  );
}
