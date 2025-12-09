import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Category {
  _id: string;
  name: string;
  description: string;
  countries: string[];
  hidden: string;
  genders: string[];
  image_url: string;
  subcategories: {
    _id: string;
    name: string;
    description: string;
    is_active: boolean;
    image_url: string;
  }[];
  is_active: boolean;
}

// 2. The full API response structure based on your sample
export interface CategoriesResponse {
  success: boolean;
  data: {
    data: Category[]; // This is the array we want
    total_items: number;
    page_number: number;
    page_size: number;
  };
  message: string;
}
// Categories Info

interface SubCategory {
  _id: string;
  name: string;
  description: string;
  is_active: boolean;
  image_url: string;
}

interface Gender {
  _id: string;
  name: string;
  is_active: boolean;
}

interface Color {
  _id: string;
  name: string;
  code: string;
  is_active: boolean;
}

export interface ColorResponse {
  success: boolean;
  data: Color[];
  message: string;
}

export interface SubCategoryResponse {
  success: boolean;
  data: SubCategory[];
  message: string;
}

interface Size {
  _id: string;
  name: string;
  is_active: boolean;
  code: string;
}

export interface SizeResponse {
  success: boolean;
  data: Size[];
  message: string;
}

export interface GenderResponse {
  success: boolean;
  data: Gender[];
  message: string;
}

export interface CategoryQueryParams {
  page_number: number;
  page_size: number;
  filter: {
    search_term: string | null;
    countries: {
      $in: string[];
    };
  };
  sort_field: string;
  sort_direction: number;
}

export interface Vendor {
  _id: string;
  business_name: string;
  contact_person_name: string;
  email: string;
  phone_number: string;
  code: string;
  code_expiry: {
    $date: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
  is_business_verified: boolean;
  is_identity_verified: boolean;
  is_bank_information_verified: boolean;
  is_wallet_activated: boolean;
  is_deleted: boolean;
}

export type PayoutTransaction = {
  _id: string;
  vendor_id: string;
  amount: number;
  transaction_reference: string;
  status: string;
  narration: string;
  transaction_type: string;
  created_at: string;
  updated_at: string;
  // vendor: Vendor;
};

export interface PayoutsResponse {
  success: boolean;
  data: {
    transactions: PayoutTransaction[];
    total_items: number;
    page_number: number;
    page_size: number;
  };
  message: string;
}
