const parseJwt = (token: string | null) => {
  const base64Url = token?.split('.')[1];
  const base64 = base64Url?.replace(/-/g, '+').replace(/_/g, '/');
  if (!base64) return null;
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );

  try {
    console.log(JSON.parse(jsonPayload));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT payload:', (error as Error).message);
    return null;
  }
};

export default parseJwt;
