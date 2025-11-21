import api from "./api";

const API_URL = "/connection/";

class ConnectionsService {
  // Follow a user
  follow(username: string) {
    return api.post(API_URL, { username }).then(res => res.data);
  }

  // Unfollow a user
  unfollow(username: string) {
    return api.delete(API_URL, { data: { username } }).then(res => res.data);
  }

  // Is logged-in user following X?
  checkFollowStatus(username: string) {
    return api.get(`${API_URL}status/${username}`).then(res => res.data);
  }

  // Followers / following
  getFollowerStats(username: string) {
    return api.get(`${API_URL}stats/${username}`).then(res => res.data);
  }

  getFollowing() {
    return api.get(`${API_URL}following`).then(res => res.data);
  }

  getFollowers() {
    return api.get(`${API_URL}followers`).then(res => res.data);
  }
  getUsersFollowing(username: string) {
    return api.get(`${API_URL}following/${username}`).then(res => res.data);
  }

  getUsersFollowers(username: string) {
    return api.get(`${API_URL}followers/${username}`).then(res => res.data);
  }

  // Notifications
  getNotifications() {
    return api.get(`${API_URL}notifications`).then(res => res.data);
  }
}

export default new ConnectionsService();
