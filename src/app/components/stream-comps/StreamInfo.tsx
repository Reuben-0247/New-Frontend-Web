import { IStreamStats } from "@/app/interfaces/castr.interface";
import { EyeIcon, Signal, Ratio, Volume2 } from "lucide-react";
import React from "react";

const StreamInfo: React.FC<{ stats: IStreamStats | undefined }> = ({
  stats,
}) => {
  return (
    <div>
      <div className="bg-[#151E37] px-2 w-full flex items-center justify-between h-[50px] ">
        <div className="flex flex-col items-center">
          <div>
            <span className="text-[#A4A4A4] items-center flex gap-1 text-[10px]">
              <EyeIcon size={15} />
              Viewers
            </span>
          </div>
          <span className="text-white text-[10px] ">
            {/* {viewers === 0 ? ".." : viewers}0 */ 0}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div>
            <span className="text-[#A4A4A4] flex items-center gap-1 text-[10px]">
              {" "}
              <Signal size={15} /> Bitrate
            </span>
          </div>
          <span className="text-white text-[10px] ">
            {`${stats?.bitrate || ""} KBPS`}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div>
            <span className="text-[#A4A4A4] flex items-center gap-1 text-[10px]">
              {" "}
              <Ratio size={15} /> Resolution
            </span>
          </div>
          <span className="text-white text-[10px] ">
            {`${stats?.media_info?.tracks[0]?.width || ""}` +
              " X " +
              `${stats?.media_info?.tracks[0]?.height || ""}` +
              "HD"}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div>
            <span className="text-[#A4A4A4] flex items-center gap-1 text-[10px]">
              {" "}
              <Volume2 size={15} /> Audio Bitrate
            </span>
          </div>
          <span className="text-white text-[10px] ">
            {`${stats?.media_info?.tracks[1]?.bitrate || ""} KBPS`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StreamInfo;
