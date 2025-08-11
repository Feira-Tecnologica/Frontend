// ---------------- CARROSSEL ----------------

const carousels = document.querySelectorAll('.galeria-item');

carousels.forEach(item => {
  const images = item.querySelectorAll('.carousel-img');
  const dots = item.querySelectorAll('.dot');
  const slideCount = item.querySelector('.slide-count');
  const prevBtn = item.querySelector('.arrow.prev');
  const nextBtn = item.querySelector('.arrow.next');
  const likeBtn = item.querySelector('.like-btn');

  let current = 0;
  let liked = false;
  let likeCount = 0;

  const showSlide = index => {
    images.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    slideCount.textContent = `${index + 1} / ${images.length}`;
  };

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      current = idx;
      showSlide(current);
    });
  });

  prevBtn.addEventListener('click', () => {
    current = (current - 1 + images.length) % images.length;
    showSlide(current);
  });

  nextBtn.addEventListener('click', () => {
    current = (current + 1) % images.length;
    showSlide(current);
  });

  likeBtn.addEventListener('click', () => {
    liked = !liked;
    likeCount += liked ? 1 : -1;
    likeBtn.innerHTML = liked
      ? `❤️ <span class="like-count">${likeCount}</span>`
      : `♡ <span class="like-count">${likeCount}</span>`;
  });

  showSlide(current);
});


// ---------------- INTRO VÍDEO + BACKGROUND ----------------

document.addEventListener("DOMContentLoaded", function () {
  const introContainer = document.getElementById("intro-video-container");
  const introVideo = document.getElementById("intro-video");
  const introSource = introVideo.querySelector("source");
  const banner = document.querySelector(".banner");
  const bannerText = document.querySelector(".banner-text");

  let isMobile = window.innerWidth <= 768;

  // Define vídeo com base no dispositivo
  introSource.setAttribute("src", isMobile ? "../video/intropkt.mp4" : "../video/intro.mp4");
  introVideo.load();

  // Define imagem de fundo e alinha o texto do banner conforme o dispositivo
  function atualizarBannerBackground() {
    isMobile = window.innerWidth <= 768;

    if (isMobile) {
      banner.style.backgroundImage = "url('../img/backgroundpkt.png')";

      // Centralização estilo mobile
      bannerText.style.textAlign = "center";
      bannerText.style.margin = "0 auto";
      bannerText.style.alignItems = "center";
      bannerText.style.justifyContent = "center";
      bannerText.style.display = "flex";
      bannerText.style.flexDirection = "column";
      bannerText.style.height = "100%";
      bannerText.style.marginTop = "250px"; // ajuste fino se necessário
    } else {
      banner.style.backgroundImage = "url('img/backgroundbnr.png')";

      // Alinhamento à esquerda estilo PC
      bannerText.style.textAlign = "left";
      bannerText.style.margin = "0";
      bannerText.style.alignItems = "flex-start";
      bannerText.style.justifyContent = "flex-start";
      bannerText.style.display = "flex";
      bannerText.style.flexDirection = "column";
      bannerText.style.marginTop = "40px";
    }
  }

  atualizarBannerBackground();

  window.addEventListener('resize', atualizarBannerBackground);

  // Bloqueia scroll enquanto o vídeo está visível
  document.body.classList.add("block-scroll");

  // Remove vídeo com fade-out
  const removeIntro = () => {
    introContainer.classList.add("fade-out");
    setTimeout(() => {
      introContainer.remove();
      document.body.classList.remove("block-scroll");
    }, 1000); // tempo do fade-out
  };

  introVideo.addEventListener("ended", removeIntro);
  setTimeout(removeIntro, 7000); // fallback se o vídeo não disparar 'ended'
});


// ---------------- FADE-IN PARA GALERIA ----------------

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el = entry.target;
    if (entry.isIntersecting) {
      el.classList.add('visible');
      el.classList.remove('hidden');
    } else {
      el.classList.remove('visible');
      el.classList.add('hidden');
    }
  });
}, {
  threshold: 0.2
});

document.querySelectorAll('.galeria-item').forEach(item => {
  observer.observe(item);
});


// ---------------- RELOAD AO MUDAR ENTRE CELULAR E PC ----------------

let isMobile = window.innerWidth <= 768;

window.addEventListener('resize', () => {
  const currentlyMobile = window.innerWidth <= 768;

  if (currentlyMobile !== isMobile) {
    location.reload(); // Recarrega se mudou entre celular e PC
  }

  isMobile = currentlyMobile;
});


document.addEventListener("DOMContentLoaded", function () {
  const backToTopBtn = document.querySelector(".bck");
  const bannerSection = document.querySelector(".banner");

  function checkScroll() {
    const bannerBottom = bannerSection.offsetTop + bannerSection.offsetHeight;
    if (window.scrollY > bannerBottom) {
      backToTopBtn.style.display = "block";
    } else {
      backToTopBtn.style.display = "none";
    }
  }

  window.addEventListener("scroll", checkScroll);

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});

// Video intro functionality
document.addEventListener("DOMContentLoaded", () => {
  const videoContainer = document.getElementById("intro-video-container")
  const video = document.getElementById("intro-video")

  if (video && videoContainer) {
    // Block scrolling during video
    document.body.classList.add("block-scroll")

    // Hide video after it ends or after 3 seconds
    const hideVideo = () => {
      videoContainer.classList.add("fade-out")
      document.body.classList.remove("block-scroll")

      setTimeout(() => {
        videoContainer.style.display = "none"
      }, 2500)
    }

    video.addEventListener("ended", hideVideo)

    // Fallback: hide after 3 seconds regardless
    setTimeout(hideVideo, 3000)

    // Allow skip on click
    videoContainer.addEventListener("click", hideVideo)
  }
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Add loading states to buttons
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", function () {
    if (!this.classList.contains("loading")) {
      this.classList.add("loading")
      setTimeout(() => {
        this.classList.remove("loading")
      }, 1000)
    }
  })
})

// Simple notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === "error" ? "#e74c3c" : type === "success" ? "#27ae60" : "#3498db"};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// Add CSS for notification animation
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .loading {
        opacity: 0.7;
        pointer-events: none;
    }
`
document.head.appendChild(style)

