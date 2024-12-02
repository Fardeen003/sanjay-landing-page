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

// Header Responsive menu
    function navigateTo(target) {
        // Close the dropdown
        $('.navbar-collapse').collapse('hide');

        // Use a timeout to allow the dropdown to close before navigating
        setTimeout(function() {
            window.location.hash = target; // Navigate to the target
        }, 300); // Adjust the timeout duration as needed
    }

    //  Make the links in navbar active acc. to the user scroll
