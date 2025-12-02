import axios from "axios";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchProducts = async (page_number, page_size) => {
    try {
        const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");

      const res = await axios.get(`${backendUrl}/vendor/get-products`, {
        params: {page_number, page_size},
        headers:{
            Authorization: `Bearer ${token}`
        }
      })
     return  res.data;
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


export const getVendorProducts = async (id) => {
    try {
      const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.get(`${backendUrl}/product/vendor-products/${id}`, {
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


export const getVendorProductDetails = async (id, product_id) => {
    try {
      const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.get(`${backendUrl}/product/vendor/${id}`, {
      params:{
         "product_id": product_id
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

    // fallback message
    return {
      success: false,
      message: error.message || "Something went wrong",
    } 
    }
}


export const approveProduct = async (vendor_id, product_id) => {
    try {
        const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
      const res = await axios.post(`${backendUrl}/product/approve-product`, {vendor_id, product_id}, {
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



export const rejectProduct = async (vendor_id, product_id, reason) => {
    try {
        const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
      const res = await axios.post(`${backendUrl}/product/reject-product`, {vendor_id, product_id, reason}, {
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

export const requestCorrection = async (vendor_id, product_id , review) => {
   try {
      const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");

    const res = await axios.post(`${backendUrl}/product/request-review`, {vendor_id, product_id, review}, {
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