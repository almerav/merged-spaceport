"use client";

import React, { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CampaignGoalMeterTab: React.FC = () => {
    const [goal, setGoal] = useState<number>(10000);
    const [achieved, setAchieved] = useState<number>(0);
    const [expected, setExpected] = useState<number>(0);
    const [impressions, setImpressions] = useState<number>(0);
    const [clicks, setClicks] = useState<number>(0);
    const [conversions, setConversions] = useState<number>(0);

    // Mock Data Function
    const fetchMockData = async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    goal: 10000,
                    achieved: 4500,
                    expected: 6000,
                    impressions: 25000,
                    clicks: 1200,
                    conversions: 350,
                });
            }, 1000); // Simulate network delay
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data: any = await fetchMockData(); // Use mock data
                setGoal(data.goal);
                setAchieved(data.achieved);
                setExpected(data.expected);
                setImpressions(data.impressions);
                setClicks(data.clicks);
                setConversions(data.conversions);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const actualProgress = goal ? (achieved / goal) * 100 : 0;
    const expectedProgress = goal ? (expected / goal) * 100 : 0;

    return (
        <div className="p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Campaign Goal Meter</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: "Goal", value: goal, bg: "bg-gray-100" },
                    { label: "Achieved", value: achieved, bg: "bg-green-100" },
                    { label: "Expected", value: expected, bg: "bg-blue-100" },
                    { label: "Impressions", value: impressions, bg: "bg-yellow-100" },
                    { label: "Clicks", value: clicks, bg: "bg-purple-100" },
                    { label: "Conversions", value: conversions, bg: "bg-indigo-100" }
                ].map(({ label, value, bg }, index) => (
                    <div key={index} className={`${bg} p-4 rounded-lg shadow-sm`}>
                        <p className="text-gray-600">{label}</p>
                        <p className="text-2xl font-bold">{value.toLocaleString()}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col md:flex-row items-center justify-around">
                <div className="flex gap-12">
                    {[
                        { progress: actualProgress, color: "text-green-500", label: "Actual Progress" },
                        { progress: expectedProgress, color: "text-yellow-500", label: "Expected Progress" }
                    ].map(({ progress, color, label }, index) => (
                        <div key={index} className="w-72 h-72 flex flex-col items-center">
                            <CircularProgressbar
                                value={progress}
                                text={`${progress.toFixed(1)}%`}
                                className={`stroke-current ${color}`}
                            />
                            <p className="text-center mt-4 font-medium">{label}</p>
                        </div>
                    ))}
                </div>

                <div className="w-full md:w-1/2 mt-8 md:mt-0">
                    <p className="text-lg font-bold mb-2">Overall Progress</p>
                    <div className="w-full bg-gray-200 rounded-full h-6 relative">
                        <div
                            className="bg-blue-500 h-6 rounded-full transition-all duration-500"
                            style={{ width: `${actualProgress}%` }}
                        />
                    </div>
                    <p className="text-center mt-2 text-lg font-medium">
                        {actualProgress.toFixed(1)}% Actual vs. {expectedProgress.toFixed(1)}% Expected
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CampaignGoalMeterTab;
