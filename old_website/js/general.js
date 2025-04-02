function mycarousel_initCallback(carousel) {
    jQuery('.visual_control ul li a').bind('click', function() {
        carousel.scroll(jQuery.jcarousel.intval(jQuery(this).text()));
        return false;
    });
};

jQuery(document).ready(function() {
    jQuery(".visual_carousel").jcarousel({
        scroll: 1,
        initCallback: mycarousel_initCallback,
        buttonNextHTML: null,
        buttonPrevHTML: null
    });
	PosFooter();
	$(window).resize(function() {
		PosFooter();
	})
	function PosFooter(){
		if(jQuery(".page").height() < (jQuery(document).height()-110)){
			jQuery(".footer").css({'position':'absolute','bottom':'0'});
		}else{
			jQuery(".footer").css({'position':'relative','bottom':'auto'})
		}
	}


});
