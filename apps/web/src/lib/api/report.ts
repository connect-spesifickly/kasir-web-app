import { api } from "@/utils/axios";

export const reportApi = {
  getSalesReport: async (
    startDate: string,
    endDate: string,
    token?: string
  ) => {
    const response = await api.get(`/reports/sales`, {
      params: { startDate, endDate },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getProfitReport: async (
    startDate: string,
    endDate: string,
    token?: string
  ) => {
    const response = await api.get(`/reports/profit`, {
      params: { startDate, endDate },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getLossesReport: async (
    startDate: string,
    endDate: string,
    token?: string
  ) => {
    const response = await api.get(`/reports/losses`, {
      params: { startDate, endDate },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getDailyTransactions: async (
    startDate: string,
    endDate: string,
    token?: string
  ) => {
    const response = await api.get(`/reports/daily-transactions`, {
      params: { startDate, endDate },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
