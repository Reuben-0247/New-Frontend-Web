"use client";
import React, { useEffect, useState } from "react";
import { useDestinationStore } from "@/app/store/destination.store";
import {
  // ArrowLeft,
  Edit,
  EllipsisVertical,
  Plus,
  Trash2,
  Volleyball,
  X,
  Youtube,
} from "lucide-react";
import { FaFacebook } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import { BsTwitch } from "react-icons/bs";
import { FaTiktok } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  CreateDestinationInput,
  IDestination,
} from "@/app/interfaces/destination.interface";
import ModalComp from "@/app/components/ModalComp";
// import { ThreeDots } from "react-loader-spinner";
import { Input } from "@/components/ui/input";
import { useEventStore } from "@/app/store/event.store";
import { toast } from "react-toastify";
import { Switch } from "@/components/ui/switch";

const DestinationsPage: React.FC = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [openModal, setOpenModal] = useState(false);
  const [desToEdit, setDesToEdit] = useState<IDestination | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [input, setInput] = useState<CreateDestinationInput>({
    name: "",
    serverUrl: "",
    serverKey: "",
  });

  const {
    destinations,
    createDestination,
    loading,
    enableDestination,
    deleteDestination,
    updateDestination,
  } = useDestinationStore();
  const { streamData, event } = useEventStore();

  useEffect(() => {
    const initialState: Record<string, boolean> = {};

    destinations.forEach((d) => {
      initialState[d._id] = d.enabled;
    });

    setEnabled(initialState);
  }, [destinations]);

  const destinationLabels = [
    { icon: <FaFacebook size={24} />, name: "Facebook" },
    { icon: <Youtube size={24} />, name: "Youtube" },
    { icon: <FaXTwitter size={24} />, name: "Twitter" },
    { icon: <BsTwitch size={24} />, name: "Twitch" },
    { icon: <FaDiscord size={24} />, name: "Discord" },
    { icon: <FaLinkedin size={24} />, name: "LinkedIn" },
    { icon: <FaTiktok size={24} />, name: "TikTok" },
    { icon: <Volleyball size={24} />, name: "Kick" },
  ];

  const selectPlatform = (name: string) => {
    setInput({ ...input, name });
    setAdding(true);
    // setShowAdd(false);
  };

  const getPlatformIcon = (name: string) => {
    switch (name) {
      case "Youtube":
        return <Youtube />;
      case "Twitter":
      case "X":
        return <FaXTwitter size={24} />;
      case "Discord":
        return <FaDiscord size={24} />;
      case "Twitch":
        return <BsTwitch size={24} />;
      case "TikTok":
        return <FaTiktok size={24} />;
      case "LinkedIn":
        return <FaLinkedin size={24} />;
      case "Facebook":
        return <FaFacebook size={24} />;
      case "Kick":
        return <Volleyball size={24} />;
      default:
        return <FaFacebook size={24} />;
    }
  };
  const handleEditDestination = (destination: IDestination) => {
    setDesToEdit(destination);
    setInput({
      name: destination.name,
      serverKey: destination.serverKey,
      serverUrl: destination.serverUrl,
    });

    setOpenModal(true);
  };

  const onSubmit = async () => {
    if (!streamData?.castrStreamId || !event?.castrStreamId) {
      toast.error(
        "Stream is not live. Please Please ensure you have started streaming.",
      );
      return;
    }
    const success = await createDestination(input);
    if (success) {
      setAdding(false);
      setShowAdd(false);
      setInput({ name: "", serverUrl: "", serverKey: "" });
    }
  };

  const onUpdate = async () => {
    if (!desToEdit) return;
    try {
      await updateDestination({
        _id: desToEdit._id,
        name: input.name,
        serverKey: input.serverKey,
        serverUrl: input.serverUrl,
      });
      setOpenModal(false);
      setDesToEdit(null);
      setInput({ name: "", serverUrl: "", serverKey: "" });
    } catch (error) {
      console.log(error);
    }
  };

  const onEnableDestination = async (checked: boolean, id: string) => {
    if (!streamData?.castrStreamId) {
      toast.warn("Please create a stream...");
      return;
    }
    setEnabled((prev) => ({ ...prev, [id]: checked }));
    setLoadingMap((prev) => ({ ...prev, [id]: true }));
    try {
      await enableDestination({
        streamId: streamData.castrStreamId,
        id,
        enabled: checked,
      });
    } catch (error) {
      console.log(error);
      setEnabled((prev) => ({ ...prev, [id]: !checked }));
    } finally {
      setLoadingMap((prev) => ({ ...prev, [id]: false }));
    }
  };

  const deleteData = async (data: IDestination) => {
    try {
      await deleteDestination(data._id);
      setOpenDeleteModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full relative h-full">
      <ModalComp
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onSave={() => deleteData(desToEdit!)}
        loading={loading}
        saveText="Delete"
        actionType="delete"
        header="Delete Destination">
        <div>
          <p className="">Are you sure you want to delete this destination?</p>
        </div>
      </ModalComp>
      <ModalComp
        open={openModal}
        loading={loading}
        onClose={() => setOpenModal(false)}
        saveText="Update"
        header="Edit Destination"
        onSave={onUpdate}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onUpdate();
          }}
          className="w-full h-full">
          <div className="mb-4">
            <label htmlFor="channelName" className="text-white mb-2 block">
              Channel Name
            </label>
            <Input
              id="channelName"
              type="text"
              value={input.name}
              onChange={(e) => setInput({ ...input, name: e.target.value })}
              placeholder="Enter the name of the account you are streaming to"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="streamKey" className="text-white mb-2 block">
              Stream Key
            </label>
            <Input
              id="streamKey"
              type="text"
              value={input.serverKey}
              onChange={(e) =>
                setInput({ ...input, serverKey: e.target.value })
              }
              placeholder="Enter Stream Key"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="streamUrl" className="text-white mb-2 block">
              Stream URL
            </label>
            <Input
              id="streamUrl"
              type="text"
              value={input.serverUrl}
              onChange={(e) =>
                setInput({ ...input, serverUrl: e.target.value })
              }
              placeholder="Enter Stream URL"
              required
            />
          </div>
        </form>
      </ModalComp>
      <ModalComp
        open={adding}
        loading={loading}
        onClose={() => setAdding(false)}
        onSave={onSubmit}
        header="Create Destination"
        saveText="Add Destination">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="w-full h-full">
          <div className="mb-4">
            <label htmlFor="channelName" className="text-white mb-2 block">
              Channel Name
            </label>
            <Input
              id="channelName"
              type="text"
              value={input.name}
              onChange={(e) => setInput({ ...input, name: e.target.value })}
              placeholder="Enter the name of the account you are streaming to"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="streamKey" className="text-white mb-2 block">
              Stream Key
            </label>
            <Input
              id="streamKey"
              type="text"
              value={input.serverKey}
              onChange={(e) =>
                setInput({ ...input, serverKey: e.target.value })
              }
              placeholder="Enter Stream Key"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="streamUrl" className="text-white mb-2 block">
              Stream URL
            </label>
            <Input
              id="streamUrl"
              type="text"
              value={input.serverUrl}
              onChange={(e) =>
                setInput({ ...input, serverUrl: e.target.value })
              }
              placeholder="Enter Stream URL"
              required
            />
          </div>
        </form>
      </ModalComp>
      {showAdd && (
        <div className="absolute bg-background rounded-md shadow-lg top-0 left-0 w-full h-auto z-50 p-6">
          <div className="flex gap-6 justify-end">
            <Button
              onClick={() => {
                setInput({
                  name: "",
                  serverKey: "",
                  serverUrl: "",
                });
                setAdding(true);
              }}
              variant={"default"}
              className=" font-semibold  text-white cursor-pointer">
              <Plus /> <span> Add custom Platform</span>
            </Button>
            <Button
              variant={"outline"}
              onClick={() => setShowAdd(false)}
              className="cursor-pointer">
              <X />
            </Button>
          </div>
          <div className="mt-5 grid w-[70%]  mx-auto grid-cols-5 gap-x-3 gap-y-6">
            {destinationLabels.map((destination, id) => (
              <div
                onClick={() => selectPlatform(destination.name)}
                className="flex cursor-pointer flex-col items-center"
                key={id}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") selectPlatform(destination.name);
                }}>
                {destination.icon}
                <span className="text-foreground mt-2">{destination.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {destinations.length < 1 ? (
        <div>
          <div className="flex justify-between">
            <p className="font-bold text-2xl text-foreground">Destinations</p>
          </div>
          <div className="w-full flex items-center justify-center h-[600px] ">
            <div className="flex items-center flex-col">
              <p className="text-white text-[18px] ">No platforms yet</p>
              <p className="text-white w-[70%] text-[14px] text-center font-nuni ">
                Connect your preferred platforms to broadcast your event. Stream
                to Facebook, YouTube, or a custom destination all at once.
              </p>
              <div className="flex gap-x-5 mt-4">
                <Button
                  onClick={() => setShowAdd(true)}
                  className="flex cursor-pointer items-center text-white ml-2 text-[18px] rounded-lg mb-4 bg-[#0062FF] px-2 h-[45px] ">
                  + Add Platform
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full  ">
          <div className="flex mb-12 justify-between">
            <p className="font-bold text-2xl text-foreground">Destinations</p>
            <div className="">
              <Button
                onClick={() => setShowAdd(true)}
                variant={"default"}
                className=" font-semibold text-white cursor-pointer">
                <Plus /> <span> Add Platform</span>
              </Button>
            </div>
          </div>
          <Accordion
            type="single"
            collapsible
            className="w-full border-0"
            defaultValue={destinations[0]?._id}>
            {destinations.map((destination) => {
              const key = destination._id;
              return (
                <AccordionItem
                  value={key}
                  key={key}
                  className="border-none hover:border-none">
                  <AccordionTrigger className="cursor-pointer  rounded-bl-none rounded-br-none hover:no-underline bg-background  [&>svg]:hidden pb-4 pt-2 px-2">
                    <div className="flex justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="flex  gap-4 items-center">
                          {getPlatformIcon(destination?.name)}
                          <span className="mt-1 text-[12px] text-white">
                            {destination?.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <Switch
                          className="text-primary"
                          checked={!!enabled[destination._id]}
                          disabled={loadingMap[destination._id]}
                          onCheckedChange={(checked) =>
                            onEnableDestination(checked, destination._id)
                          }
                          onClick={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                        />
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
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={handleEditDestination.bind(
                                  null,
                                  destination,
                                )}>
                                <Edit size={15} /> Update
                              </Button>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setDesToEdit(destination);
                                  setOpenDeleteModal(true);
                                }}
                                className="cursor-pointer z-10">
                                <Trash2 size={15} className="text-red-500" />{" "}
                                Delete
                              </Button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="border-b mb-4 z-10 rounded-bl-lg rounded-br-lg shadow-lg bg-background">
                    <div className="px-6">
                      <p className="flex items-center gap-6">
                        <span className="font-bold">URL:</span>{" "}
                        <span className="text-primary">
                          {destination?.serverUrl}
                        </span>
                      </p>
                      <p className="flex items-center gap-6 mt-4">
                        <span className="font-bold">KEY:</span>{" "}
                        <span className="text-primary">
                          {destination?.serverKey}
                        </span>
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default DestinationsPage;
