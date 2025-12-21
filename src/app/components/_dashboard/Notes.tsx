"use client";
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import axiosApi from "@/lib/axios";
import React, { useState, useEffect, useRef } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
};

const NotesFromEvents = () => {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<string[]>([]);
  const menuRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const getNotes = async () => {
      try {
        const res = await axiosApi.get(`/notes`);
        if (res.data.status === "success") {
          setNotes(res.data.data.notes);
          console.log("notes", notes);
          console.log("notes res", res.data.data.notes);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    getNotes();
  }, []);
  const toggleMenu = (index: number) => {
    setOpenMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleReadMore = (id: string) => {
    setExpandedNotes((prev: string[]) =>
      prev.includes(id) ? prev.filter((noteId) => noteId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutside = menuRefs.current.every(
        (ref) => !ref || !ref.contains(event.target as Node)
      );
      if (clickedOutside) {
        setOpenMenuIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className="bg-[#FBFDFF] dark:bg-gray-900 p-4   md:p-5 mt-6 rounded-md">
      <div className="flex items-center w-fit gap-3 mb-6">
        <img src="/images/Notes.png" className="h-8" alt="Notes icon" />
        <h1 className="text-foreground text-[19px] m-0 font-medium">
          Notes from Events
        </h1>
      </div>

      {notes.length > 0 ? (
        notes.map((note, index) => {
          const formattedDate = new Date(note.createdAt).toLocaleDateString(
            undefined,
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          );

          return (
            <div key={note._id} className="py-3 rounded-md mb-4 relative">
              {/* Date on top */}
              <p className="text-sm text-gray-400 dark:text-gray-400 mb-1">
                {formattedDate}
              </p>

              {/* Title */}
              <h2 className="text-[#656565] mt-0 mb-2 dark:text-white font-medium text-[18px]">
                {note.title}
              </h2>

              {/* Content */}
              <p className="text-[#656565] dark:text-gray-300 text-base mt-1 leading-snug">
                {expandedNotes.includes(note._id)
                  ? note.content
                  : `${note.content.slice(0, 130)}...`}
                <span
                  className="text-blue-600 cursor-pointer ml-1"
                  onClick={() => toggleReadMore(note._id)}>
                  {expandedNotes.includes(note._id) ? "Read less" : "Read more"}
                </span>
              </p>

              {/* Menu */}
              <div
                className="absolute top-3 right-3"
                // ref={(el) => (menuRefs.current[index] = el)}
              >
                <button
                  onClick={() => toggleMenu(index)}
                  className="text-gray-500 hover:text-black dark:hover:text-white focus:outline-none">
                  <BsThreeDotsVertical size={16} />
                </button>

                {openMenuIndex === index && (
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg z-10 ">
                    <button
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => {
                        setOpenMenuIndex(null);
                        // onEdit(note);
                      }}>
                      <img src="/edit.png" alt="Edit icon" />
                      Edit
                    </button>
                    <button
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => {
                        setOpenMenuIndex(null);
                        // onDelete(note._id);
                      }}>
                      <img src="/delete.png" alt="Delete icon" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h4 className="text-gray-600 dark:text-gray-300 text-lg">
            No Notes Found
          </h4>
        </div>
      )}
    </section>
  );
};

export default NotesFromEvents;
