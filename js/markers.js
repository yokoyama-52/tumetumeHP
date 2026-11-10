if ('IntersectionObserver' in window &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('marker-drawn');
      entry.target.classList.remove('marker-pending');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.2 });

  for (const card of document.querySelectorAll('.marker')) {
    card.classList.add('marker-pending');
    observer.observe(card);
  }
}

const leaderPhoto = document.querySelector('.leader-photo');

if (leaderPhoto && 'IntersectionObserver' in window) {
  const photoObserver = new IntersectionObserver(([entry]) => {
    if (entry.intersectionRatio < 0.25) return;
    leaderPhoto.classList.add('is-visible');
    photoObserver.disconnect();
  }, { threshold: 0.25 });

  photoObserver.observe(leaderPhoto);
}

const penguinFrames = document.querySelector('.penguin-frames');

if (penguinFrames && 'IntersectionObserver' in window) {
  const stickerObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    penguinFrames.classList.add('is-playing');
    stickerObserver.disconnect();
  }, { threshold: 0.5 });

  stickerObserver.observe(penguinFrames);
}
