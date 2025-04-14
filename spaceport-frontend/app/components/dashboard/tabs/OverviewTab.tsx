"use client";

import { Campaign } from "@/app/components/CampaignList";

type OverviewTabProps = {
  campaigns: Campaign[];
  loading: boolean;
  activeCount: number;
  endedCount: number;
  completionRate: string;
};

export default function OverviewTab({
  campaigns,
  loading,
  activeCount,
  endedCount,
  completionRate,
}: OverviewTabProps) {
  return (
    <>
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow text-center p-10">
          <p className="text-xl font-bold text-blue-600">{activeCount}</p>
          <p className="text-gray-600 text-sm mt-1">Running Campaigns</p>
        </div>
        <div className="bg-white rounded-lg shadow text-center p-10">
          <p className="text-xl font-bold text-green-600">{completionRate}</p>
          <p className="text-gray-600 text-sm mt-1">Avg Completion Rate</p>
        </div>
        <div className="bg-white rounded-lg shadow text-center p-10">
          <p className="text-xl font-bold text-red-600">{endedCount}</p>
          <p className="text-gray-600 text-sm mt-1">Ended Campaigns</p>
        </div>
      </div>

      {/* Campaign Table */}
      <div className="bg-white rounded-lg shadow overflow-auto">
        <h2 className="text-lg font-semibold text-gray-700 px-6 pt-6 pb-2 text-center">
          ACTIVE CAMPAIGN LIST TABLE
        </h2>
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-3">Campaign Name</th>
              <th className="px-6 py-3">Start Date</th>
              <th className="px-6 py-3">End Date</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                  Loading campaigns...
                </td>
              </tr>
            ) : campaigns.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center italic text-gray-500">
                  No active campaigns found.
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-t border-gray-200">
                  <td className="px-6 py-4">{campaign.name}</td>
                  <td className="px-6 py-4">
                    {new Date(campaign.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(campaign.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        campaign.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
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
    </>
  );
}
