const NUMVERIFY_API_KEY = process.env.NEXT_PUBLIC_NUMVERIFY_API_KEY;
const POSITIONSTACK_API_KEY = process.env.NEXT_PUBLIC_POSITIONSTACK_API_KEY;

export const validatePhoneNumber = async (phoneNumber: string): Promise<{ valid: boolean; message?: string }> => {
  try {
    // Basic client-side validation first
    if (!phoneNumber) return { valid: false, message: 'Phone number is required' };
    if (!/^\d+$/.test(phoneNumber)) return { valid: false, message: 'Phone number must contain only numbers' };

    // Skip API validation in development to save API calls
    if (process.env.NODE_ENV === 'development') {
      return { valid: true };
    }

    const response = await fetch(
      `http://apilayer.net/api/validate?access_key=${NUMVERIFY_API_KEY}&number=${phoneNumber}&country_code=&format=1`
    );
    const data = await response.json();

    if (!data.valid) {
      return { valid: false, message: 'Please enter a valid phone number' };
    }
    return { valid: true };
  } catch (error) {
    console.error('Phone validation error:', error);
    return { valid: true }; // Fallback to valid if API fails
  }
};

export const validateAddress = async (address: string): Promise<{ valid: boolean; message?: string }> => {
  try {
    // Basic client-side validation first
    if (!address) return { valid: false, message: 'Address is required' };
    if (address.length < 5) return { valid: false, message: 'Address is too short' };

    // Skip API validation in development to save API calls
    if (process.env.NODE_ENV === 'development') {
      return { valid: true };
    }

    const response = await fetch(
      `http://api.positionstack.com/v1/forward?access_key=${POSITIONSTACK_API_KEY}&query=${encodeURIComponent(address)}&limit=1`
    );
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return { valid: false, message: 'Please enter a valid address' };
    }
    return { valid: true };
  } catch (error) {
    console.error('Address validation error:', error);
    return { valid: true }; // Fallback to valid if API fails
  }
};