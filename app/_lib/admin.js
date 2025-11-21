import axios from "axios"
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export const adminLogin = async (email, password) => {
    try {
        const res = await axios.post(`${backendUrl}/user/login`, {email, password});
        return res.data;
    } catch (error) {
        const msg =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    throw new Error(msg);
    }
}

