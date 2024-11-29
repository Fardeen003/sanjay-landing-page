const knowMoreContainer = document.querySelector(".intro-desc-container");
const readMoreBtn = document.querySelector(".read-more-btn");

const handleReadMore = ()=>{
    knowMoreContainer.classList.toggle("show-more");
    if (knowMoreContainer.classList.contains("show-more")) {
        readMoreBtn.innerHTML = "Read Less";
    } else {
        readMoreBtn.innerHTML = "Read More";
    }

}

const myCarouselElement = document.querySelector('#myCarousel')

const carousel = new bootstrap.Carousel(myCarouselElement, {
  interval: 2000,
  touch: false
})