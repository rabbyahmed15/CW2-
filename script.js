//  anim sections
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');

  const revealSection = () => {
    const triggerBottom = window.innerHeight / 5 * 4;

    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;

      if(sectionTop < triggerBottom) {
        section.classList.add('fade-in');
      }
    });
  };

  window.addEventListener('scroll', revealSection);
  revealSection(); // Initial check
});