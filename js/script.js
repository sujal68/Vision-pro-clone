// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

class ScrollImageSequence {
  constructor(container, options = {}) {
    this.container = document.querySelector(container);
    if (!this.container) {
      console.error('ScrollImageSequence: Container not found');
      return;
    }

    this.canvas = this.container.querySelector('.sequence-canvas');
    if (!this.canvas) {
      console.error('ScrollImageSequence: Canvas not found');
      return;
    }

    this.options = {
      totalFrames: options.totalFrames || 92,
      imagePrefix: options.imagePrefix || '',
      imageExtension: options.imageExtension || '.jpg',
      imagePath: options.imagePath || './gif/',
      paddingZeros: options.paddingZeros || 3,
      ...options
    };

    this.currentFrame = 0;
    this.images = [];
    this.isLoaded = false;

    this.init();
  }

  async init() {
    try {
      await this.preloadImages();
      this.updateProgress();
    } catch (error) {
      console.error('ScrollImageSequence init error:', error);
    }
  }

  getImagePath(frameNumber) {
    const paddedNumber = (frameNumber + 1).toString().padStart(this.options.paddingZeros, '0');
    return `${this.options.imagePath}${this.options.imagePrefix}${paddedNumber}${this.options.imageExtension}`;
  }

  // Generate placeholder images if actual images don't exist
  generatePlaceholderImage(width, height, frameNumber) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Gradient background based on frame
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, `hsl(${frameNumber * 4}, 70%, 50%)`);
    gradient.addColorStop(1, `hsl(${frameNumber * 4 + 60}, 70%, 30%)`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Vision Pro device shape
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.roundRect(width * 0.2, height * 0.3, width * 0.6, height * 0.4, 20);
    ctx.fill();

    // Frame number text
    ctx.fillStyle = '#333';
    ctx.font = `${Math.floor(height / 15)}px -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`Frame ${frameNumber + 1}`, width / 2, height / 2);
    ctx.fillText('Vision Pro', width / 2, height / 2 + 30);

    return canvas.toDataURL();
  }

  async preloadImages() {
    const loadPromises = [];

    for (let i = 0; i < this.options.totalFrames; i++) {
      const img = document.createElement('img');
      img.className = 'sequence-image';
      img.style.opacity = i === 0 ? '1' : '0';
      img.loading = 'lazy';

      const actualImagePath = this.getImagePath(i);

      const loadPromise = new Promise((resolve) => {
        const actualImg = new Image();
        actualImg.onload = () => {
          img.src = actualImagePath;
          console.log(`Loaded actual: frame ${i + 1}`);
          resolve();
        };
        actualImg.onerror = () => {
          img.src = this.generatePlaceholderImage(800, 450, i);
          console.log(`Using placeholder: frame ${i + 1}`);
          resolve();
        };
        actualImg.src = actualImagePath;
      });

      this.canvas.appendChild(img);
      this.images.push(img);
      loadPromises.push(loadPromise);
    }

    await Promise.all(loadPromises);
    this.isLoaded = true;
    console.log(`ScrollImageSequence: ${this.options.totalFrames} frames loaded`);
  }

  updateFrame() {
    const containerTop = this.container.offsetTop;
    const containerHeight = this.container.offsetHeight;
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;

    const scrollStart = containerTop - windowHeight;
    const scrollEnd = containerTop + containerHeight - windowHeight;

    if (scrollTop >= scrollStart && scrollTop <= scrollEnd) {
      const progress = (scrollTop - scrollStart) / (scrollEnd - scrollStart);
      const clampedProgress = Math.max(0, Math.min(1, progress));
      const targetFrame = Math.floor(clampedProgress * (this.options.totalFrames - 1));

      if (targetFrame !== this.currentFrame && this.images[targetFrame]) {
        // Hide current frame
        if (this.images[this.currentFrame]) {
          this.images[this.currentFrame].style.opacity = '0';
        }
        // Show target frame
        this.images[targetFrame].style.opacity = '1';
        this.currentFrame = targetFrame;
      }
    }
  }

  updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const currentFrameSpan = document.getElementById('currentFrame');
    const totalFramesSpan = document.getElementById('totalFrames');

    const progress = (this.currentFrame / (this.options.totalFrames - 1)) * 100;

    if (progressFill) {
      progressFill.style.height = `${progress}%`;
    }

    if (currentFrameSpan) {
      currentFrameSpan.textContent = this.currentFrame + 1;
    }

    if (totalFramesSpan) {
      totalFramesSpan.textContent = this.options.totalFrames;
    }
  }
}
// Second Scroll Image Sequence
class ScrollImageSequence2 {
  constructor(container, options = {}) {
    this.container = document.querySelector(container);
    if (!this.container) {
      console.error('ScrollImageSequence2: Container not found');
      return;
    }

    this.canvas = this.container.querySelector('.sequence-canvas2');
    if (!this.canvas) {
      console.error('ScrollImageSequence2: Canvas not found');
      return;
    }

    this.options = {
      totalFrames: options.totalFrames || 200,
      imagePrefix: options.imagePrefix || '',
      imageExtension: options.imageExtension || '.JPG',
      imagePath: options.imagePath || './images/',
      paddingZeros: options.paddingZeros || 4,
      ...options
    };

    this.currentFrame = 0;
    this.images = [];
    this.isLoaded = false;

    this.init();
  }

  async init() {
    try {
      await this.preloadImages();
    } catch (error) {
      console.error('ScrollImageSequence2 init error:', error);
    }
  }

  getImagePath(frameNumber) {
    const paddedNumber = frameNumber.toString().padStart(this.options.paddingZeros, '0');
    return `${this.options.imagePath}${this.options.imagePrefix}${paddedNumber}${this.options.imageExtension}`;
  }

  generatePlaceholderImage(width, height, frameNumber) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, `hsl(${frameNumber * 2}, 70%, 50%)`);
    gradient.addColorStop(1, `hsl(${frameNumber * 2 + 60}, 70%, 30%)`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.roundRect(width * 0.2, height * 0.3, width * 0.6, height * 0.4, 20);
    ctx.fill();

    ctx.fillStyle = '#333';
    ctx.font = `${Math.floor(height / 15)}px -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`Frame ${frameNumber}`, width / 2, height / 2);

    return canvas.toDataURL();
  }

  async preloadImages() {
    const loadPromises = [];

    for (let i = 0; i < this.options.totalFrames; i++) {
      const img = document.createElement('img');
      img.style.opacity = i === 0 ? '1' : '0';
      img.loading = 'lazy';

      const actualImagePath = this.getImagePath(i);

      const loadPromise = new Promise((resolve) => {
        const actualImg = new Image();
        actualImg.onload = () => {
          img.src = actualImagePath;
          console.log(`Loaded frame ${i}`);
          resolve();
        };
        actualImg.onerror = () => {
          img.src = this.generatePlaceholderImage(800, 450, i);
          console.log(`Placeholder frame ${i}`);
          resolve();
        };
        actualImg.src = actualImagePath;
      });

      this.canvas.appendChild(img);
      this.images.push(img);
      loadPromises.push(loadPromise);
    }

    await Promise.all(loadPromises);
    this.isLoaded = true;
    console.log(`ScrollImageSequence2: ${this.options.totalFrames} frames loaded`);
  }
}

// Initialize second sequence
// Initialize second sequence
document.addEventListener('DOMContentLoaded', () => {
  const sequence2 = new ScrollImageSequence2('.scroll-sequence-container2', {
    totalFrames: 200,
    imagePath: './images/',
    imagePrefix: '',
    imageExtension: '.JPG',
    paddingZeros: 4
  });

  const checkLoaded2 = setInterval(() => {
    if (sequence2.isLoaded) {
      clearInterval(checkLoaded2);

      gsap.to({}, {
        scrollTrigger: {
          trigger: ".container-apple2",
          start: "top center",
          end: "bottom center",
          scrub: 0.5,  // Ye value kam kar di (pehle 1 thi)
          onUpdate: (self) => {
            const progress = self.progress;
            const targetFrame = Math.floor(progress * (sequence2.options.totalFrames - 1));

            if (targetFrame !== sequence2.currentFrame && sequence2.images[targetFrame]) {
              if (sequence2.images[sequence2.currentFrame]) {
                sequence2.images[sequence2.currentFrame].style.opacity = "0";
              }
              sequence2.images[targetFrame].style.opacity = "1";
              sequence2.currentFrame = targetFrame;
            }
          }
        }
      });
    }
  }, 100);
});


// =========================
// GSAP SCROLL ANIMATIONS
// =========================

// Video scroll pinning logic
gsap.to(".digital-text", {
  scrollTrigger: {
    trigger: ".digital-video-wrapper",
    start: "top top",
    end: "bottom top",
    scrub: true,
    pin: ".video-container",
    anticipatePin: 1,
  },
  opacity: 1,
  y: -100,
  ease: "none"
});
gsap.to(".digital-text2", {
  scrollTrigger: {
    trigger: ".digital-video-wrapper2",
    start: "top top",
    end: "bottom top",
    scrub: true,
    pin: ".video-container2",
    anticipatePin: 1,
  },
  opacity: 1,
  y: -100,
  ease: "none"
});

// =========================
// VIDEO CONTROLS
// =========================

// Hero video toggle
document.addEventListener('DOMContentLoaded', () => {
  const heroVideo = document.getElementById("hero-video");
  const heroToggleBtn = document.getElementById("videoToggleBtn");

  if (heroVideo && heroToggleBtn) {
    const heroIcon = heroToggleBtn.querySelector("i");

    heroToggleBtn.addEventListener("click", () => {
      if (heroVideo.paused) {
        heroVideo.play();
        if (heroIcon) {
          heroIcon.classList.remove("ri-play-circle-line");
          heroIcon.classList.add("ri-pause-circle-line");
        }
      } else {
        heroVideo.pause();
        if (heroIcon) {
          heroIcon.classList.remove("ri-pause-circle-line");
          heroIcon.classList.add("ri-play-circle-line");
        }
      }
    });
  }
});

// Digital video controls with progress ring
document.addEventListener('DOMContentLoaded', () => {
  const digitalVideo = document.getElementById("digitalVideo");
  const digitalToggleBtn = document.getElementById("digitalVideoToggleBtn");

  if (digitalVideo && digitalToggleBtn) {
    const digitalIcon = digitalToggleBtn.querySelector("i");
    const ring = digitalToggleBtn.querySelector(".progress-ring__circle");

    if (ring) {
      const radius = ring.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;

      ring.style.strokeDasharray = `${circumference}`;
      ring.style.strokeDashoffset = `${circumference}`;

      function setProgress(percent) {
        const offset = circumference - (percent / 100) * circumference;
        ring.style.strokeDashoffset = offset;
      }

      // Toggle video
      digitalToggleBtn.addEventListener("click", () => {
        if (digitalVideo.paused) {
          digitalVideo.play();
          if (digitalIcon) {
            digitalIcon.classList.remove("ri-play-fill");
            digitalIcon.classList.add("ri-pause-fill");
          }
        } else {
          digitalVideo.pause();
          if (digitalIcon) {
            digitalIcon.classList.remove("ri-pause-fill");
            digitalIcon.classList.add("ri-play-fill");
          }
        }
      });

      // Update progress ring
      digitalVideo.addEventListener("timeupdate", () => {
        const percent = (digitalVideo.currentTime / digitalVideo.duration) * 100;
        setProgress(percent);
      });
    }
  }
});

// =========================
// OVERLAY EFFECTS
// =========================

// Digital text overlay effect
window.addEventListener('scroll', () => {
  const digitalText = document.querySelector('.digital-text');
  const videoOverlay = document.querySelector('.video-overlay');

  if (digitalText && videoOverlay) {
    const rect = digitalText.getBoundingClientRect();

    if (rect.top < window.innerHeight && rect.bottom > 0) {
      videoOverlay.style.opacity = "0.5";
    } else {
      videoOverlay.style.opacity = "0";
    }
  }
});
window.addEventListener('scroll', () => {
  const digitalText2 = document.querySelector('.digital-text2');
  const videoOverlay2 = document.querySelector('.video-overlay2');

  if (digitalText2 && videoOverlay2) {
    const rect = digitalText2.getBoundingClientRect();

    if (rect.top < window.innerHeight && rect.bottom > 0) {
      videoOverlay2.style.opacity = "0.5";
    } else {
      videoOverlay2.style.opacity = "0";
    }
  }
});

// Hover blur effect on banner
document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.product-header ul li');
  const banner = document.querySelector('.banner-video');

  if (navItems.length && banner) {
    navItems.forEach(item => {
      item.addEventListener('mouseenter', () => banner.classList.add('blur'));
      item.addEventListener('mouseleave', () => banner.classList.remove('blur'));
    });
  }
});

// =========================
// LOCOMOTIVE SCROLL SETUP (Optional - only if you're using it)
// =========================

// Initialize Locomotive Scroll if element exists
document.addEventListener('DOMContentLoaded', () => {
  const smoothScrollEl = document.querySelector(".smooth-scroll");

  if (smoothScrollEl && typeof LocomotiveScroll !== 'undefined') {
    const locoScroll = new LocomotiveScroll({
      el: smoothScrollEl,
      smooth: true
    });

    // Sync with ScrollTrigger
    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(".smooth-scroll", {
      scrollTop(value) {
        return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      pinType: smoothScrollEl.style.transform ? "transform" : "fixed"
    });

    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();
  }
});

// =========================
// INITIALIZE SCROLL IMAGE SEQUENCE
// =========================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize scroll image sequence animation
  const sequence = new ScrollImageSequence('.scroll-sequence-container', {
    totalFrames: 92,
    imagePath: './gif/',
    imagePrefix: '',
    imageExtension: '.jpg',
    paddingZeros: 3
  });

  // Smooth scroll behavior
  document.documentElement.style.scrollBehavior = 'auto';
  // Wait until images are loaded
  const checkLoaded = setInterval(() => {
    if (sequence.isLoaded) {
      clearInterval(checkLoaded);

      // GSAP scroll-controlled sequence
      gsap.to({}, {
        scrollTrigger: {
          trigger: ".digital-content",   // yaha se start hoga
          start: "top center",           // jab digital-content ka top viewport ke center pe aayega
          endTrigger: ".scroll-sequence-container", // sequence ka end control karne ke liye
          end: "bottom center",          // jab scroll-sequence-container ka bottom center pe aayega
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const targetFrame = Math.floor(progress * (sequence.options.totalFrames - 1));

            if (targetFrame !== sequence.currentFrame) {
              sequence.images[sequence.currentFrame].style.opacity = "0";
              sequence.images[targetFrame].style.opacity = "1";
              sequence.currentFrame = targetFrame;
            }
          }
        }
      });
    }
  }, 100);

});

// =========================
// PERFORMANCE OPTIMIZATIONS
// =========================

// Throttle resize events
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});

// Page visibility optimization
document.addEventListener('visibilitychange', () => {
  const videos = document.querySelectorAll('video');

  if (document.hidden) {
    videos.forEach(video => {
      if (!video.paused) {
        video.pause();
        video.dataset.wasPlaying = 'true';
      }
    });
  } else {
    videos.forEach(video => {
      if (video.dataset.wasPlaying === 'true') {
        video.play();
        delete video.dataset.wasPlaying;
      }
    });
  }
});

console.log('Enhanced Apple Vision Pro script loaded successfully!');