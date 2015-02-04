


jQuery(function($) {

    /*==========================================
    CUSTOM SCRIPTS
    =====================================================*/

    // CUSTOM LINKS SCROLLING FUNCTION 

    $('a[href*=#]').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
       && location.hostname == this.hostname) {
            var $target = $(this.hash);
            $target = $target.length && $target
            || $('[name=' + this.hash.slice(1) + ']');
            if ($target.length) {
                var targetOffset = $target.offset().top;
                $('html,body')
                .animate({ scrollTop: targetOffset }, 900); //set scroll speed here
                return false;
            }
        }
    });

    /*==========================================
  PARALLAX SCRIPTS
   =====================================================*/

	$('.parallax').scrolly();
	$('.parallax-phone').scrolly({ bgParallax: true });
	$('.parallax-ipad').scrolly();

    /*==========================================
    WRITE  YOUR  SCRIPTS BELOW
    =====================================================*/
	
	clickableItems();

});

function clickableItems() {

	$('.cubic-bezier').on('click', function() {
		window.location.href = "http://www.toolitup.com/cubic-bezier.html";
	});
	$('.circular-slider').on('click', function() {
		window.location.href = "http://www.toolitup.com/circular-slider.html";
	});
	$('.minimap').on('click', function() {
		window.location.href = "http://www.toolitup.com/minimap.html";
	});
	$('.atom-plugin').on('click', function() {
		window.location.href = "http://www.toolitup.com/atom-cubic-bezier.html";
	});
	$('.jrate').on('click', function() {
		window.location.href = "http://www.toolitup.com/jRate.html";
	});
}