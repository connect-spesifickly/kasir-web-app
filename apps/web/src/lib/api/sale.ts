import { api } from "@/utils/axios";

export const saleApi = {
  create: async (
    cart: { productId: string; quantity: number }[],
    token?: string
  ) => {
    const response = await api.post<{ data: unknown }>(
      "/sales",
      { cart },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  },
};
