document.addEventListener('DOMContentLoaded', function() {
    const fadeUpElements = document.querySelectorAll('[data-fade-up]');
  
    fadeUpElements.forEach(function(element) {
      element.classList.add('fade-up');
  
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-up-active');
            observer.unobserve(entry.target);
          }
        });
      }, { once: false }); // Add the 'once' option to trigger the animation only once
  
      observer.observe(element);
    });
  });