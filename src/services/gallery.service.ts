import api from "./api";
const API_URL = "/gallery";
class GalleryService {
  uploadGalleryFile(formData: FormData) {
    return api
      .post(`${API_URL}/user/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  }

getMyGalleryFiles(order: string = "newest") {
  return api.get(`${API_URL}/user/files?order=${order}`).then(res => res.data);
}

getUserGallery(username: string, order: string = "newest") {
  return api.get(`${API_URL}/${username}/files?order=${order}`).then(res => res.data);
}

deleteGalleryFile(fileId: number) {
    return api.delete(`${API_URL}/user/files/${fileId}`).then((res) => res.data);
}
}

export default new GalleryService();
