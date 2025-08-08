window.addEventListener("load", () => {
  const video = document.getElementById('intro-video');
  const container = document.getElementById('intro-video-container');

  // Caso o vídeo falhe ou o autoplay seja bloqueado, remove após 5 segundos
  const fallbackTimeout = setTimeout(() => {
    esconderVideo();
  }, 5000);

  // Quando o vídeo termina, esconde
  video.addEventListener('ended', () => {
    clearTimeout(fallbackTimeout);
    esconderVideo();
  });

  function esconderVideo() {
    container.style.transition = 'opacity 1s ease';
    container.style.opacity = 0;

    // Espera o fade-out antes de esconder de vez
    setTimeout(() => {
      container.style.display = 'none';
    }, 1000);
  }
});
