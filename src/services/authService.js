/**
 * Сервис для взаимодействия с API аутентификации
 */

const API_BASE_URL = 'http://195.80.51.69:8080/api/v1';

/**
 * Получает данные пользователя используя токен доступа
 * @param {string} token - Токен доступа
 * @returns {Promise<Object>} - Данные пользователя
 */
export const fetchUserData = async (token) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }
    return response.json();
};

/**
 * Обновляет токен доступа используя refresh token
 * @param {string} refreshToken - Токен обновления
 * @returns {Promise<{newAccessToken: string, userData: Object}>} - Новый токен доступа и данные пользователя
 */
export const refreshAccessToken = async (refreshToken) => {
    const response = await fetch(`${API_BASE_URL}/auth/token/authenticate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: refreshToken }),
    });
    if (!response.ok) {
        throw new Error('Failed to refresh token');
    }
    const data = await response.json();
    if (data.status !== "SUCCESS") {
        throw new Error(data.message);
    }
    const newAccessToken = data.payload[0].access.token;
    const userData = data.payload[0].data;
    return { newAccessToken, userData };
};

/**
 * Выполняет вход пользователя
 * @param {string} username - Имя пользователя или email
 * @param {string} password - Пароль пользователя
 * @returns {Promise<{accessToken: string, refreshToken: string, userData: Object}>} - Токены и данные пользователя
 */
export const login = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/token/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
        throw new Error('Failed to login');
    }
    
    const data = await response.json();
    if (data.status !== "SUCCESS") {
        throw new Error(data.message);
    }
    
    const accessToken = data.payload[0].access.token;
    const refreshToken = data.payload[0].refresh.token;
    const userData = data.payload[0].data;
    
    return { accessToken, refreshToken, userData };
};

/**
 * Регистрирует нового пользователя
 * @param {Object} userData - Данные пользователя
 * @returns {Promise<Object>} - Данные созданного пользователя
 */
export const register = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
        throw new Error('Failed to register');
    }
    
    const data = await response.json();
    if (data.status !== "SUCCESS") {
        throw new Error(data.message);
    }
    
    return data.payload[0];
}; 