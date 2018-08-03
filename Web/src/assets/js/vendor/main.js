$.noConflict();

jQuery(document).ready(function($) {

    "use strict";

    $('#menuToggle').on('click', function(event) {
        $('body').toggleClass('open');
    });

    $('.search-trigger').on('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        $('.search-trigger').parent('.header-left').addClass('open');
    });

    $('.search-close').on('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        $('.search-trigger').parent('.header-left').removeClass('open');
    });

    // datepicker
    $(function() {
        $('[data-toggle="datepicker"]').datepicker({
            autoHide: true,
            zIndex: 2018
        });
    });

    $("#slickMoisture").slick({
        infinite: true,
        centerPadding: '20px',
        slidesToShow: 7,
        slidesToScroll: 3,
        arrows: true,
        dots: false,
        autoplay: true,
        autoplaySpeed: 5000,
        speed: 500,
        responsive: [{
                breakpoint: 1601,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
                }
            },
            {
                breakpoint: 769,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }
        ]
    });
    $("#slickMoisture02").slick({
        infinite: true,
        centerPadding: '20px',
        slidesToShow: 7,
        slidesToScroll: 3,
        arrows: true,
        dots: false,
        autoplay: true,
        autoplaySpeed: 6000,
        speed: 500,
        responsive: [{
                breakpoint: 1601,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
                }
            },
            {
                breakpoint: 769,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }
        ]
    });
    // switch checkbox
    $('.ckInp-js').on('change', function(evt){
   		if(evt.target.checked){
     	$('#modalWeather').modal();
   }
});
});