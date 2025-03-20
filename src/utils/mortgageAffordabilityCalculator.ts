const API_URL = import.meta.env.VITE_API_URL || "https://kfnodirfo4.execute-api.eu-north-1.amazonaws.com/prod/mortgage-affordability";

export const calculateMortgageAffordability = async (
  applicant1Salary: number,
  applicant2Salary: number,
  downPayment: number,
  mortgageTerm: number,
  interestRate: number
) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicant1Salary,
        applicant2Salary,
        downPayment,
        mortgageTerm,
        interestRate
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData.error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching mortgage affordability:", error);
    throw new Error("Failed to fetch mortgage affordability data. Please try again.");
  }
};
