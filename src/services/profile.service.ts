import api from "./api";
const API_URL = "/user";

class ProfileService {
  getMyProfile() {
    return api.get(`${API_URL}/myprofile`);
  }
  async getUserByUsername(username: string) {
    return api.get(`${API_URL}/${username}`);
  }
  updateProfile(formData: FormData) {
  return api.put(`${API_URL}/update`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
  changePassword(oldPassword: string, newPassword: string){
    return api.put(`${API_URL}/changepassword`,{ 
      oldPassword, 
      newPassword 
    });
  }
  deleteProfilePhoto() {
    return api.delete(`${API_URL}/delete/profilephoto`);
  }
  deleteMyAccount() {
    return api.delete(`${API_URL}/delete`);
  }
  adminDeleteAccount(id:number) {
    return api.delete(`${API_URL}/delete/${id}`)
  }
}
export default new ProfileService();