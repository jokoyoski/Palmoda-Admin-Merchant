import axios from "axios";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllSubscriptions = async (token) => {
  try {
    if (!token) {
      throw new Error("No token found");
    }

    const res = await axios.get(`${backendUrl}/subscription/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    throw new Error(msg);
  }
};
