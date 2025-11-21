export interface Vendor {
  _id: string;
  business_name: string;
  contact_person_name: string;
  email: string;

  // verification fields
  is_business_verified: boolean;
  is_identity_verified: boolean;
  is_bank_information_verified: boolean;

  // business fields
  businessType?: string;

  updated_at: string;
  is_active: boolean;
}
