import type { Metadata } from "next";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Ceremony ${params.slug}`,
    description: `Details and statistics for ceremony ${params.slug}`,
  };
}
