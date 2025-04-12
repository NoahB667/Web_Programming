let slideIndex = 0
let slides = document.querySelectorAll(".slide")

function showSlide(index) {
    if (index >= slides.length) {
        slideIndex = 0
    } else if(index < 0) {
        slideIndex = slides.length - 1
    } else {
        slideIndex = index
    }

    slides.forEach(slide => slide.style.display = "none")
    slides[slideIndex].style.display = "block"
}

function changeSlide(n) {
    showSlide(slideIndex + n);
}

showSlide(slideIndex);