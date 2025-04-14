'use client';

import { useParams } from 'next/navigation';

export default function CampaignDetailsPage() {
  const params = useParams();
  const campaignId = params.id;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Campaign Details</h1>
      <p className="mt-4">Campaign ID: {campaignId}</p>
    </div>
  );
}
