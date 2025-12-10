const validatePassword = (password) => {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasLength = password.length >= 6;
  return { valid: hasUpper && hasLower && hasLength, errors: [] };
  // Add error messages to array if !valid
};
module.exports = { validatePassword };
