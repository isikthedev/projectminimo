"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import FloatingMenuExtension from "@tiptap/extension-floating-menu";
import {
  Bold, Italic, Strikethrough, List, ListOrdered,
  Heading1, Heading2, Quote, Undo, Redo, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface RichEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichEditor({ content, onChange }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      FloatingMenuExtension,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[500px] p-4",
      },
    },
  });

  if (!editor) return null;

  const toolbarButtons = [
    {
      icon: <Bold className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      tooltip: "Bold",
    },
    {
      icon: <Italic className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("mark.italic"),
      tooltip: "Italic",
    },
    {
      icon: <Strikethrough className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
      tooltip: "Strikethrough",
    },
    {
      icon: <Heading1 className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive("heading", { level: 1 }),
      tooltip: "H1",
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
      tooltip: "H2",
    },
    {
      icon: <List className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      tooltip: "Bullet List",
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      tooltip: "Ordered List",
    },
    {
      icon: <Quote className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
      tooltip: "Quote",
    },
    {
      icon: <Undo className="h-4 w-4" />,
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
      tooltip: "Undo",
    },
    {
      icon: <Redo className="h-4 w-4" />,
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
      tooltip: "Redo",
    },
  ];

  return (
    <TooltipProvider>
      <div className="relative border rounded-lg bg-white overflow-hidden flex flex-col">
        {/* DOCX-style Sticky Toolbar */}
        <div className="sticky top-0 z-10 flex items-center gap-1 p-1 border-b bg-muted/30 backdrop-blur-sm">
          {toolbarButtons.map((btn, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0",
                    btn.isActive && "bg-accent text-accent-foreground"
                  )}
                  onClick={btn.action}
                >
                  {btn.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{btn.tooltip}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="relative">
          <EditorContent editor={editor} />
        </div>
      </div>
    </TooltipProvider>
  );
}
