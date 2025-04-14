'use client';

import { Campaign } from '@/app/components/CampaignList';
import * as React from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  data: Campaign[];
};

export default function CampaignTable({ data }: Props) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">ALL CAMPAIGNS</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Campaign Name</th>
              <th className="py-2">Start Date</th>
              <th className="py-2">End Date</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-4 text-center text-gray-400">
                  No campaigns found.
                </td>
              </tr>
            ) : (
              data
                .filter((campaign) => campaign.status !== 'Pending')
                .map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      router.push(`/campaign/tabs/details/${campaign.id}`)
                    }
                  >
                    <td className="py-3 text-gray-800">{campaign.name}</td>
                    <td className="py-3 text-gray-800">{campaign.startDate}</td>
                    <td className="py-3 text-gray-800">{campaign.endDate}</td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-3 py-1 text-xs rounded-full ${
                          campaign.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-200 text-red-700'
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
