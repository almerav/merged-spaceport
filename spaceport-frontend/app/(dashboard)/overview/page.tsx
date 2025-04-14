"use client";

import { useEffect, useState } from "react";
import { getCampaigns, Campaign } from "@/app/components/CampaignList";
import OverviewTab from "@/app/components/dashboard/tabs/OverviewTab";
import PerformanceTab from "@/app/components/dashboard/tabs/PerformanceTab";
import CampaignGoalMeterTab from "@/app/components/dashboard/tabs/CampaignGoalMeterTab";
import SentimentAnalysisTab from "@/app/components/dashboard/tabs/SentimentAnalysisTab";
import Brandspace from "@/app/components/dashboard/tabs/Brandspace";

// Placeholder components (replace them with actual ones later)
const BrandStatementTab = () => <div>Brand Statement Content</div>;

export default function OverviewPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCount, setActiveCount] = useState(0);
  const [endedCount, setEndedCount] = useState(0);
  const [completionRate, setCompletionRate] = useState("0%");

  const tabs = [
    { label: "Overview", key: "overview" },
    { label: "Performance Metrics", key: "performance" },
    { label: "Campaign Goal Meter", key: "goal_meter" },
    { label: "Sentiment Analysis", key: "sentiment" },
    { label: "Statement of the Brand", key: "brand" },
  ];

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      window.location.href = '/login'; // or use useRouter().push() if you prefer
      return;
    }
  
    const fetchCampaigns = async () => {
      try {
        const data = await getCampaigns(token); // pass the token
        const sorted = data.sort(
          (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        setCampaigns(sorted);
  
        const active = data.filter((c) => c.status === "Active").length;
        const inactive = data.filter((c) => c.status === "Inactive").length;
        const total = data.length;
  
        setActiveCount(active);
        setEndedCount(inactive);
        setCompletionRate(total > 0 ? `${Math.round((active / total) * 100)}%` : "0%");
      } catch (err) {
        console.error('Failed to fetch campaigns:', err);
        localStorage.removeItem('token');
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };
  
    fetchCampaigns();
  }, []);
  

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-black mb-4">Dashboard</h1>

      {/* Tab Bar */}
      <div className="flex space-x-6 mb-6 border-b border-gray-300 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`text-sm font-medium ${
              activeTab === tab.key
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <OverviewTab
          campaigns={campaigns}
          loading={loading}
          activeCount={activeCount}
          endedCount={endedCount}
          completionRate={completionRate}
        />
      )}
      {activeTab === "performance" && <PerformanceTab />}
      {activeTab === "goal_meter" && <CampaignGoalMeterTab />}
      {activeTab === "sentiment" && <SentimentAnalysisTab />}
      {activeTab === "brand" && <Brandspace />}
    </main>
  );
}
