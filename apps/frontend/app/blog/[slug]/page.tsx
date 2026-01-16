import { AppContent } from "@/app/components/layouts/AppContent";
import { Icons } from "@/app/components/shared/Icons";
import Link from "next/link";
import { articles } from "../data/articles";
import { notFound } from "next/navigation";

interface BlogArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default function BlogArticlePage({ params }: BlogArticlePageProps) {
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      {/* Article Header */}
      <section className="bg-gradient-homepage py-24">
        <AppContent>
          {/* Back to Blog Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-black hover:text-gray-700 transition-colors mb-8 group"
          >
            <Icons.ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform !text-black" />
            <span className="font-medium">Back to Blog</span>
          </Link>

          {/* Article Meta */}
          <div className="flex flex-col gap-6 max-w-4xl">
            <div className="flex items-center gap-4 text-black">
              <span>{article.date}</span>
              <span>•</span>
              <span>{article.readTime}</span>
              <span>•</span>
              <span>By {article.author}</span>
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-7xl text-black leading-tight font-bold tracking-[-1.76px]">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-2xl text-gray-800 leading-relaxed">
              {article.excerpt}
            </p>
          </div>
        </AppContent>
      </section>

      {/* Article Content */}
      <section className="bg-white py-16">
        <AppContent>
          <article className="max-w-4xl mx-auto">
            <div className="prose prose-lg prose-gray max-w-none">
              {article.content.map((block, index) => {
                switch (block.type) {
                  case "paragraph":
                    return (
                      <p
                        key={index}
                        className="text-xl text-gray-700 leading-relaxed mb-6"
                      >
                        {block.text}
                      </p>
                    );

                  case "heading":
                    const HeadingTag =
                      `h${block.level}` as keyof JSX.IntrinsicElements;
                    const headingClasses = {
                      2: "text-4xl font-bold text-black mt-12 mb-6",
                      3: "text-3xl font-bold text-black mt-10 mb-4",
                      4: "text-2xl font-bold text-black mt-8 mb-4",
                    }[block.level || 2];

                    return (
                      <HeadingTag
                        key={index}
                        className={headingClasses}
                      >
                        {block.text}
                      </HeadingTag>
                    );

                  case "list":
                    return (
                      <ul
                        key={index}
                        className="space-y-3 mb-8 pl-6 list-none"
                      >
                        {block.items?.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="text-xl text-gray-700 leading-relaxed flex gap-3"
                          >
                            <span className="text-yellow-600 font-bold mt-1">
                              •
                            </span>
                            <span className="flex-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    );

                  case "quote":
                    return (
                      <blockquote
                        key={index}
                        className="border-l-4 border-yellow-400 pl-6 py-4 my-8 bg-gray-50 rounded-r-lg"
                      >
                        <p className="text-2xl text-gray-800 italic font-medium">
                          {block.text}
                        </p>
                      </blockquote>
                    );

                  case "link":
                    return (
                      <p
                        key={index}
                        className="text-xl text-gray-700 leading-relaxed mb-6"
                      >
                        {block.text}{" "}
                        <a
                          href={block.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-yellow-600 hover:text-yellow-700 underline font-medium"
                        >
                          {block.linkText || block.url}
                        </a>
                      </p>
                    );

                  default:
                    return null;
                }
              })}
            </div>

            {/* Article Footer */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray-600 uppercase tracking-wide">
                    Written by
                  </span>
                  <span className="text-xl font-bold text-black">
                    {article.author}
                  </span>
                </div>

                {/* Share Buttons - Placeholder */}
                <div className="flex gap-4">
                  <span className="text-sm text-gray-600 uppercase tracking-wide">
                    Share this article
                  </span>
                </div>
              </div>
            </div>
          </article>
        </AppContent>
      </section>

      {/* Related Articles / CTA Section */}
      <section className="bg-black py-24">
        <AppContent className="text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Explore More Articles
          </h2>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Discover more insights about zero-knowledge proofs, cryptographic
            ceremonies, and blockchain technology.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 rounded-lg text-xl transition-colors"
          >
            View All Articles
            <Icons.ArrowRight className="!text-black" />
          </Link>
        </AppContent>
      </section>
    </>
  );
}
