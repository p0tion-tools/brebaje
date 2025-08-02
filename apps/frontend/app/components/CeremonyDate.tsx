import { Icons } from "./shared/Icons";

interface CeremonyDateProps {
  startDate?: string | Date;
  endDate?: string | Date;
}

export const CeremonyDate = ({ startDate, endDate }: CeremonyDateProps) => {
  const formattedStartDate = startDate
    ? new Date(startDate).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const formattedEndDate = endDate
    ? new Date(endDate).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      })
    : "";

  if (!startDate && !endDate) return null;

  return (
    <span className="flex items-center gap-1 text-[#888] font-normal text-xs mt-auto">
      {startDate && (
        <>
          <span>{`Start date: ${formattedStartDate}`}</span>
          <Icons.Dot />
        </>
      )}
      {formattedEndDate && (
        <>
          <span>{`Finish date: ${formattedEndDate}`}</span>
        </>
      )}
    </span>
  );
};
