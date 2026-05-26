import { message } from 'antd';

interface Coordenadas {
    lat: number | null;
    long: number | null;
}

/**
 * Captura a posição do usuário respeitando a flag obriga_gps
 * @param obrigaGps Valor vindo das configurações do banco
 */
export const obterLocalizacaoSistemica = (obrigaGps: boolean): Promise<Coordenadas> => {
    return new Promise((resolve, reject) => {
        
        // 1. Se a configuração estiver DESLIGADA, não pedimos GPS e retornamos nulo
        if (!obrigaGps) {
            console.log("GPS não obrigatório conforme configurações.");
            return resolve({ lat: null, long: null });
        }

        // 2. Verifica se o navegador suporta geolocalização
        if (!navigator.geolocation) {
            const msg = "Seu navegador não suporta geolocalização.";
            message.error(msg);
            return reject(msg);
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 7000, // 7 segundos para responder
            maximumAge: 0
        };

        // 3. Tenta capturar a posição real
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    long: position.coords.longitude
                });
            },
            (error) => {
                // Se der erro e for OBRIGATÓRIO, bloqueamos o usuário
                let erroMsg = "Erro desconhecido ao obter GPS.";
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        erroMsg = "Você precisa permitir o acesso ao GPS nas configurações do seu navegador para continuar.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        erroMsg = "Informações de localização indisponíveis no momento.";
                        break;
                    case error.TIMEOUT:
                        erroMsg = "Tempo esgotado ao tentar obter localização. Verifique seu sinal.";
                        break;
                }

                message.error(erroMsg);
                reject(erroMsg);
            },
            options
        );
    });
};