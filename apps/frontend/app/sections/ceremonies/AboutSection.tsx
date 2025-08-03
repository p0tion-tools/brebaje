import { AttributeCard } from "@/app/components/AttributeCard";
import { Card } from "@/app/components/ui/Card";
import { useGetCeremonyAbout } from "@/app/hooks/useGetCeremonyAbout";
import { shortAddress } from "@/app/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";

export const AboutSection = () => {
  const { id } = useParams();
  const { data: ceremonyAbout } = useGetCeremonyAbout(id as string);

  return (
    <div className="flex flex-col gap-5">
      {ceremonyAbout?.map((about) => (
        <Card
          key={about.title}
          size="sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <AttributeCard
              title="Parameters"
              value={about.title}
              size="sm"
            />
            <AttributeCard
              title="Commit Hash"
              value={shortAddress(about.commitHash)}
              removeBorderLeft
              size="sm"
            />
            <AttributeCard
              className="col-span-2"
              title="Template Link"
              value={
                <Link
                  href={about.templateLink}
                  target="_blank"
                  className="underline"
                >
                  {about.templateLink}
                </Link>
              }
              removeBorderBottom
              size="sm"
            />
          </div>
        </Card>
      ))}
    </div>
  );
};
