import { IStreamData } from "@/app/interfaces/castr.interface";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyIcon, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
const SoftwareProp: React.FC<{
  streamType: string;
  streamData: IStreamData | null;
}> = ({ streamType, streamData }) => {
  const [vOut, setVOut] = useState("Source Setup");
  const [showUrl, setShowUrl] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copied2, setCopied2] = useState(false);
  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Copy failed", err);
      });
  };

  const handleCopy2 = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied2(true);
        setTimeout(() => setCopied2(false), 2000);
      })
      .catch((err) => {
        console.error("Copy failed", err);
      });
  };

  const africa = [
    { name: "Nigeria", flag: "🇳🇬" },
    { name: "Ghana", flag: "🇬🇭" },
    { name: "Kenya", flag: "🇰🇪" },
    { name: "Algeria", flag: "🇩🇿" },
    { name: "Cameroon", flag: "🇨🇲" },
    { name: "Senegal", flag: "🇸🇳" },
  ];

  return (
    <div className="w-full">
      <div className="flex text-white justify-between items-center w-full bg-[#2e3c65] p-2 rounded-md mb-4">
        <p
          className={`p-2 cursor-pointer ${
            vOut === "Source Setup" ? "border-b-2" : ""
          }`}
          onClick={() => setVOut("Source Setup")}>
          Source Setup
        </p>
        {/* <p
          className={`p-2 cursor-pointer ${
            vOut === "Playback" ? "border-b-2" : ""
          }`}
          onClick={() => setVOut("Playback")}>
          Playback
        </p>
        <p
          className={`p-2 cursor-pointer ${
            vOut === "Mornituring" ? "border-b-2" : ""
          }`}
          onClick={() => setVOut("Mornituring")}>
          Mornituring
        </p> */}
      </div>
      {vOut === "Source Setup" ? (
        <div>
          {streamType === "Webcam" ? (
            <div className="space-y-4">
              <Select value="Nigeria">
                <SelectTrigger className="w-full text-white">
                  <SelectValue placeholder="Choose your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="bg-[#2e3c65] text-white">
                    <SelectItem value="Nigeria">Nigeria</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value="Sound Input">
                <SelectTrigger className="w-full text-white">
                  <SelectValue placeholder="Choose your Sound" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="bg-[#2e3c65] text-white">
                    <SelectItem value="Sound Input">Sound Input</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value="Video Input">
                <SelectTrigger className="w-full text-white">
                  <SelectValue placeholder="Select video" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="bg-[#2e3c65] text-white">
                    <SelectItem value="Video Input">Video Input</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              {/* <div className="flex gap-6 text-white">
                <p className="border-b">RMTP</p>
                <p>SRT</p>
              </div> */}
              <div className="my-6 text-white">
                <label>Stream Url</label>
                <div className="relative mt-2 w-full  border p-2 rounded-lg bg-[#2e3c65]">
                  <div className="truncate w-70">
                    {showUrl
                      ? streamData?.ingestInfo.primaryUrl || "Url not available"
                      : "xxxxxxxxxxxxxxxxx"}
                  </div>
                  <div className="flex gap-4 absolute right-2 top-1.5">
                    <div onClick={() => setShowUrl(!showUrl)}>
                      {showUrl ? (
                        <Eye className=" cursor-pointer" />
                      ) : (
                        <EyeOff className=" cursor-pointer" />
                      )}
                    </div>
                    {copied2 && (
                      <span className="text-white absolute top-6 right-0 border bg-black rounded-md p-3 text-[12px] w-max ">
                        Stream URL Copied!
                      </span>
                    )}

                    <div
                      onClick={() =>
                        handleCopy2(streamData?.ingestInfo.primaryUrl || "")
                      }
                      className="cursor-pointer">
                      {copied2 ? (
                        <CopyIcon size={14} scale={1} />
                      ) : (
                        <CopyIcon />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-6 text-white">
                <label>Stream Key</label>
                <div className="relative mt-2 w-full  border p-2 rounded-lg bg-[#2e3c65]">
                  <div className="truncate w-70">
                    {showKey
                      ? streamData?.ingestInfo.streamKey || "Key not available"
                      : "xxxxxxxxxxxxxxxxx"}
                  </div>

                  <div className="flex gap-4 absolute right-2 top-1.5">
                    <div onClick={() => setShowKey(!showKey)}>
                      {showKey ? (
                        <Eye className=" cursor-pointer" />
                      ) : (
                        <EyeOff className=" cursor-pointer" />
                      )}
                    </div>
                    {copied && (
                      <span className="text-white absolute top-6 right-0 border bg-black rounded-md p-3 text-[12px] w-max ">
                        Stream Key Copied!
                      </span>
                    )}

                    <div
                      onClick={() =>
                        handleCopy(streamData?.ingestInfo?.streamKey || "")
                      }
                      className="cursor-pointer">
                      {copied ? <CopyIcon size={14} scale={1} /> : <CopyIcon />}
                    </div>
                  </div>
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-full placeholder:text-white text-white cursor-pointer">
                  <SelectValue
                    placeholder="Choose your region"
                    className="text-white placeholder:text-white"
                  />
                </SelectTrigger>
                <SelectContent className="text-white placeholder:text-white">
                  <SelectGroup className="bg-[#2e3c65] text-white placeholder:text-white">
                    <SelectLabel>regions</SelectLabel>
                    {africa.map((a) => (
                      <SelectItem key={a.flag} value={a.name}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      ) : vOut === "Playback" ? (
        <div>
          <div className="flex rounded-lg bg-[#2E3C65] mb-3 p-3 items-center w-full justify-between">
            <div className="pb-1 border-b border-b-white ">
              <span className="text-white">Normal</span>
            </div>
            <div>
              <span className="text-white">LL</span>
            </div>
            <div>
              <span className="text-white">ULL</span>
            </div>
            <div>
              <span className="text-white">Audio</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center">
              <input name="type" id="normalType" type="radio" />
              <label htmlFor="normalType" className="text-white ml-2 ">
                Responsive
              </label>
            </div>
            <div className="flex ml-5 items-center">
              <input name="type" id="fixedType" type="radio" />
              <label htmlFor="fixedType" className="text-white ml-2 ">
                Fixed Size
              </label>
            </div>
          </div>
          <div className="my-6">
            <div className="relative mt-2">
              <Input
                type={"text"}
                onChange={(e) => e.target}
                value={"<iframe src='https://player.castr.com'"}
              />
              <div className="flex gap-4 absolute right-2 top-1.5">
                <CopyIcon className=" cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="my-6">
            <label>Direct Player Link</label>
            <div className="relative mt-2">
              <Input
                type={"text"}
                onChange={(e) => e.target}
                value={"<iframe src='https://player.castr.com'"}
              />
              <div className="flex gap-4 absolute right-2 top-1.5">
                <CopyIcon className=" cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        vOut === "Mornituring" && <></>
      )}
    </div>
  );
};

export default SoftwareProp;
