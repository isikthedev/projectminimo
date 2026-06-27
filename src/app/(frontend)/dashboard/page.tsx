import { getPayload } from "payload";
import config from "@/payload.config";
import { headers as getHeaders } from "next/headers";
import { redirect } from "next/navigation";
import StatisticsBlock from "@/components/shadcn-space/radix/blocks/dashboard-shell-01/statistics";
import SalesOverviewChart from "@/components/shadcn-space/radix/blocks/dashboard-shell-01/sales-overview-chart";
import EarningReportChart from "@/components/shadcn-space/radix/blocks/dashboard-shell-01/earning-report-chart";


export default async function Page(props: { params?: Promise<any> }) {
  // Await params if provided to comply with Next.js 16 requirements
  if (props.params) {
    await props.params;
  }

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await getHeaders() });

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

  // Fetch Page count for stats
  let pageCount = 0;
  if (tenantId) {
    try {
      const pages = await payload.find({
        collection: "pages",
        where: {
          tenant: { equals: tenantId },
        },
      });
      pageCount = pages.totalDocs;
    } catch (e) {
      // Ignore
    }
  }

  return (
    <div className="grid grid-cols-12 gap-6 p-6 max-w-7xl mx-auto">
      <div className="col-span-12">
        <StatisticsBlock tenantName={tenantName} pageCount={pageCount} />
      </div>
      <div className="xl:col-span-8 col-span-12">
        <SalesOverviewChart />
      </div>
      <div className="xl:col-span-4 col-span-12">
        <EarningReportChart />
      </div>

    </div>
  );
}
