'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddCampaignPage() {
  const router = useRouter();
  const [campaignName, setCampaignName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [campaignType, setCampaignType] = useState('');
  const [platform, setPlatform] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    const payload = {
      name: campaignName,
      type: campaignType.toLowerCase().replace(' ', '_'),
      budget: parseFloat(budget),
      platform: platform.toLowerCase(),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      // status intentionally omitted if default is handled by backend
    };
  
    try {
      const response = await fetch('http://localhost:4000/active-campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const text = await response.text(); // always read raw text first
      console.log('📦 Raw response:', text);
  
      if (!response.ok) {
        let result;
        try {
          result = JSON.parse(text);
          console.error('❌ Backend Error (parsed):', result);
          alert(result?.message || JSON.stringify(result));
        } catch (jsonError) {
          console.error('❌ Backend Error (not JSON):', text);
          alert(text || 'Unexpected server error');
        }
        return;
      }
  
      alert('Campaign added successfully!');
      router.push('/campaign');
    } catch (err: unknown) {
      console.error('Network error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error occurred. Check the console.');
      }
    }
  };
  

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Add Campaign</h1>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="campaignName" className="block text-sm font-medium text-gray-800">
            Campaign Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="campaignName"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded text-gray-900"
            required
          />
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-800">
            Budget ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded text-gray-900"
            required
          />
        </div>

        <div>
          <label htmlFor="campaignType" className="block text-sm font-medium text-gray-800">
            Type of Campaign <span className="text-red-500">*</span>
          </label>
          <select
            id="campaignType"
            value={campaignType}
            onChange={(e) => setCampaignType(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded text-gray-900"
            required
          >
            <option value="">Select Campaign Type</option>
            <option value="Marketing">Marketing</option>
            <option value="Advertising">Advertising</option>
            <option value="Event Promotion">Event Promotion</option>
            <option value="Sales">Sales</option>
            <option value="Advocacy">Advocacy</option>
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-800">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded text-gray-900"
            required
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-800">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded text-gray-900"
            required
          />
        </div>

        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-gray-800">
            Platform <span className="text-red-500">*</span>
          </label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded text-gray-900"
            required
          >
            <option value="">Select Platform</option>
            <option value="Facebook">Facebook</option>
            <option value="Twitter">Twitter</option>
            <option value="Instagram">Instagram</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="YouTube">YouTube</option>
            <option value="TikTok">TikTok</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          aria-label="Submit new campaign"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Add Campaign
        </button>
      </form>
    </div>
  );
}
