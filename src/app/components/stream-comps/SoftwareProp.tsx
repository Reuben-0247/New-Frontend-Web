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
import { CopyIcon, Eye } from "lucide-react";
import React, { useState } from "react";
const SoftwareProp: React.FC<{ streamType: string }> = ({ streamType }) => {
  const [vOut, setVOut] = useState("Source Setup");
  return (
    <div className="w-full">
      <div className="flex justify-between items-center w-full bg-[#2e3c65] p-2 rounded-md mb-4">
        <p
          className={`p-2 cursor-pointer ${
            vOut === "Source Setup" ? "border-b-2" : ""
          }`}
          onClick={() => setVOut("Source Setup")}>
          Source Setup
        </p>
        <p
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
        </p>
      </div>
      {vOut === "Source Setup" ? (
        <div>
          {streamType === "Webcam" ? (
            <div className="space-y-4">
              <Select value="Nigeria">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="bg-[#2e3c65]">
                    <SelectItem value="Nigeria">Nigeria</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value="Sound Input">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose your Sound" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="bg-[#2e3c65]">
                    <SelectItem value="Sound Input">Sound Input</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value="Video Input">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select video" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="bg-[#2e3c65]">
                    <SelectItem value="Video Input">Video Input</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <div className="flex gap-6">
                <p className="border-b">RMTP</p>
                <p>SRT</p>
              </div>
              <div className="my-6">
                <label>Stream Url</label>
                <div className="relative mt-2">
                  <Input
                    type={"password"}
                    value={"hshshshshshhshsh"}
                    disabled
                  />
                  <div className="flex gap-4 absolute right-2 top-1.5">
                    <Eye className=" cursor-pointer" />
                    <CopyIcon className=" cursor-pointer" />
                  </div>
                </div>
              </div>
              <div className="my-6">
                <label>Stream Key</label>
                <div className="relative mt-2">
                  <Input
                    type={"password"}
                    value={"hshshshshshhshsh"}
                    disabled
                  />
                  <div className="flex gap-4 absolute right-2 top-1.5">
                    <Eye className=" cursor-pointer" />
                    <CopyIcon className=" cursor-pointer" />
                  </div>
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose your region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="bg-[#2e3c65]">
                    <SelectLabel>regions</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
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
