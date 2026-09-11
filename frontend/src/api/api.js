import axios from 'axios'
import endPoints from './endpoints.js'
import ApiError from '../utlis/errorHandler.js'


const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URI}/api`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

const getToken = () => {
    return localStorage.getItem('accesstoken')
}

let refreshPromise = null;

const refreshAccessToken = async () => {
    if (!refreshPromise) {
        refreshPromise = api.post("/auth/refresh")
            .then(({ data }) => {
                const newToken = data.data?.accessToken;

                if (!newToken) {
                    throw new Error("No access token received");
                }

                localStorage.setItem("accesstoken", newToken);
                return newToken;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status !== 401 ||
            originalRequest._retry ||
            originalRequest.url.includes("/auth/login") ||
            originalRequest.url.includes("/auth/register") ||
            originalRequest.url.includes("/auth/refresh")
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const newToken = await refreshAccessToken();
            console.log("OLD TOKEN:", getToken());
            console.log("NEW TOKEN:", newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            unauthorized();
            return Promise.reject(refreshError);
        }
    }
);

const unauthorized = () => {
    localStorage.removeItem('accesstoken')
    window.location.href = '/login'
}

const getHeader = (auth) => {
    const headers = {}
    if (auth) {
        headers.Authorization = `Bearer ${getToken()}`
    }
    return headers;

}

const handleError = (error) => {


    // No response = network/server unavailable
    if (!error.response) {
        throw new ApiError(
            "Unable to connect to server. Please try again."
        );
    }

    const { status, data } = error.response;
    // Backend validation errors
    if (data.errors?.length) {
        throw new ApiError(
            data.message || "Validation error",
            data.errors,
            status
        );
    }

    // Normal API error
    throw new ApiError(
        data.message || "Something went wrong",
        [],
        status
    );
};

export const post = async (url, data = {}, auth = false) => {
    try {
        const headers = getHeader(auth);

        if (data instanceof FormData) {
            headers['Content-Type'] = undefined;
        }

        const res = await api.post(url, data, {
            headers
        })
        return res.data;
    } catch (error) {
        handleError(error)
    }
}

export const patch = async (url, data = {}, auth = false) => {
    try {
        const res = await api.patch(url, data, {
            headers: getHeader(auth)
        });

        return res.data;
    } catch (error) {
        handleError(error);
    }
};

export const get = async (url, auth = false, params = {}) => {
    try {
        const res = await api.get(url, {
            params,
            headers: getHeader(auth)
        })
        return res.data;
    } catch (error) {
        handleError(error)
    }
}

export const del = async (url, auth = false) => {
    try {
        const res = await api.delete(url, {
            headers: getHeader(auth)
        })
        return res.data;
    } catch (error) {
        handleError(error)
    }
}

const Register = (data) => {
    return post(endPoints.REGISTER.url, data, endPoints.REGISTER.auth)
}

const Login = (data) => {
    return post(endPoints.LOGIN.url, data, endPoints.LOGIN.auth)
}
const Logout = () => {
    return post(endPoints.LOGOUT.url, {}, endPoints.LOGOUT.auth)
}
const Dashboard = (data) => {
    return get(endPoints.Dashboard.url, endPoints.Dashboard.auth)
}
const Board = (data) => {
    return get(endPoints.Board.url, endPoints.Board.auth)
}
const CreateWorkspace = (data) => {
    return post(endPoints.CreateWorkspace.url, data, endPoints.CreateWorkspace.auth)
}
const CreateBoard = (workspaceId, data) => {
    const url = endPoints.CreateBoard.url.replace(':workspaceId', workspaceId)
    return post(url, data, endPoints.CreateBoard.auth)
}
const CreateTask = (boardId, data) => {
    const url = endPoints.CreateTask.url.replace(':boardId', boardId)
    return post(url, data, endPoints.CreateTask.auth)
}
const GetTasks = (boardId) => {
    const url = endPoints.GetTasks.url.replace(':boardId', boardId)
    return get(url, endPoints.GetTasks.auth)
}
const GetWorkspaceUsers = () => {
    return get(endPoints.GetWorkspaceUsers.url, endPoints.GetWorkspaceUsers.auth)
}
const AddBoardMember = (boardId, data) => {
    const url = endPoints.AddBoardMember.url.replace(':boardId', boardId)
    return post(url, data, endPoints.AddBoardMember.auth)
}
const CreateInvite = () => {
    return post(endPoints.CreateInvite.url, {}, endPoints.CreateInvite.auth)
}
const AcceptInvite = (token) => {
    const url = endPoints.AcceptInvite.url.replace(':token', token)
    return post(url, {}, endPoints.AcceptInvite.auth)
}
const MoveTask = (taskId, data) => {
    const url = endPoints.MoveTask.url.replace(':taskId', taskId);

    return patch(
        url,
        data,
        endPoints.MoveTask.auth
    );
};

export default {
    Login,
    Register,
    Logout,
    CreateWorkspace,
    CreateBoard,
    CreateTask,
    GetTasks,
    GetWorkspaceUsers,
    AddBoardMember,
    CreateInvite,
    AcceptInvite,
    Dashboard,
    Board,
    MoveTask,
}
