"use client";
/* eslint-disable @next/next/no-img-element */
import { Iboard, IEvent } from "@/app/interfaces/event.interface";
import axiosApi from "@/lib/axios";
import React, { useEffect, useState } from "react";
import {
  BsCameraVideo,
  BsFileEarmarkText,
  BsFileEarmarkWordFill,
  BsImage,
  BsSoundwave,
} from "react-icons/bs";
import { saveAs } from "file-saver";
import { ThreeDots } from "react-loader-spinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { FiDownload } from "react-icons/fi";
import { PhotoProvider, PhotoView } from "react-photo-view";
// import { Card, CardContent } from "@/components/ui/card";

const LiveBoard: React.FC<{ event: IEvent | null }> = ({ event }) => {
  const [boards, setBoards] = useState<Iboard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getBoards = async () => {
      if (event?._id) {
        try {
          const { data } = await axiosApi.get<{
            eventBoards: Iboard[];
          }>(`/events/${event?._id}/boards`);
          const boards = data.eventBoards;
          setBoards(boards);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    };
    const interval = setInterval(() => {
      getBoards();
    }, 5000);

    return () => clearInterval(interval);
  }, [event?._id, setBoards]);

  const getIcon = (type: string) => {
    switch (type) {
      case "document":
        return <BsFileEarmarkWordFill className="text-blue-500" />;
      case "image":
        return <BsImage className="text-yellow-400" />;
      case "note":
        return <BsFileEarmarkText className="text-green-500" />;
      case "audio":
        return <BsSoundwave className="text-red-400" />;
      case "video":
        return <BsCameraVideo className="text-purple-500" />;
      // case "ocr":
      //   return <PiScanLight className="text-white" />;
      default:
        return <BsFileEarmarkText className="text-gray-400" />;
    }
  };

  const handleDownloadFile = (board: Iboard) => {
    saveAs(board.content, board.name || "file");
  };
  const handleDownload = async (url: string, filename: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    URL.revokeObjectURL(link.href);
  };

  if (loading) {
    return (
      <div className="h-[50vh] flex justify-center items-center">
        <ThreeDots height="80" width="80" color="#003399" visible />
      </div>
    );
  }

  return (
    <div>
      {boards.length > 0 ? (
        <Accordion
          type="single"
          collapsible
          className="w-full border-0"
          defaultValue={boards[0]?._id}>
          {boards.map((board) => (
            <AccordionItem
              value={board._id}
              key={board._id}
              className="border-none hover:border-none">
              <AccordionTrigger className="cursor-pointer hover:no-underline [&>svg]:hidden pb-4 pt-2 px-2">
                <div className="flex justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#1A1E2E] rounded-full w-10 h-10 flex items-center justify-center text-xl">
                      {getIcon(board.type)}
                    </div>
                    <div>
                      <span className="text-white">{board.name}</span>
                      <p className="text-secondary ">
                        {new Date(board.createdAt).toDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadFile(board);
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="text-gray-400 hover:text-white transition"
                      title="Download">
                      <FiDownload className="text-xl" />
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                {board.type === "note" && (
                  <div
                    dangerouslySetInnerHTML={{ __html: board.content }}
                    className="prose prose-invert md:w-[400px]! w-full p-2 mt-2 wrap-break-word whitespace-normal overflow-auto"></div>
                )}

                {board.type === "document" && (
                  <div className="flex flex-col gap-3 justify-between items-center">
                    <div className="flex items-center gap-6">
                      <PhotoProvider>
                        <PhotoView src={board.content}>
                          <div className="cursor-pointer">View Document</div>
                        </PhotoView>
                      </PhotoProvider>
                      <Button
                        variant={"ghost"}
                        onClick={() =>
                          handleDownload(board.content, board.name)
                        }
                        className="cursor-pointer">
                        <Download />
                        Download
                      </Button>
                    </div>
                    <img
                      src={board.content}
                      alt=""
                      className="cursor-pointer rounded-md object-cover h-40 md:w-80 w-full"
                    />
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="h-[40vh] md:h-[50vh] flex flex-col text-center justify-center items-center">
          <h3 className="text-white mb-2">No board uploaded</h3>
          <img
            src="/images/chat_empty.png"
            alt="No board"
            className="mt-4 w-32 opacity-80"
          />
        </div>
      )}
    </div>
  );
};

export default LiveBoard;
