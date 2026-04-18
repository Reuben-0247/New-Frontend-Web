/* eslint-disable jsx-a11y/alt-text */
"use client";
/* eslint-disable @next/next/no-img-element */
// import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";

// import { boardsFormSchema, BoardsFormInput } from "@/lib/board.schema";
import {
  Download,
  Edit,
  EllipsisVertical,
  Paperclip,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import z from "zod";
import { useEventStore } from "@/app/store/event.store";
import { useEffect, useState } from "react";
import { Iboard, UpdateBoardFormInput } from "@/app/interfaces/event.interface";
import axiosApi from "@/lib/axios";
import { Accordion } from "@radix-ui/react-accordion";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuthStore } from "@/app/store/auth.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ModalComp from "../ModalComp";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
// import { Card, CardContent } from "@/components/ui/card";
import { PhotoProvider, PhotoView } from "react-photo-view";
// import Link from "next/link";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const boardSchema = z.object({
  name: z.string().min(1, "Title is required"),
  type: z.enum(["note", "document"]).nullable(),
  content: z.any(),
});

const boardsFormSchema = z.object({
  boards: z.array(boardSchema).min(1, "Add at least one board"),
});

export type BoardsFormInput = z.infer<typeof boardsFormSchema>;

const EventBoardComp = () => {
  const form = useForm<BoardsFormInput>({
    resolver: zodResolver(boardsFormSchema),
    defaultValues: { boards: [] },
  });
  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors, isValid },
  } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "boards" });

  const {
    createBoard,
    loading,
    event,
    setBoards,
    boards,
    updateBoard,
    deleteBoard,
  } = useEventStore();
  const { auth } = useAuthStore();

  const [openModal, setOpenModal] = useState(false);
  const [boardToEdit, setBoardToEdit] = useState<Iboard | null>(null);
  const [input, setInput] = useState<UpdateBoardFormInput>({
    boardId: "",
    name: "",
    type: "",
    content: "",
  });
  const [openItem, setOpenItem] = useState<string | undefined>(fields[0]?.id);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [viewAddBoard, setViewAddBoard] = useState(false);
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ bold: true }, { italic: true }, { underline: true }, { strike: true }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  useEffect(() => {
    const getBoards = async () => {
      if (event?._id) {
        try {
          const { data } = await axiosApi.get<{
            eventBoards: Iboard[];
          }>(`/events/${event._id}/boards`);
          const boards = data.eventBoards;
          setBoards(boards);
        } catch (error) {
          console.log(error);
        }
      }
    };
    // const interval = setInterval(() => {
    getBoards();
    // }, 5000);

    // return () => clearInterval(interval);
  }, [event?._id, setBoards]);

  useEffect(() => {
    if (fields.length > 0) {
      setOpenItem(fields[fields.length - 1].id);
    }
  }, [fields]);

  // const canAddBoard = () => {
  //   setViewAddBoard(true);
  // };

  const addBoard = () => {
    append({ name: "", type: null, content: "" });
  };

  // const resetForm = (index: number) => {
  //   fields.forEach((_, i) => remove(i === index ? i : -1));
  // };

  const handleTypeSelect = (index: number, type: "note" | "document") => {
    setValue(`boards.${index}.type`, type);
  };

  const onSubmit = async (values: BoardsFormInput) => {
    remove();
    const filteredBoards = values.boards.filter((b) => b.name?.trim() !== "");
    if (!filteredBoards.length) {
      toast.error("Please add at least one valid board");
      return;
    }
    const formData = new FormData();
    filteredBoards.forEach((board, i) => {
      formData.append(`boards[${i}][name]`, board.name);
      formData.append(`boards[${i}][type]`, board.type ?? "");
      formData.append(`boards[${i}][content]`, board.content);
    });
    // console.log(filteredBoards);
    const res = await createBoard(formData, event?._id || "");
    if (res) {
      form.reset();
      fields.forEach((_, i) => remove(i));
      toast.success("Boards created successfully");
    }
  };

  const updateBoardData = async () => {
    if (!boardToEdit) return;
    try {
      const formData = new FormData();
      formData.append(`boards[${0}][name]`, input.name || "");
      formData.append(`boards[${0}][content]`, input.content || "");
      formData.append(`boards[${0}][type]`, boardToEdit.type ?? "");
      // formData.append("name", input.name || "");
      // formData.append("content", input.content || "");
      // formData.append("type", boardToEdit.type || "");
      await updateBoard(formData, boardToEdit);
      setOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  const resetTypeSelect = (index: number) => {
    setValue(`boards.${index}.type`, null);
    setValue(`boards.${index}.content`, "");
  };

  const handleEditBoard = (board: Iboard) => {
    setBoardToEdit(board);
    setInput({
      boardId: board._id,
      name: board.name,
      type: board.type,
      content: board.content,
    });
    setOpenModal(true);
  };

  const deleteBoardData = async (board: Iboard) => {
    try {
      await deleteBoard(board);
      setOpenDeleteModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getFileType = (file: File) => {
    if (!file) return null;

    const name = typeof file === "string" ? file : file?.name || "";

    const ext = name.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) {
      return "image";
    }

    if (["pdf"].includes(ext || "")) {
      return "pdf";
    }

    if (["xls", "xlsx", "csv"].includes(ext || "")) {
      return "excel";
    }

    return "file";
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

  return (
    <div className="relative">
      {viewAddBoard && (
        <div className="absolute z-50 w-full h-full top-0 right-0 flex justify-center items-center p-6 bg-gray-900 opacity-95  rounded">
          <div>
            <p className="text-center mb-6">Do you want to add a new board?</p>
            <div className="flex gap-4">
              <Button
                variant={"default"}
                onClick={() => {
                  setViewAddBoard(false);
                  addBoard();
                }}>
                <Plus />
                <span className="">Add Board</span>
              </Button>
              <Button
                variant={"outline"}
                onClick={() => setViewAddBoard(false)}>
                <X />
                <span className="">Cancel</span>
              </Button>
            </div>
          </div>
        </div>
      )}
      {fields.length === 0 && boards.length === 0 && (
        <div>
          {/* {auth?.hasSubscribed ? ( */}
          <div className="w-full flex flex-col items-center mt-10">
            <Button
              variant={"outline"}
              onClick={addBoard}
              className="cursor-pointer">
              <Plus />
              <span className="">Add Board</span>
            </Button>
            <p className="text-foreground text-center w-[70%] mt-3 text-sm">
              Got materials for your event? Upload them here—slides, guides,
              links—and keep your audience engaged and informed.
            </p>
          </div>
          {/* ) : (
            <div className="w-full flex flex-col items-center mt-10">
              <Link
                href={"/pricing"}
                className="cursor-pointer flex items-center px-3 py-1 bg-primary text-white rounded-md">
                <Plus />
                <span className="">Subscribe!</span>
              </Link>
              <p className="text-foreground text-center w-[70%] mt-3 text-sm">
                Sbuscribe to Upload them here—slides, guides, links—and keep
                your audience engaged and informed.
              </p>
            </div>
          )} */}
        </div>
      )}

      {boards.length > 0 && fields.length === 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex justify-end">
            <Button
              variant={"outline"}
              onClick={addBoard}
              className="cursor-pointer">
              <Plus />
              <span className="">Add Board</span>
            </Button>
          </div>
          <ModalComp
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            onSave={() => deleteBoardData(boardToEdit!)}
            loading={loading}
            saveText="Delete"
            actionType="delete"
            header="Delete Board">
            <div>
              <p className="">Are you sure you want to delete this board?</p>
            </div>
          </ModalComp>
          <ModalComp
            open={openModal}
            onClose={() => setOpenModal(false)}
            onSave={updateBoardData}
            loading={loading}
            saveText="Update"
            header="Update Board">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateBoardData();
              }}
              className="space-y-4">
              <div className="space-y-4">
                <label className="text-sm text-gray-300">Title</label>
                <Input
                  name="name"
                  value={input?.name || ""}
                  onChange={(e) => setInput({ ...input, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-300">Content</label>
                {boardToEdit?.type === "document" ? (
                  <div>
                    <Input
                      type="file"
                      onChange={(e) =>
                        setInput({
                          ...input,
                          content: e.target.files?.[0] || null,
                        })
                      }
                    />
                    <img
                      src={
                        input.content instanceof File
                          ? URL.createObjectURL(input.content)
                          : boardToEdit?.content || ""
                      }
                      alt="document"
                      className="w-full h-20 object-contain mt-2 rounded-md"
                    />
                  </div>
                ) : (
                  <div className="">
                    <label className="text-sm text-gray-300">Text</label>
                    <ReactQuill
                      theme="snow"
                      value={input?.content || ""}
                      onChange={(value) =>
                        setInput({ ...input, content: value })
                      }
                      modules={modules}
                      placeholder="Write something..."
                      className="bg-white w-full text-black h-full  mt-1 rounded"
                    />
                  </div>
                )}
              </div>
            </form>
          </ModalComp>
          <Accordion
            type="single"
            collapsible
            className="w-full border-0"
            defaultValue={boards[0]._id}>
            {boards.map((board) => (
              <AccordionItem
                value={board._id}
                key={board._id}
                className="border-none hover:border-none">
                <AccordionTrigger className="cursor-pointer hover:no-underline [&>svg]:hidden pb-4 pt-2 px-2">
                  <div className="flex py-8   bg-transparent hover:bg-transparent outline-none justify-between w-full">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-12 h-12 rounded-full object-center"
                        src={auth?.profilePhotoUrl}
                        alt=""
                      />
                      <div>
                        <p className=" text-start text-foreground">
                          {board.name}
                        </p>
                        <p className="text-secondary ">
                          {new Date(board.createdAt).toDateString()}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                          className="cursor-pointer">
                          <EllipsisVertical size={15} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="flex bg-background flex-col">
                        <DropdownMenuItem className="cursor-pointer">
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer z-10"
                            onClick={handleEditBoard.bind(null, board)}>
                            <Edit size={15} />
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setBoardToEdit(board);
                              setOpenDeleteModal(true);
                            }}
                            className="cursor-pointer z-10">
                            <Trash2 size={15} className="text-red-500" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  {board.type === "note" && (
                    <div
                      dangerouslySetInnerHTML={{ __html: board.content }}
                      className="prose prose-invert px-4 w-full max-h-[200px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-thumb]:rounded-full p-2 mt-2 wrap-break-word whitespace-normal"></div>
                  )}

                  {board.type === "document" && (
                    <div className="flex flex-col gap-3 justify-between items-center">
                      {/* <img
                        src={board.content}
                        alt=""
                        className="cursor-pointer rounded-md object-cover h-40 md:w-80 w-full"
                      /> */}
                      {(() => {
                        const fileType = getFileType(
                          board.content as unknown as File,
                        );

                        if (fileType === "image") {
                          return (
                            <div>
                              <div className="flex items-center justify-between mb-4 gap-6">
                                <PhotoProvider>
                                  <PhotoView src={board.content}>
                                    <div className="cursor-pointer">
                                      View Image
                                    </div>
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
                              <PhotoProvider>
                                <PhotoView src={board.content}>
                                  <img
                                    src={board.content}
                                    className="cursor-pointer rounded-md object-cover h-40 md:w-80 w-full"
                                  />
                                </PhotoView>
                              </PhotoProvider>
                            </div>
                          );
                        }

                        if (fileType === "pdf") {
                          return (
                            <div className="flex flex-col items-center gap-2">
                              📄 <span>PDF Document</span>
                              <a
                                href={board.content}
                                target="_blank"
                                className="text-blue-400 underline">
                                View PDF
                              </a>
                            </div>
                          );
                        }

                        if (fileType === "excel") {
                          return (
                            <div className="flex flex-col items-center gap-2">
                              📊 <span>Excel File</span>
                              <a
                                href={board.content}
                                target="_blank"
                                className="text-blue-400 underline">
                                Open File
                              </a>
                            </div>
                          );
                        }

                        return (
                          <div className="flex flex-col items-center gap-2">
                            📁 <span>File</span>
                            <a
                              href={board.content}
                              target="_blank"
                              className="text-blue-400 underline">
                              Open File
                            </a>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
        <Accordion
          type="single"
          collapsible
          className="w-full border-0"
          value={openItem}
          onValueChange={setOpenItem}>
          {fields.map((field, index) => {
            const type = watch(`boards.${index}.type`);
            const content = watch(`boards.${index}.content`);
            return (
              <AccordionItem
                value={field.id}
                key={field.id}
                className="border-none hover:border-none">
                <AccordionTrigger
                  className={`${type ? "flex justify-between items-center" : "flex justify-end"} cursor-pointer hover:no-underline  pb-4 pt-2 px-2`}>
                  {field.name || type}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-4 text-balance">
                    {!type && (
                      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                        <div className="flex flex-col items-center gap-2 w-full">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              handleTypeSelect(index, "note");
                            }}
                            className="w-full px-3 text-white py-1 rounded bg-gray-700">
                            <Plus /> Add Text
                          </Button>
                          <small className="text-center text-foreground w-40">
                            Type in text such as announcement, notice, and more.
                          </small>
                        </div>

                        <div className="flex flex-col items-center gap-2 w-full">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleTypeSelect(index, "document")}
                            className="w-full px-3 py-1 rounded text-white bg-gray-700">
                            <Paperclip /> Attach File
                          </Button>
                          <small className="text-center text-foreground w-40">
                            Upload slides, documents, event programs, and more.
                          </small>
                        </div>
                      </div>
                    )}

                    {type === "note" && (
                      <>
                        <div className="flex justify-between items-center">
                          {type && (
                            <button
                              type="button"
                              title="Reset Type Selection"
                              onClick={() => resetTypeSelect(index)}
                              className="text-white text-sm cursor-pointer">
                              <RefreshCw size={15} />
                            </button>
                          )}
                          <button
                            type="button"
                            title="Remove"
                            onClick={() => remove(index)}
                            className="text-red-400 text-sm cursor-pointer">
                            <X size={15} />
                          </button>
                        </div>
                        <div>
                          <label className="text-sm text-foreground">
                            Title
                          </label>
                          <input
                            {...register(`boards.${index}.name`)}
                            className="w-full mt-1 bg-background border border-gray-700 rounded p-2"
                            placeholder="Board title"
                          />
                          {errors.boards?.[index]?.name && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.boards[index]?.name?.message}
                            </p>
                          )}
                        </div>

                        <Controller
                          name={`boards.${index}.content`}
                          control={control}
                          render={({ field }) => (
                            <div className="">
                              <label className="text-sm text-foreground">
                                Text
                              </label>
                              <ReactQuill
                                theme="snow"
                                value={field.value || ""}
                                onChange={field.onChange}
                                modules={modules}
                                placeholder="Write something..."
                                // className="bg-white w-full text-black h-full  mt-1 rounded"
                                className="bg-white text-black mt-1 rounded [&_.ql-container]:max-h-[200px] [&_.ql-container]:overflow-y-auto [&_.ql-container]:scroll-smooth [&_.ql-container::-webkit-scrollbar]:w-1 [&_.ql-container::-webkit-scrollbar-track]:bg-background [&_.ql-container::-webkit-scrollbar-thumb]:bg-primary [&_.ql-container::-webkit-scrollbar-thumb]:rounded-full"
                              />
                            </div>
                          )}
                        />
                      </>
                    )}

                    {type === "document" && (
                      <>
                        <div className="flex justify-between items-center">
                          {type && (
                            <button
                              type="button"
                              title="Reset Type Selection"
                              onClick={() => resetTypeSelect(index)}
                              className="text-white text-sm cursor-pointer">
                              <RefreshCw size={15} />
                            </button>
                          )}
                          <button
                            type="button"
                            title="Remove"
                            onClick={() => remove(index)}
                            className="text-red-400 text-sm cursor-pointer">
                            <X size={15} />
                          </button>
                        </div>
                        <div>
                          <label className="text-sm text-foreground">
                            Title
                          </label>
                          <input
                            {...register(`boards.${index}.name`)}
                            className="w-full mt-1 bg-background border border-gray-700 rounded p-2"
                            placeholder="Board title"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-foreground">
                            Upload file
                          </label>
                          <Input
                            type="file"
                            onChange={(e) =>
                              setValue(
                                `boards.${index}.content`,
                                e.target.files?.[0] || null,
                              )
                            }
                            className="mt-2"
                          />
                          {/* {content && (
                          <img
                            src={
                              content instanceof File
                                ? URL.createObjectURL(content)
                                : content || ""
                            }
                            alt="document"
                            className="w-full h-20 object-contain mt-2 rounded-md"
                          />
                        )} */}
                          {content &&
                            (() => {
                              const fileType = getFileType(content);

                              const fileUrl =
                                content instanceof File
                                  ? URL.createObjectURL(content)
                                  : content;

                              if (fileType === "image") {
                                return (
                                  <img
                                    src={fileUrl}
                                    alt="preview"
                                    className="w-full h-20 object-contain mt-2 rounded-md"
                                  />
                                );
                              }

                              if (fileType === "pdf") {
                                return (
                                  <div className="flex items-center gap-2 mt-2">
                                    📄 <span>PDF File</span>
                                  </div>
                                );
                              }

                              if (fileType === "excel") {
                                return (
                                  <div className="flex items-center gap-2 mt-2">
                                    📊 <span>Excel File</span>
                                  </div>
                                );
                              }

                              return (
                                <div className="flex items-center gap-2 mt-2">
                                  📁 <span>File uploaded</span>
                                </div>
                              );
                            })()}
                        </div>
                      </>
                    )}

                    <div className="flex justify-between items-center">
                      {fields?.length ? (
                        <button
                          type="submit"
                          disabled={!isValid || loading}
                          className="bg-blue-600 text-white rounded px-4 py-2">
                          {loading ? "Saving..." : " Submit Boards"}
                        </button>
                      ) : (
                        <div></div>
                      )}
                      {fields.length ? (
                        <div className="flex gap-4">
                          <Button
                            onClick={() => remove(index)}
                            className=""
                            variant={"outline"}>
                            <X size={15} />
                          </Button>

                          <Button
                            type="button"
                            variant={"outline"}
                            onClick={addBoard}>
                            <Plus /> Add
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </form>
    </div>
  );
};

export default EventBoardComp;
