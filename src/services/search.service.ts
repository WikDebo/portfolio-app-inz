import api from "./api";
import type { ISearchResponse } from "../types/search.type";

const searchEverything = async (query: string): Promise<ISearchResponse> => {
  const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

export default { searchEverything };
