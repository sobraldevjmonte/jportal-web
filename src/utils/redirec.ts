export const getBaseUrl = () => {
    const { host } = window.location;
    console.log("hostname >>>>>>>>>>> " + host);
    if (host === "179.51.199.78:10991") {
      // Ambiente externo
      return process.env.REACT_APP_EXTERNAL_BASE_URL;
    } else if (host === "10.5.59.107:3021") {
      // Ambiente interno
      return process.env.REACT_APP_LOCAL_BASE_URL;
    } else {
      // Ambiente desconhecido ou desenvolvimento
      return process.env.REACT_APP_DEV_BASE_URL;
    }
  };
  
