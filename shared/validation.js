export const limits = { name: 100, email: 254, phone: 30, address: 1000, message: 4000, password: 128 };
const text = value => typeof value === 'string' ? value.trim() : '';
export const cleanText = text;

export function validateForm(kind, input = {}) {
  const data = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
  const errors = {};
  const required = (key, label, min = 1) => {
    const value = text(data[key]);
    if (value.length < min) errors[key] = `${label} must contain at least ${min} ${min === 1 ? 'character' : 'characters'}.`;
    else if (value.length > limits[key]) errors[key] = `${label} must be ${limits[key]} characters or fewer.`;
  };
  required('email', 'Email');
  if (!errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(data.email))) errors.email = 'Enter a valid email address.';
  if (kind === 'adoption' || kind === 'contact') required('name', 'Name', 2);
  if (kind === 'adoption') {
    if (data.dogId !== undefined && data.dogId !== null && (typeof data.dogId !== 'string' || data.dogId.length > 100)) errors.dogId = 'Choose a valid dog.';
  }
  if (kind === 'contact') required('message', 'Message', 5);
  if (kind === 'signup' || kind === 'login') {
    const password = typeof data.password === 'string' ? data.password : '';
    const min = kind === 'signup' ? 8 : 1;
    if (password.length < min || password.length > limits.password || !password.trim()) errors.password = kind === 'signup' ? 'Use a password between 8 and 128 characters.' : 'Enter your password.';
  }
  return errors;
}
