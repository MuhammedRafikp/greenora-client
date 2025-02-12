export interface IAddressFormErrors {
  name: string;
  mobile: string;
  districtId: string;
  serviceAreaId: string;
  pinCode: string;
  locality: string;
  addressLine: string;
}

export interface IAddressFormData {
  name: string;
  mobile: string;
  districtId: string;
  serviceAreaId: string;
  pinCode: string;
  locality: string;
  addressLine: string;
}

export const validateAddressForm = (formData: IAddressFormData): { isValid: boolean; errors: IAddressFormErrors } => {
  let isValid = true;
  const errors: IAddressFormErrors = {
    name: '',
    mobile: '',
    districtId: '',
    serviceAreaId: '',
    pinCode: '',
    locality: '',
    addressLine: ''
  };

  // Name validation
  if (!formData.name.trim()) {
    errors.name = 'Please enter name';
    isValid = false;
  }

  // Mobile validation
  if (!formData.mobile) {
    errors.mobile = 'Please enter mobile number';
    isValid = false;
  } else if (!/^\d{10}$/.test(formData.mobile)) {
    errors.mobile = 'Mobile number must be 10 digits';
    isValid = false;
  }

  // District validation
  if (!formData.districtId) {
    errors.districtId = 'Please select a district';
    isValid = false;
  }

  // Service Area validation
  if (!formData.serviceAreaId) {
    errors.serviceAreaId = 'Please select a service area';
    isValid = false;
  }

  // Pin Code validation
  if (!formData.pinCode) {
    errors.pinCode = 'Please enter pin code';
    isValid = false;
  } else if (!/^\d{6}$/.test(formData.pinCode)) {
    errors.pinCode = 'Pin code must be 6 digits';
    isValid = false;
  }

  // Place validation
  if (!formData.locality.trim()) {
    errors.locality = 'Please enter locality';
    isValid = false;
  }

  // Address Line validation
  if (!formData.addressLine.trim()) {
    errors.addressLine = 'Please enter address line';
    isValid = false;
  }

  return { isValid, errors };
};

// Utility function to validate pin code input
export const validatePinCodeInput = (pinCode: string): boolean => {
  return /^\d{0,6}$/.test(pinCode);
};

// Add mobile number validation utility
export const validateMobileInput = (mobile: string): boolean => {
  return /^\d{0,10}$/.test(mobile);
}; 