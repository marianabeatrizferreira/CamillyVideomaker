document.addEventListener("DOMContentLoaded", () => {
  const hasGSAP = typeof gsap !== "undefined";
  const hasScrollTrigger = typeof ScrollTrigger !== "undefined";

  if (hasGSAP && hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");

    if (hasGSAP && preloader) {
      gsap.to("#preloader", {
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        onComplete: () => {
          preloader.style.display = "none";
        }
      });
    } else if (preloader) {
      setTimeout(() => {
        preloader.style.display = "none";
      }, 900);
    }
  });

  const header = document.getElementById("header");

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  };

  window.addEventListener("scroll", updateHeader);
  updateHeader();

  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isActive = nav.classList.toggle("active");
      document.body.classList.toggle("menu-open", isActive);
      menuToggle.setAttribute("aria-expanded", String(isActive));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        document.body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (hasGSAP) {
    gsap.from(".hero-content > *", {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out"
    });

    gsap.utils.toArray(".reveal-section, .reveal-card").forEach((el) => {
      gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%"
          }
        }
      );
    });

    gsap.utils.toArray(".reveal-left").forEach((el) => {
      gsap.fromTo(
        el,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 82%"
          }
        }
      );
    });

    gsap.utils.toArray(".reveal-right").forEach((el) => {
      gsap.fromTo(
        el,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 82%"
          }
        }
      );
    });
  }

  const heroCanvas = document.getElementById("heroParticles");

  if (heroCanvas) {
    const ctx = heroCanvas.getContext("2d");
    const heroSection = heroCanvas.closest(".hero");

    let particles = [];
    let mouse = {
      x: null,
      y: null,
      radius: 130
    };

    function resizeHeroCanvas() {
      heroCanvas.width = heroSection.offsetWidth;
      heroCanvas.height = heroSection.offsetHeight;
    }

    function createHeroParticles() {
      particles = [];
      const amount = window.innerWidth < 768 ? 55 : 90;

      for (let i = 0; i < amount; i++) {
        particles.push({
          x: Math.random() * heroCanvas.width,
          y: Math.random() * heroCanvas.height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          size: Math.random() * 2.8 + 1.2
        });
      }
    }

    function drawHeroParticle(particle) {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(70, 42, 28, 0.34)";
      ctx.fill();
    }

    function connectHeroParticles() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(85, 52, 35, ${Math.max(0, 0.16 - distance / 900)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateHeroParticles() {
      ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x <= 0 || particle.x >= heroCanvas.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= heroCanvas.height) particle.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            particle.x -= Math.cos(angle) * force * 1.8;
            particle.y -= Math.sin(angle) * force * 1.8;
          }
        }

        drawHeroParticle(particle);
      });

      connectHeroParticles();
      requestAnimationFrame(animateHeroParticles);
    }

    if (heroSection) {
      heroSection.addEventListener("mousemove", (event) => {
        const rect = heroCanvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
      });

      heroSection.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
      });

      window.addEventListener("resize", () => {
        resizeHeroCanvas();
        createHeroParticles();
      });

      resizeHeroCanvas();
      createHeroParticles();
      animateHeroParticles();
    }
  }

  const aboutCanvas = document.querySelector(".about-particles");

  if (aboutCanvas) {
    const ctx = aboutCanvas.getContext("2d");
    const artBox = aboutCanvas.parentElement;

    let particles = [];
    let mouse = {
      x: null,
      y: null,
      radius: 120
    };

    function resizeAboutCanvas() {
      aboutCanvas.width = artBox.offsetWidth;
      aboutCanvas.height = artBox.offsetHeight;
    }

    function createAboutParticles() {
      particles = [];
      const amount = window.innerWidth < 768 ? 28 : 50;

      for (let i = 0; i < amount; i++) {
        particles.push({
          x: Math.random() * aboutCanvas.width,
          y: Math.random() * aboutCanvas.height,
          size: Math.random() * 2.2 + 1,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28
        });
      }
    }

    function drawAboutParticle(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(110, 85, 71, 0.18)";
      ctx.fill();
    }

    function connectAboutParticles() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 85) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(110, 85, 71, ${Math.max(0, 0.08 - distance / 1400)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateAboutParticles() {
      ctx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > aboutCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > aboutCanvas.height) p.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            p.x -= Math.cos(angle) * force * 1.5;
            p.y -= Math.sin(angle) * force * 1.5;
          }
        }

        drawAboutParticle(p);
      });

      connectAboutParticles();
      requestAnimationFrame(animateAboutParticles);
    }

    if (artBox) {
      artBox.addEventListener("mousemove", (e) => {
        const rect = artBox.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });

      artBox.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
      });

      window.addEventListener("resize", () => {
        resizeAboutCanvas();
        createAboutParticles();
      });

      resizeAboutCanvas();
      createAboutParticles();
      animateAboutParticles();
    }
  }

  /* =========================
     PORTFÓLIO
  ========================= */

  const portfolioCards = document.querySelectorAll(".portfolio-card");
  const videoModal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");
  const closeVideoBtn = document.querySelector(".close-video");

  function openVideoModal(videoSrc) {
    if (!videoModal || !modalVideo || !videoSrc) return;

    modalVideo.src = videoSrc;
    modalVideo.load();

    videoModal.classList.add("active");
    videoModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    modalVideo.play().catch(() => {});
  }

  function closeVideoModal() {
    if (!videoModal || !modalVideo) return;

    videoModal.classList.remove("active");
    videoModal.setAttribute("aria-hidden", "true");

    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideo.load();

    document.body.style.overflow = "";
  }

  portfolioCards.forEach((card) => {
    const previewVideo = card.querySelector("video");

    if (previewVideo) {
      card.addEventListener("mouseenter", () => {
        previewVideo.play().catch(() => {});
      });

      card.addEventListener("mouseleave", () => {
        previewVideo.pause();
        previewVideo.currentTime = 0;
      });
    }

    card.addEventListener("click", () => {
      const videoSrc =
        card.dataset.video ||
        previewVideo?.querySelector("source")?.getAttribute("src") ||
        previewVideo?.getAttribute("src");

      if (previewVideo) {
        previewVideo.pause();
      }

      openVideoModal(videoSrc);
    });

    if (hasGSAP) {
      card.addEventListener("mousemove", (e) => {
        if (window.innerWidth <= 900) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY = (x / rect.width - 0.5) * 8;
        const rotateX = (y / rect.height - 0.5) * -8;

        gsap.to(card, {
          rotateX,
          rotateY,
          transformPerspective: 1000,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.45,
          ease: "power3.out"
        });
      });
    }
  });

  if (closeVideoBtn) {
    closeVideoBtn.addEventListener("click", closeVideoModal);
  }

  if (videoModal) {
    videoModal.addEventListener("click", (e) => {
      if (e.target === videoModal) {
        closeVideoModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeVideoModal();

      if (nav && nav.classList.contains("active")) {
        nav.classList.remove("active");
        document.body.classList.remove("menu-open");

        if (menuToggle) {
          menuToggle.setAttribute("aria-expanded", "false");
        }
      }
    }
  });

  /* =========================
     FORMULÁRIO WHATSAPP
  ========================= */

  const whatsappForm = document.getElementById("whatsappForm");

  const customSelect = document.getElementById("customSelectTipo");
  const tipoHidden = document.getElementById("tipo-hidden");
  const customSelectText = document.querySelector(".custom-select-text");
  const customOptions = document.querySelectorAll(".custom-option");

  const campoCasamento = document.getElementById("campo-casamento");
  const inputNoivos = document.getElementById("noivos");

  if (customSelect && tipoHidden && customSelectText && customOptions.length) {
    const trigger = customSelect.querySelector(".custom-select-trigger");

    trigger?.addEventListener("click", () => {
      customSelect.classList.toggle("active");
    });

    customOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const value = option.dataset.value || "";
        const text = option.textContent.trim();

        tipoHidden.value = value;
        customSelectText.textContent = text;

        customOptions.forEach((opt) => opt.classList.remove("selected"));
        option.classList.add("selected");

        customSelect.classList.remove("active");

        verificarCampoCasamento();
      });
    });

    document.addEventListener("click", (e) => {
      if (!customSelect.contains(e.target)) {
        customSelect.classList.remove("active");
      }
    });
  }

  function verificarCampoCasamento() {
    if (!campoCasamento || !inputNoivos || !tipoHidden) return;

    if (tipoHidden.value === "Casamento") {
      campoCasamento.classList.remove("hidden");
      inputNoivos.setAttribute("required", "true");
    } else {
      campoCasamento.classList.add("hidden");
      inputNoivos.removeAttribute("required");
      inputNoivos.value = "";
    }
  }

  verificarCampoCasamento();

  if (whatsappForm) {
    whatsappForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nome = document.getElementById("nome")?.value.trim() || "";
      const telefone = document.getElementById("telefone")?.value.trim() || "";
      const instagram = document.getElementById("instagram")?.value.trim() || "";
      const tipo = document.getElementById("tipo-hidden")?.value.trim() || "";
      const noivos = document.getElementById("noivos")?.value.trim() || "";
      const dataEvento = document.getElementById("dataEvento")?.value.trim() || "";
      const cidade = document.getElementById("cidade")?.value.trim() || "";
      const mensagem = document.getElementById("mensagem")?.value.trim() || "";

      if (!nome) {
        alert("Por favor, preencha seu nome.");
        document.getElementById("nome")?.focus();
        return;
      }

      if (!telefone) {
        alert("Por favor, preencha seu telefone.");
        document.getElementById("telefone")?.focus();
        return;
      }

      if (!tipo) {
        alert("Por favor, selecione o tipo de serviço.");
        customSelect?.classList.add("active");
        customSelect?.querySelector(".custom-select-trigger")?.focus();
        return;
      }

      if (tipo === "Casamento" && !noivos) {
        alert("Por favor, preencha o nome dos noivos.");
        inputNoivos?.focus();
        return;
      }

      const blocoNoivos =
        tipo === "Casamento" ? `*Nome dos noivos:* ${noivos}\n` : "";

      const texto =
        `Olá, Camilly! Vim pelo site e gostaria de solicitar um orçamento.\n\n` +
        `*Nome:* ${nome}\n` +
        `*Telefone:* ${telefone}\n` +
        `*Instagram:* ${instagram || "Não informado"}\n` +
        `*Tipo de serviço:* ${tipo}\n` +
        blocoNoivos +
        `*Data do evento/gravação:* ${dataEvento || "Não informado"}\n` +
        `*Cidade:* ${cidade || "Não informado"}\n` +
        `*Detalhes:* ${mensagem || "Não informado"}`;

      const numero = "5538998709503";
      const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

      window.open(url, "_blank");
    });
  }

  /* =========================
     FEEDBACK CAROUSEL
  ========================= */

  const feedbackTrack = document.getElementById("feedbackTrack");
  const feedbackPrev = document.getElementById("feedbackPrev");
  const feedbackNext = document.getElementById("feedbackNext");
  const feedbackDots = document.getElementById("feedbackDots");

  if (feedbackTrack && feedbackPrev && feedbackNext && feedbackDots) {
    const slides = Array.from(feedbackTrack.children);
    let currentIndex = 0;
    let slidesPerView = getSlidesPerView();

    function getSlidesPerView() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 1100) return 2;
      return 3;
    }

    function getGap() {
      const styles = window.getComputedStyle(feedbackTrack);
      return parseFloat(styles.gap || styles.columnGap || 0);
    }

    function getSlideWidth() {
      const slide = slides[0];
      return slide.offsetWidth + getGap();
    }

    function getMaxIndex() {
      return Math.max(0, slides.length - slidesPerView);
    }

    function createDots() {
      feedbackDots.innerHTML = "";
      const totalDots = getMaxIndex() + 1;

      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement("button");
        dot.type = "button";

        if (i === currentIndex) {
          dot.classList.add("active");
        }

        dot.addEventListener("click", () => {
          currentIndex = i;
          updateCarousel();
        });

        feedbackDots.appendChild(dot);
      }
    }

    function updateDots() {
      const dots = feedbackDots.querySelectorAll("button");

      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
      });
    }

    function updateCarousel() {
      feedbackTrack.style.transform = `translateX(-${currentIndex * getSlideWidth()}px)`;
      updateDots();
    }

    feedbackNext.addEventListener("click", () => {
      const maxIndex = getMaxIndex();
      currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
      updateCarousel();
    });

    feedbackPrev.addEventListener("click", () => {
      const maxIndex = getMaxIndex();
      currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
      updateCarousel();
    });

    window.addEventListener("resize", () => {
      slidesPerView = getSlidesPerView();
      currentIndex = Math.min(currentIndex, getMaxIndex());
      createDots();
      updateCarousel();
    });

    createDots();
    updateCarousel();
  }
});