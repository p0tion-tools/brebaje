import { Card } from "@/app/components/ui/Card";
import { useGetCeremonyArtifacts } from "@/app/hooks/useGetCeremonyArtifacts";
import { Icons } from "@/app/components/shared/Icons";
import { Button } from "@/app/components/ui/Button";

export const DownloadZkeySection = () => {
  const { data: { finalContributionBeacon, finalZkeys, lastZkeys } = {} } =
    useGetCeremonyArtifacts();

  return (
    <div className="flex flex-col gap-14">
      <div className="flex flex-col gap-6">
        <span className="text-[22px] font-medium leading-[28px] text-black">
          Final Contribution Beacon
        </span>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-[14px]">
          <h3 className="text-[22px] font-medium leading-[28px] text-black">
            Download Final ZKey(s)
          </h3>
          <span className="text-[16px] font-normal leading-[24px] text-black">
            Press the button below to download the final ZKey files from the S3
            bucket.
          </span>
        </div>
        <div className="flex flex-col gap-[14px]">
          {finalContributionBeacon?.map((beacon) => (
            <Card
              key={beacon}
              variant="secondary"
              size="xxs"
              className="!px-5"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-black font-roboto-mono">
                  {beacon}
                </span>
                <Button
                  size="sm"
                  fontWeight="regular"
                  className="text-xs ml-auto"
                >
                  copy
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <h3 className="flex flex-col gap-[14px]">
          <span className="text-[22px] font-medium leading-[28px] text-black">
            Download Last ZKey(s)
          </span>
          <span className="text-[16px] font-normal leading-[24px] text-black">
            Press the button below to download the final ZKey files from the S3
            bucket.
          </span>
        </h3>
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-[10px]">
          {lastZkeys?.map((zkey) => (
            <Card
              key={zkey.name}
              variant="secondary"
              size="xxs"
              className="!px-5"
            >
              <div className="flex items-center gap-2">
                <Icons.Download />
                <span className="text-xs text-black">{zkey.name}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-[14px]">
          <h3 className="text-[22px] font-medium leading-[28px] text-black">
            Final Contribution Beacon
          </h3>
          <span className="text-[16px] font-normal leading-[24px] text-black">
            You can use this zKey(s) with the beacon value to verify that the
            final zKey(s) was computed correctly.
          </span>
        </div>
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-[10px]">
          {finalZkeys?.map((zkey) => (
            <Card
              key={zkey.name}
              variant="secondary"
              size="xxs"
              className="!px-5"
            >
              <div className="flex items-center gap-2">
                <Icons.Download />
                <span className="text-xs text-black">{zkey.name}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
