import api from "./api";

const API_URL = "/likes/";

class LikesService {
  // Like a gallery file
  likeFile(fileId: number) {
    return api.post(`${API_URL}like`, { fileId }).then(res => res.data);
  }

  // Unlike a gallery file
  unlikeFile(fileId: number) {
    return api.post(`${API_URL}unlike`, { fileId }).then(res => res.data);
  }

  // Get all likes for a specific file
  getFileLikes(fileId: number) {
    return api.get(`${API_URL}file/${fileId}`).then(res => res.data);
  }

  // Check if the current user liked a file
  checkLikeStatus(fileId: number) {
    return api.get(`${API_URL}status/${fileId}`).then(res => res.data);
  }

  // Get total like count of a file
  getLikeCount(fileId: number) {
    return api.get(`${API_URL}count/${fileId}`).then(res => res.data);
  }

  // Get new like notifications for the logged-in user
  getLikeNotifications() {
    return api.get(`${API_URL}notifications`).then(res => res.data);
  }

  // Get all liked files of a user by username
  getUserLikes(username: string) {
    return api.get(`${API_URL}user/${username}`).then(res => res.data);
  }
  markAsSeen(likeId: number) {
  return api.post(`/likes/seen/${likeId}`).then(res => res.data);
}

}

export default new LikesService();
