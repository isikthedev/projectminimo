import React from "react";
import { headers as getHeaders } from "next/headers.js";
import { getPayload } from "payload";
import { redirect } from "next/navigation";
import config from "@/payload.config";
import AppSidebar from "@/components/shadcn-space/radix/blocks/dashboard-shell-01/app-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ── Auth check ──────────────────────────────────────────────────────────────
  const headers = await getHeaders();
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const { user } = await payload.auth({ headers });

  if (!user) {
    redirect("/login");
  }

  const tenantId = user.tenant && typeof user.tenant === "object" ? user.tenant.id : user.tenant;

  // Fetch Tenant details using logged-in user tenant id to avoid first tenant fallback
  let tenantName = "Minimo";
  if (tenantId) {
    try {
      const tenant = await payload.findByID({
        collection: "tenants",
        id: tenantId,
      });
      tenantName = tenant.name;
    } catch (e) {
      // Ignore
    }
  }

  const userEmail = user.email || "";
  const userName = userEmail.split("@")[0];

  // Mount the children directly within AppSidebar without any redundant spacing wrappers
  return (
    <AppSidebar tenantName={tenantName} userEmail={userEmail} userName={userName}>
      {children}
    </AppSidebar>
  );
}
