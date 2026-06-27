"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import BlockEditor from "@/components/BlockEditor";
import { ArrowLeft, Save, Send } from "lucide-react";

interface PostFormProps {
  initialData?: any;
  postId?: string;
}

export default function PostForm({ initialData, postId }: PostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    coverImage: initialData?.coverImage || "",
    status: initialData?.status || "draft",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        slug: initialData.slug || "",
        excerpt: initialData.excerpt || "",
        content: initialData.content || "",
        coverImage: initialData.coverImage || "",
        status: initialData.status || "draft",
      });
    }
  }, [initialData]);

  const handleTitleChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const method = postId ? "PATCH" : "POST";
      const url = postId ? `/api/posts/${postId}` : `/api/posts`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save post");

      toast.success(postId ? "Post updated successfully" : "Post created successfully");
      router.push("/dashboard/posts");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fixed inset-0 flex flex-col bg-white overflow-hidden">
      {/* Header Top-Bar */}
      <div className="h-14 border-b flex items-center justify-between px-4 shrink-0 bg-white z-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => router.push("/dashboard/posts")}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm font-medium text-muted-foreground">
            {postId ? "Editing Post" : "New Post"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-2" onClick={(e) => { e.preventDefault(); handleSubmit(e as any); }}>
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button size="sm" className="gap-2 bg-black text-white hover:bg-black/90" disabled={isLoading}>
            {isLoading ? "Publishing..." : "Publish"}
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex h-[calc(100vh-56px)] overflow-hidden w-full">
        {/* Left Writing Canvas */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-3xl mx-auto p-8 space-y-6">
            <input
              type="text"
              placeholder="Add title"
              className="text-5xl font-bold bg-transparent border-0 focus:ring-0 outline-none w-full placeholder:text-muted-foreground/50"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
            <BlockEditor
              content={formData.content}
              onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
            />
          </div>
        </div>

        {/* Right Settings Sidebar */}
        <div className="w-80 border-l bg-slate-50/50 p-6 overflow-y-auto flex flex-col gap-8">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">Featured Image</Label>
            <div className="aspect-video w-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 bg-white hover:bg-slate-100 transition-colors cursor-pointer overflow-hidden relative">
              {formData.coverImage ? (
                <img src={formData.coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">?</div>
                  <span className="text-xs text-muted-foreground">Add Cover Image</span>
                </>
              )}
            </div>
            <Input
              className="mt-2"
              placeholder="https://..."
              value={formData.coverImage}
              onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
            />
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">Excerpt</Label>
            <Textarea
              placeholder="Short summary..."
              className="bg-white"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            />
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
            >
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">Slug</Label>
            <Input
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              required
            />
          </div>

          <div className="pt-4 border-t">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Author</Label>
            <div className="inline-flex items-center px-2 py-1 rounded bg-slate-200 text-slate-700 text-xs font-medium">
              Merchant Admin
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
