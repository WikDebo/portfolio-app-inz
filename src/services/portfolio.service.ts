import api from "./api";

export class PortfolioService {

  createPortfolio(data: { title?: string; description?: string }) {
    return api.post("/portfolio/user/create", data).then(res => res.data);
  }

  editPortfolio(data: { title?: string; description?: string }) {
    return api.put("/portfolio/user/edit", data).then(res => res.data);
  }

  getMyPortfolio() {
    return api.get("/portfolio/user").then(res => res.data);
  }

  getPortfolio(username: string) {
    return api.get(`/portfolio/${username}`).then(res => res.data);
  }

  addCategory(data: { categoryName?: string; description?: string }) {
    return api.post("/portfolio/user/category/create", data).then(res => res.data);
  }

  editCategory(categoryId: number, data: { categoryName?: string; description?: string }) {
    return api.put(`/portfolio/user/category/${categoryId}/edit`, data).then(res => res.data);
  }

  deleteCategory(categoryId: number) {
    return api.delete(`/portfolio/user/category/${categoryId}/delete`);
  }
  getMyCategoryById(categoryId: number) {
    return api.get(`/portfolio/category/user/${categoryId}`).then(res => res.data);
  }

  getMyCategories() {
    return api.get("/portfolio/category/user").then(res => res.data);
  }

  getUserCategories(username: string) {
    return api.get(`/portfolio/category/${username}`).then(res => res.data);
  }
  getUserCategoryById( username: string, categoryId: number) {
    return api.get(`/portfolio/category/${username}/${categoryId}`).then(res => res.data);
  }

  uploadPortfolioFile(categoryId: number, formData: FormData) {
    return api.post(`/portfolio/user/upload/${categoryId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(res => res.data);
  }

  getMyPortfolioFiles() {
    return api.get("/portfolio/files/user").then(res => res.data);
  }

  getUserPortfolioFiles(username: string) {
    return api.get(`/portfolio/files/${username}`).then(res => res.data);
  }

  deletePortfolioFiles(fileId: number) {
    return api.delete(`/portfolio/user/files/${fileId}`, { data: { fileId } }).then(res => res.data);
  }
}

export default new PortfolioService();
