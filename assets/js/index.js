document.addEventListener('DOMContentLoaded', function() {
    const menuToggleButton = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
  
    menuToggleButton.addEventListener('click', function() {
      if (mobileMenu.classList.contains('mobile-menu-active')) {
        mobileMenu.classList.remove('mobile-menu-active');
      } else {
        mobileMenu.classList.add('mobile-menu-active');
      }
    });
  });

  