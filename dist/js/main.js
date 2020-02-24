new WOW().init();


$(document).ready(function() {
	var home_testimonial_img = new Swiper('.homeTestimonial-img-swiper', {
		slidesPerView: 1,
		navigation: {
			nextEl: '.homeTestimonial-img-navigation .next',
			prevEl: '.homeTestimonial-img-navigation .prev',
		}
	})

	var home_testimonial_text = new Swiper('.homeTestimonial-text-swiper', {
		slidesPerView: 1,
		thumbs: {
	        swiper: galleryThumbs,
	    },
	});
	

})
