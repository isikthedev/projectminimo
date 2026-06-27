import React from "react";
import { headers as getHeaders } from "next/headers.js";
import { getPayload } from "payload";
import { redirect } from "next/navigation";
import config from "@/payload.config";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Image from "next/image";

export default async function PostsPage() {
  const headers = await getHeaders();
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const { user } = await payload.auth({ headers });

  if (!user) {
    redirect("/login");
  }

  const tenantId = user.tenant && typeof user.tenant === "object" ? user.tenant.id : user.tenant;

  if (!tenantId) {
    return (
      <div className="p-6">
        <p>No tenant associated with your account. Please contact an administrator.</p>
      </div>
    );
  }

  const posts = await payload.find({
    collection: "posts",
    where: {
      tenant: {
        equals: tenantId,
      },
    },
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your tenant's blog articles and updates.</p>
        </div>
        <Link href="/dashboard/posts/create">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New Post
          </Button>
        </Link>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.docs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No posts found. Start by creating your first one!
                </TableCell>
              </TableRow>
            ) : (
              posts.docs.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted">
                      {post.coverImage && typeof post.coverImage === 'object' && post.coverImage.url ? (
                        <Image
                          src={post.coverImage.url}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    <Badge variant={post.status === "published" ? "default" : "secondary"}>
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/posts/edit/${post.id}`}>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
