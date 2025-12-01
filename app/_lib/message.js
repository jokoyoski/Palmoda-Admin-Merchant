import axios from "axios";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


export const getAllVendorMessages = async (id) => {
   try {
       const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.get(`${backendUrl}/message/all`, {
        params: {
            vendor_id: id
        }, 
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


export const sendMessage = async (vendor_id, title, content, message_type) => {
    try {
        const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.post(`${backendUrl}/message`, {vendor_id, title, content, message_type}, {
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