const STUN_SERVER = "stun:bellachao.zapto.org:3478";
const API_URL = "https://bellachao.zapto.org";
const MEDIA_CONFIG = {
	VIDEO: {
		width: { ideal: 1280 },
		height: { ideal: 720 },
		frameRate: { ideal: 30, max: 60 },
	},
	AUDIO: {
		echoCancellation: true, // Mejorar la calidad del audio
		noiseSuppression: true,
		autoGainControl: true,
	},
};

const SOCKET_CONFIG = {
	reconnection: true, // Permite reconexión automática
	reconnectionAttempts: Infinity, // Número de intentos de reconexión (por defecto 0 es infinito)
	reconnectionDelay: 1000, // Tiempo de espera entre reconexiones (en milisegundos)
	reconnectionDelayMax: 5000, // Máximo tiempo de espera entre reconexiones
	timeout: 20000, // Tiempo de espera para reconexión
};

export { STUN_SERVER, API_URL, MEDIA_CONFIG, SOCKET_CONFIG };

