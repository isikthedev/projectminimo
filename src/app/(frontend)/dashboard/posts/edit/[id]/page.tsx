import React from "react";
import { getPayload } from "payload";
import { headers as getHeaders } from "next/headers.js";
import { redirect } from "next/navigation";
import config from "@/payload.config";
import PostForm from "@/components/post-form";
import { notFound } from "next/navigation";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const headers = await getHeaders();
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const { user } = await payload.auth({ headers });

  if (!user) {
    redirect("/login");
  }

  try {
    const post = await payload.findByID({
      collection: "posts",
      id: id,
    });

    if (!post) {
      notFound();
    }

    return (
      <div className="p-6">
        <PostForm initialData={post} postId={id} />
      </div>
    );
  } catch (e) {
    notFound();
  }
}
