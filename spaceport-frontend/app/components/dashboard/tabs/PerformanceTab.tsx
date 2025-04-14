"use client";

import { useEffect, useState } from "react";
import { Campaign, getCampaigns } from "@/app/components/CampaignList";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function PerformanceTab() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCampaigns();
      setCampaigns(data);
    };

    fetchData();
  }, []);

  // Derived Metrics
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.Impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.Clicks, 0);
  const avgCTR = campaigns.length
    ? (campaigns.reduce((sum, c) => sum + c.CTR, 0) / campaigns.length).toFixed(1)
    : "0";
  const avgConversion = campaigns.length
    ? (campaigns.reduce((sum, c) => sum + c.Conversion, 0) / campaigns.length).toFixed(1)
    : "0";

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Performance Metrics</h2>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow text-center p-6">
          <p className="text-lg font-bold text-indigo-600">{totalImpressions}</p>
          <p className="text-gray-600 text-sm mt-1">Impressions</p>
        </div>
        <div className="bg-white rounded-lg shadow text-center p-6">
          <p className="text-lg font-bold text-yellow-600">{totalClicks}</p>
          <p className="text-gray-600 text-sm mt-1">Clicks</p>
        </div>
        <div className="bg-white rounded-lg shadow text-center p-6">
          <p className="text-lg font-bold text-blue-600">{avgCTR}%</p>
          <p className="text-gray-600 text-sm mt-1">CTR (Click-Through Rate)</p>
        </div>
        <div className="bg-white rounded-lg shadow text-center p-6">
          <p className="text-lg font-bold text-green-600">{avgConversion}%</p>
          <p className="text-gray-600 text-sm mt-1">Conversion Rate</p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-md font-semibold mb-4 text-gray-700">Campaign Performance Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={campaigns}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name"/>
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Impressions" stroke="#6366f1" />
            <Line type="monotone" dataKey="Clicks" stroke="#facc15" />
            <Line type="monotone" dataKey="CTR" stroke="#FF0000" />
            <Line type="monotone" dataKey="Conversion" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
