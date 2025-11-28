import api from "./api";
const API_URL = "/feed";

class FeedService {
  getHomeFeed(page = 1, limit = 20) {
    return api.get(`${API_URL}/home?page=${page}&limit=${limit}`);
  }

  getFollowingFeed(page = 1, limit = 20) {
    return api.get(`${API_URL}/following?page=${page}&limit=${limit}`);
  }
  getPopularPosts(page = 1, limit = 20){
    return api.get(`${API_URL}/popular?page=${page}&limit=${limit}`);
  }  
  searchEverything(query: string) {
    return api
      .get(`/search?query=${encodeURIComponent(query)}`)
      .then(res => res.data); // returns ( users, portfolios, gallery )
  }
}

export default new FeedService();
