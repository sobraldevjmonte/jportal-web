export const getBaseUrl = () => {
  const { host, hostname } = window.location;
  console.log("Acesso detectado no Host: " + host);
  
  // Se o host contiver o IP externo (independente de barra ou espaços)
  if (host === "179.51.199.78:10991" || hostname === "179.51.199.78") {
    // Ambiente externo
    return process.env.REACT_APP_EXTERNAL_BASE_URL?.trim();
  } else if (host === "10.5.59.107:3021" || hostname === "10.5.59.107") {
    // Ambiente interno
    return process.env.REACT_APP_LOCAL_BASE_URL?.trim();
  } else {
    // Ambiente desconhecido ou desenvolvimento local (localhost)
    return process.env.REACT_APP_DEV_BASE_URL?.trim();
  }
};

// export const getBaseUrl = () => {
//   const { host } = window.location;
//   console.log("hostname >>>>>>>>>>> " + host);
//   if (host === "179.51.199.78:10991") {
//     // Ambiente externo
//     return process.env.REACT_APP_EXTERNAL_BASE_URL;
//   } else if (host === "10.5.59.107:3021") {
//     // Ambiente interno
//     return process.env.REACT_APP_LOCAL_BASE_URL;
//   } else {
//     // Ambiente desconhecido ou desenvolvimento
//     return process.env.REACT_APP_DEV_BASE_URL;
//   }
// };
