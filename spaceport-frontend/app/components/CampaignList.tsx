// components/CampaignList.tsx
export type Campaign = {
  id: string;
  name: string;
  status: string;
  type: string;
  startDate?: string;
  endDate?: string;
  budget: number;
};

export const getCampaigns = async (token: string): Promise<Campaign[]> => {
  const response = await fetch("http://localhost:4000/active-campaigns", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch campaigns');
  }

  return response.json();
};
