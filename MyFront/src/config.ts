export const API_URL = 'http://localhost:5064';

export const config = {
    apiUrl: API_URL,
    endpoints: {
        register: `${API_URL}/api/auth/register`,
        login: `${API_URL}/api/auth/login`,
        contact: `${API_URL}/api/contact/send`,
        admin: {
            users: `${API_URL}/api/admin/users`,
            events: `${API_URL}/api/admin/events`,
            orders: `${API_URL}/api/admin/orders`,
            payments: `${API_URL}/api/admin/payments`,
            reviews: `${API_URL}/api/admin/reviews`,
            contactMessages: `${API_URL}/api/admin/contact-messages`,
            statistics: `${API_URL}/api/admin/statistics`
        }
    }
}; 