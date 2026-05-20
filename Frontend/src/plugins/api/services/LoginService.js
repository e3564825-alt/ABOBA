import { API_BASE_URL, fetchData } from '../apiConfig.js';
class LoginService {
    async authorizationUser(email, password) {
        return fetchData(`${API_BASE_URL}/login/auth`, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }
}
export default new LoginService();
