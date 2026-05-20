import { API_BASE_URL, fetchData } from '../apiConfig.js';
class UserService {
  async getCurrentUser(userRecordId) {
    return fetchData(`${API_BASE_URL}/users/${userRecordId}`);
  }
}
export default new UserService();
