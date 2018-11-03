$(window).on("scroll", function() {
    if($(window).scrollTop() > 50) {
        $(".js-header-nav").addClass("header__nav--active");
    } else {
       $(".js-header-nav").removeClass("header__nav--active");
    }
});
