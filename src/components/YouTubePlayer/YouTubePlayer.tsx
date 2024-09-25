import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const YouTubePlayer = () => {
  const playerRef = useRef(null); // Referencia al iframe del reproductor
  const youtubeId = useSelector((state: RootState) => state.app.youtubeId);

  useEffect(() => {
    // Cargar la API del iframe de YouTube cuando el componente se monte
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

    // Función global que YouTube requiere
    const w = window as any;
    w.onYouTubeIframeAPIReady = () => {
      // Crear el reproductor cuando la API esté lista
      w.player = new w.YT.Player(playerRef.current, {
        videoId: youtubeId, // Reemplaza con el ID de tu video de YouTube
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
        playerVars: {
          controls: 1, // Mostrar controles del reproductor
          autoplay: 0, // No reproducir automáticamente
        },
      });
    };

    // Cleanup: eliminar el script si el componente se desmonta
    return () => {
      w.player && w.player.destroy();
    };
  }, []);

  const onPlayerStateChange = (event: any) => {
    const w = window as any;
    if (event.data === w.YT.PlayerState.PLAYING) {
      // Comienza a monitorear el tiempo de reproducción cuando el video está reproduciéndose
      //const currentTime = w.player.getCurrentTime();
    }
  };
  const onPlayerReady = () => {
    console.log("El video está listo!");
  };

  // Funciones para controlar el video
  const playVideo = () => {
    const w = window as any;
    w.player.playVideo();
  };

  const pauseVideo = () => {
    const w = window as any;
    w.player.pauseVideo();
  };

  const stopVideo = () => {
    const w = window as any;
    w.player.stopVideo();
  };

  // const handleChangeTime = () => {
  //   const w = window as any;
  //   const seconds = parseFloat("10"); // Convertir el tiempo a número
  //   if (!isNaN(seconds)) {
  //     w.player.seekTo(seconds, true); // Cambiar el tiempo del video
  //   }
  // };

  return (
    <div>
      <div id="player" ref={playerRef}></div>

      {/* Botones para controlar el video */}
      <button onClick={playVideo}>Reproducir</button>
      <button onClick={pauseVideo}>Pausar</button>
      <button onClick={stopVideo}>Detener</button>
    </div>
  );
};

export default YouTubePlayer;
