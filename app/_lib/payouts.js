import axios from "axios";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


export const getAllTransactions = async () => {
    try {
        const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.get(`${backendUrl}/transaction/all`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
    } catch (error) {
         if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }

    return {
      success: false,
      message: error.message || "Something went wrong",
    };
    }
}

export const approvePayout = async (id) => {
    try {
        const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.post(`${backendUrl}/transaction/approve-payout/${id}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
    } catch (error) {
         if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }

    return {
      success: false,
      message: error.message || "Something went wrong",
    };
    }
}

export const rejectPayout = async (id, reason) => {
    try {
        const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.post(`${backendUrl}/transaction/reject-payout/${id}`, {reason}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
    } catch (error) {
        if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }

    return {
      success: false,
      message: error.message || "Something went wrong",
    };
    }
}

export const fetchTransactionById = async (id) => {
    try {
        const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");

    const res = await axios.get(`${backendUrl}/transaction/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
    } catch (error) {
        if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }

    return {
      success: false,
      message: error.message || "Something went wrong",
    };
    }
}