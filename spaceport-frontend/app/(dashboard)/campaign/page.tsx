'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Campaign, getCampaigns } from '@/app/components/CampaignList';
import CampaignTable from '@/app/components/campaign/tabs/CampaignTable';
import PendingCampaignsTab from '@/app/components/campaign/tabs/PendingTab';
import Link from 'next/link';

const campaignTabs = ['All Campaigns', 'Pending'];

export default function CampaignManagementPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeTab, setActiveTab] = useState('All Campaigns');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCampaigns();
      setCampaigns(data);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Campaign Management</h1>
        <Link href="/campaign/tabs/add-campaign">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            + Add Campaign
          </button>
        </Link>
      </div>

      {/* Tab Bar */}
      <div className="flex space-x-4 border-b">
        {campaignTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-blue-500'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Render Tab View */}
      {activeTab === 'All Campaigns' && (
        <CampaignTable data={campaigns} />
      )}

      {activeTab === 'Pending' && (
        <PendingCampaignsTab data={campaigns} />
      )}
    </div>
  );
}
