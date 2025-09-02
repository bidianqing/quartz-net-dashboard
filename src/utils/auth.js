export function setToken(token) {
  return sessionStorage.setItem('token', token);
}

export function getToken(token) {
  return sessionStorage.getItem('token');
}

export function removeToken(token) {
  return sessionStorage.removeItem('token');
}