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


export const verifyBusiness = async (id) => {
    try {
       const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.put(`${backendUrl}/vendor/verify-business-registation/${id}`, {}, {
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

    // fallback message
    return {
      success: false,
      message: error.message || "Something went wrong",
    } 
    }
}


export const verifyVendorIdentity = async (id) => {
    try {
       const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.put(`${backendUrl}/vendor/verify-vendor-identity/${id}`, {}, {
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

    // fallback message
    return {
      success: false,
      message: error.message || "Something went wrong",
    } 
    }
}

export const verifyBankDetails = async (id) => {
    try {
       const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.put(`${backendUrl}/vendor/verify-bank-details/${id}`, {}, {
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

    // fallback message
    return {
      success: false,
      message: error.message || "Something went wrong",
    } 
    }
}


export const suspendVendor = async (vendor_id) => {
   try {
       const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.put(`${backendUrl}/vendor/suspend/${vendor_id}`, {}, {
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

    // fallback message
    return {
      success: false,
      message: error.message || "Something went wrong",
    } 
   } 
}

export const revokeSuspension = async (vendor_id) => {
  try {
       const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.put(`${backendUrl}/vendor/revoke-suspension/${vendor_id}`, {}, {
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

    // fallback message
    return {
      success: false,
      message: error.message || "Something went wrong",
    } 
  }
}








