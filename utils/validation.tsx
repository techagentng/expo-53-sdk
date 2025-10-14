/**
 * Validates an email address
 * @param email - The email to validate
 * @param setError - Function to set error message
 * @returns boolean - True if email is valid, false otherwise
 */
export const validateEmail = (email: string, setError: (error: string) => void): boolean => {
  // Simple email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    setError('Email is required');
    return false;
  }
  
  if (!emailRegex.test(email)) {
    setError('Please enter a valid email address');
    return false;
  }
  
  setError('');
  return true;
};

/**
 * Validates a password
 * @param password - The password to validate
 * @param setError - Function to set error message
 * @returns boolean - True if password is valid, false otherwise
 */
export const validatePassword = (password: string, setError: (error: string) => void): boolean => {
  if (!password) {
    setError('Password is required');
    return false;
  }
  
  if (password.length < 6) {
    setError('Password must be at least 6 characters long');
    return false;
  }
  
  setError('');
  return true;
};

/**
 * Validates if two passwords match
 * @param password - The first password
 * @param confirmPassword - The second password to compare
 * @param setError - Function to set error message
 * @returns boolean - True if passwords match, false otherwise
 */
export const validatePasswordMatch = (
  password: string, 
  confirmPassword: string, 
  setError: (error: string) => void
): boolean => {
  if (password !== confirmPassword) {
    setError('Passwords do not match');
    return false;
  }
  
  setError('');
  return true;
};
