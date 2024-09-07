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
  
function submitForm(event) {
    event.preventDefault(); // Mencegah form dikirim secara default
  
          // Ambil data dari form
          const name = document.getElementById('name').value;
          const email = document.getElementById('email').value;
          const phone = document.getElementById('phone').value;
          const subject = document.getElementById('subject').value;
          const message = document.getElementById('message').value;
  
          // Buat mailto link
          const mailtoLink = `mailto:your-email@gmail.com?subject=${encodeURIComponent(subject)}&body=Name: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0APhone: ${encodeURIComponent(phone)}%0AMessage: ${encodeURIComponent(message)}`;
  
          // Redirect ke mailto link
          window.location.href = mailtoLink;
      }