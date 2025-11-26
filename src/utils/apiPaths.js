
export const BASE_URL = "http://localhost:5000";


export const API_PATH = {
    AUTH: {
        LOGIN: "/api/auth/login",
        REGISTER: "/api/auth/register",
        GET_PROFILE: "/api/auth/profile",
        VERIFY_EMAIL: "/api/auth/verify-email",
        CHANGE_PASSWORD: "/api/auth/change-password"
    },
    RESUME: {
        CREATE: "/api/resume",
        GET_ALL: "/api/resume",
        GET_BY_ID: (id) => `/api/resume/${id}`,

        UPDATE: (id) => `/api/resume/${id}`,
        DELETE: (id) => `/api/resume/${id}`,
        UPLOAD_IMAGES: (id) => `/api/resume/${id}/upload-image`,
    },
    image: {
        UPLOAD_IMAGE: 'api/auth/upload-image'
    }

}