module.exports = {
    apps: [
      {
        name: "jmonte-frontend",
        script: "npm",
        args: "start",
        env: {
          NODE_ENV: "production",
          HTTPS: "true",
          SSL_CRT_FILE: "./localhost.pem",
          SSL_KEY_FILE: "./localhost-key.pem",
          PORT: 3021,
          // Garante que o rastro aponte para o IP correto do seu servidor Linux
          REACT_APP_API_URL: "https://10.5.59.107:3020/rt/v1"
        }
      }
    ]
  };