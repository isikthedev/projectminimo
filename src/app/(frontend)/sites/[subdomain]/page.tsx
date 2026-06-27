import React from 'react';
import { getPayload } from 'payload';
import config from '@payload-config';

interface PageProps {
  params: Promise<{
    subdomain: string
  }>;
}

export default async function Page({ params }: PageProps) {
  const { subdomain } = await params;

  // Initialize Payload client on the server side
  const payload = await getPayload({ config });

  // Fetch the tenant document by slug (subdomain)
  const result = await (payload as any).find({
    collection: 'tenants',
    where: { slug: { equals: subdomain } },
    limit: 1,
  });
  const tenant = result?.docs?.[0];

  // Render based on tenant existence and status
  if (!tenant) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
        <h1 className="text-3xl font-bold">404 - Site Not Found</h1>
      </div>
    );
  }

  if (!tenant.isActive) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
        <h1 className="text-3xl font-bold">This site is temporarily suspended</h1>
      </div>
    );
  }

  // Active tenant – display the tenant name
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-8 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-400 mb-2 border border-indigo-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.905 0-5.64-.783-7.843-2.148m15.686 0A11.963 11.963 0 0112 12c-2.905 0-5.64-.783-7.843-2.148m15.686 0c.277.674.43 1.411.43 2.182 0 3.314-2.686 6-6 6-1.895 0-3.585-1.06-4.48-2.65"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{tenant.name}</h1>
        <p className="text-slate-400 text-sm font-medium">
          Welcome to the site for subdomain: <span className="text-indigo-400 font-semibold">{subdomain}</span>
        </p>
      </div>
    </div>
  );
}
