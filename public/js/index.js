    // carousel

window.addEventListener('load', function () {

    let carouselId = activateAutomaticCarousel();

    const slideButtons = document.querySelectorAll("[data-slide-button]");

    slideButtons.forEach( button => {

        button.addEventListener('click', function(){

            deactivateAutomaticCarousel(carouselId);

            const buttonOffset = button.dataset.slideButton === "next" ? 1 : -1;

            const slides = button.closest("[data-carousel]").querySelector("[data-slides]")

            const activeSlide = slides.querySelector("[data-active]");

            let newSlideIndex = [...slides.children].indexOf(activeSlide) + buttonOffset;

            if(newSlideIndex < 0 )
            newSlideIndex = slides.children.length - 1;
            if(newSlideIndex >= slides.children.length)
            newSlideIndex = 0;

            slides.children[newSlideIndex].dataset.active = true;

            delete activeSlide.dataset.active;

            carouselId = activateAutomaticCarousel();
        }); 
    });

    //automatic carousel movements
    function activateAutomaticCarousel()
    {
        const slides = document.querySelector('[data-slides]')

        const carouselId = setInterval(() => {
            const activeSlide = slides.querySelector('[data-active]');

            let newSlideIndex = Array.from(slides.children).indexOf(activeSlide) + 1;

            if(newSlideIndex >= slides.children.length)
            newSlideIndex = 0;

            slides.children[newSlideIndex].dataset.active = true;

            delete activeSlide.dataset.active;
        }, 3000)

        return carouselId;
    }

    function deactivateAutomaticCarousel( carouselId )
    {
        clearInterval(carouselId);
    }
});