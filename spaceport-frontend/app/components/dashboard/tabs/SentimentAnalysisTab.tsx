"use client";

import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const SentimentAnalysisTab = () => {
    const [sentimentData] = useState([
        { name: "Positive", value: 120 },
        { name: "Neutral", value: 50 },
        { name: "Negative", value: 30 }
    ]);

    const [sentimentTrend] = useState([
        { month: "Jan", positive: 60, neutral: 30, negative: 10 },
        { month: "Feb", positive: 55, neutral: 35, negative: 10 },
        { month: "Mar", positive: 65, neutral: 25, negative: 10 },
        { month: "Apr", positive: 70, neutral: 20, negative: 10 }
    ]);

    const totalResponses: number = sentimentData.reduce((acc, curr) => acc + curr.value, 0);
    const COLORS = ["#4CAF50", "#FFC107", "#F44336"];

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Sentiment Analysis</h2>
            <div className="flex flex-col md:flex-row justify-between">
                <div className="w-full md:w-1/2 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={sentimentData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={120}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                nameKey="name"
                            >
                                {sentimentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value, name) => {
                                    const numValue = Number(value);
                                    return [
                                        `${numValue} (${((numValue / totalResponses) * 100).toFixed(1)}%)`,
                                        name
                                    ];
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 mt-4 md:mt-0">
                    <h3 className="text-lg font-semibold mb-4">Sentiment Summary</h3>
                    <ul className="space-y-3">
                        {sentimentData.map((item, index) => (
                            <li key={index} className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <div
                                        className="w-4 h-4 rounded-full mr-2"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span className="text-gray-700">{item.name}</span>
                                </div>
                                <span
                                    className={`font-semibold ${
                                        item.name === "Positive"
                                            ? "text-green-500"
                                            : item.name === "Neutral"
                                            ? "text-yellow-500"
                                            : "text-red-500"
                                    }`}
                                >
                                    {item.value} ({((item.value / totalResponses) * 100).toFixed(1)}%)
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 text-gray-600">
                        <strong>Total Responses:</strong> {totalResponses}
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Sentiment Trend Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={sentimentTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="positive" stroke="#4CAF50" name="Positive" />
                        <Line type="monotone" dataKey="neutral" stroke="#FFC107" name="Neutral" />
                        <Line type="monotone" dataKey="negative" stroke="#F44336" name="Negative" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );  
};

export default SentimentAnalysisTab;
