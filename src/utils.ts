// algunas utilidades prueba

export const formatMessage = (msg: string) => {
  return msg.trim();
};

export const isValidToken = (token: string) => {
  return token && token.length > 10;
};

export const getTimestamp = () => {
  return new Date().toISOString();
}; 