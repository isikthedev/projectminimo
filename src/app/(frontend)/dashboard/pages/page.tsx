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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Pencil } from "lucide-react";

export default async function PagesPage() {
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
        <p>No tenant associated with your account.</p>
      </div>
    );
  }

  const pages = await payload.find({
    collection: "pages",
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
          <h1 className="text-2xl font-bold tracking-tight">Website Pages</h1>
          <p className="text-muted-foreground">Manage the pages for your store storefront.</p>
        </div>
        <Link href="/dashboard/pages/create">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Page
          </Button>
        </Link>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.docs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No pages found.
                </TableCell>
              </TableRow>
            ) : (
              pages.docs.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell className="text-muted-foreground">{page.slug}</TableCell>
                  <TableCell>
                    {page.createdAt ? new Date(page.createdAt).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/pages/edit/${page.id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
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
