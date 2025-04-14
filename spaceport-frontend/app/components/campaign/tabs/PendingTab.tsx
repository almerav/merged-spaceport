'use client';

import { Campaign } from '@/app/components/CampaignList';
import React from 'react';

type Props = {
  data: Campaign[];
};

export default function PendingTab({ data }: Props) {
  const filtered = data.filter((campaign) => campaign.status === 'Pending');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">PENDING CAMPAIGNS</h2>
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No pending campaigns found.</p>
      ) : (
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Campaign Name</th>
              <th className="py-2">Start Date</th>
              <th className="py-2">End Date</th>
              <th className="py-2">Budget</th>
              <th className="py-2">Type</th>
              <th className="py-2">Platforms</th>
              <th className="py-2">Image</th>
              <th className="py-2">Video</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((campaign) => (
              <tr key={campaign.id} className="border-b hover:bg-gray-50">
                <td className="py-3 text-gray-800">{campaign.name}</td>
                <td className="py-3 text-gray-800">{campaign.startDate}</td>
                <td className="py-3 text-gray-800">{campaign.endDate}</td>
                <td className="py-3 text-gray-800">{campaign.budget}</td>
                <td className="py-3 text-gray-800">{campaign.type}</td>
                <td className="py-3 text-gray-800">
                  {campaign.platforms.join(', ')}
                </td>
                <td className="py-3 text-gray-800">
                  {campaign.image ? (
                    <a href={URL.createObjectURL(campaign.image)} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      View Image
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="py-3 text-gray-800">
                  {campaign.video ? (
                    <a href={URL.createObjectURL(campaign.video)} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      View Video
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="py-3">
                  <span className="inline-block px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                    {campaign.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
