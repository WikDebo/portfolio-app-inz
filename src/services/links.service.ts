import api from "./api";

const API_URL = "/links/";

class LinkService {
  getMyLinks() {
    return api.get(API_URL).then(res => res.data);
  }

  getUserLinks(username: string) {
    return api.get(`${API_URL}${username}`).then(res => res.data);
  }

  addLink(link: string) {
    return api.post(API_URL, { link }).then(res => res.data);
  }

  updateLink(id: number, link: string) {
    return api.put(`${API_URL}${id}`, { link }).then(res => res.data);
  }

  deleteLink(id: number) {
    return api.delete(`${API_URL}${id}`).then(res => res.data);
  }
}

export default new LinkService();