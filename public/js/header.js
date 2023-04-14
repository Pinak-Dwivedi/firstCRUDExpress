const hamburgerBtn = document.querySelector(".toggle-hamburger-btn");
const navLinks = document.getElementsByClassName('nav-links')[0];

window.addEventListener('load', () => {

    hamburgerBtn.addEventListener('click', function (event){
        event.preventDefault();
        navLinks.classList.toggle('active');
    });
    
});