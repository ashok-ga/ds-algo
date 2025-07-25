// Smooth scroll for all anchor links
window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Highlight code blocks on click
  document.querySelectorAll('pre code').forEach(block => {
    block.addEventListener('click', function() {
      this.classList.toggle('highlighted');
    });
  });
});
