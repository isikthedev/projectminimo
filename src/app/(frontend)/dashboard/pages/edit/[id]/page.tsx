import React from "react";
import { getPayload } from "payload";
import { headers as getHeaders } from "next/headers.js";
import { redirect } from "next/navigation";
import config from "@/payload.config";
import PageForm from "@/components/page-form";
import { notFound } from "next/navigation";

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const headers = await getHeaders();
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const { user } = await payload.auth({ headers });

  if (!user) {
    redirect("/login");
  }

  try {
    const page = await payload.findByID({
      collection: "pages",
      id: id,
    });

    if (!page) {
      notFound();
    }

    return (
      <div className="p-6">
        <PageForm initialData={page} pageId={id} />
      </div>
    );
  } catch (e) {
    notFound();
  }
}
