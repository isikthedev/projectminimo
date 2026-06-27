"use client";

import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import("./RichEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full animate-pulse rounded-lg bg-muted/20" />
  ),
});

export default RichEditor;
