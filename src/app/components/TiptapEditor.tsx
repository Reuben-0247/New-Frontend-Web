"use client";
import "../styles/tiptap.scss";
import {
  EditorContent,
  useEditor,
  //   useEditorState,
  //   Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "bg-white text-black rounded-md p-3 min-h-[120px] focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // keep editor synced when RHF resets value
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  return (
    <div className="space-y-2">
      {/* toolbar */}
      <div className="flex gap-2 text-sm">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          type="button">
          Bold
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          type="button">
          Italic
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          type="button">
          Underline
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          type="button">
          • List
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          type="button">
          1. List
        </button>
        <button
          onClick={() =>
            editor?.chain().focus().unsetAllMarks().clearNodes().run()
          }
          type="button">
          Clear
        </button>
      </div>

      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
}
