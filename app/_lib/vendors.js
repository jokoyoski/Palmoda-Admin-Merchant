import axios from "axios"
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL


export const getVendors = async (pageNumber = 1) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");

    const res = await axios.get(
      `${backendUrl}/vendor/vendor-list?page_number=${pageNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
};


export const filterVendors = async (pageNumber = 1, filters = {}) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");

    // Map frontend filter values to backend conditions
    const params = {
      page_number: pageNumber,
    };

    // Add search if provided
    if (filters.search && filters.search.trim()) {
      params.search = filters.search;
    }

    // Map KYC filter to backend conditions
    if (filters.kyc && filters.kyc !== "Any") {
      switch (filters.kyc) {
        case "Verified":
          params.is_verified = true;
          params.is_business_verified = true;
          params.is_identity_verified = true;
          params.is_bank_information_verified = true;
          break;
        case "Unverified":
          params.is_verified = false;
          break;
        case "Pending":
          // At least one verification is incomplete
          params.verification_incomplete = true;
          break;
        case "Suspended":
          params.is_suspended = true;
          break;
        case "Deleted":
          params.is_deleted = true;
          break;
      }
    }

    const res = await axios.get(
      `${backendUrl}/vendor/vendor-list`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
};

export const getVendorDetails = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.get(`${backendUrl}/vendor/vendor-details/${id}`, {
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

