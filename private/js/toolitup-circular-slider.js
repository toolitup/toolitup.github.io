
$(function() {
	var fullCircularSlider = $('#slider-full').CircularSlider({ 
		min : 0, 
		max: 359, 
		value : 10,
		labelSuffix: "&deg",
		slide : function(ui, value) {
			ui.next().css({'background' : 'linear-gradient(' + value + 
				'deg, white, cornsilk, white)'});
		}
	});	
	
	var halfCircularSlider = $('#slider-half-circle').CircularSlider({ 
		min : 0, 
		max: 100, 
		value : 60,
		shape: "Half Circle",
		labelSuffix: "%",
		slide : function(ui, value) {
			if (value < 50) {
				ui.next().css({'background' : 'rgba(250, 81, 81,' + ((100 - value) / 100) + ')'});
			} else {
				ui.next().css({'background' : 'rgba(87, 250, 87,' + (value / 100) + ')'});			
			}
		}
	});	
	

	var halfRightCircularSlider = $('#slider-half-circle-right').CircularSlider({ 
		min : 0, 
		max: 100, 
		value : 40,
		shape: "Half Circle Right",
		labelSuffix: " kph",
		slide : function(ui, value) {
			var alpha = value / 100;
			if (value <= 50) {
				ui.next().css({'background' : 'rgba(87, 250, 87,' + alpha + ')'});			
			}
			else if (value <= 80) {
				ui.next().css({'background' : 'rgba(255, 235, 0,' + alpha + ')'});			
			} else {
				ui.next().css({'background' : 'rgba(250, 81, 81,' + alpha + ')'});
			}
		}
	});	

	var halfLeftCircularSlider = $('#slider-half-circle-left').CircularSlider({ 
		min : 0, 
		max: 100, 
		value : 40,
		shape: "Half Circle Left",
		labelSuffix: " kph",
		slide : function(ui, value) {
			var alpha = value / 100;
			if (value <= 50) {
				ui.next().css({'background' : 'rgba(87, 250, 87,' + alpha + ')'});			
			}
			else if (value <= 80) {
				ui.next().css({'background' : 'rgba(255, 235, 0,' + alpha + ')'});			
			} else {
				ui.next().css({'background' : 'rgba(250, 81, 81,' + alpha + ')'});
			}
		}
	});	
	
	var halfBottomCircularSlider = $('#slider-half-circle-bottom').CircularSlider({ 
		min : -50, 
		max: 50, 
		value : 20,
		shape: "Half Circle Bottom",
		labelPrefix: "&#9661;",
		slide : function(ui, value) {
			var alpha = Math.abs(value) / 100;
			ui.next().css({'background' : 'rgba(7, 154, 252,' + alpha + ')'});			
		}
	});	
	
	var imageSlider = $('#slider-customized').CircularSlider({ 
		min : 0, 
		max: 359,
		radius: 100,
		innerCircleRatio : .7,
		formLabel : function(value, prefix, suffix) {
			return '<img src="assets/images/baby' + parseInt(value / 23) + '.png"></img>';
		},
		slide : function(ui, value) {
			var colors = ['deeppink', 'seagreen', 'deepskyblue', 'coral', 'cadetblue', 'olive', 'chocolate',
				'yellowgreen', 'cornflowerblue', 'slategrey', 'salmon', 'brown', 'darkgoldenrod', 'dimgrey',
				'antiquewhite', 'turquoise'];
			var color = colors[parseInt(value / 23)];
			ui.find('.jcs').css({'border-color' : color });
			ui.find('.jcs-indicator').css({'background' : color });
		}
	});	

	
	$("div[class^='cs-demo-']").css('display', 'none');
	
	$('.cs-demo-1').css('display', 'table');
	
	$('#menu').children().on('click', function(e) {
	
		var demo = $(this).data().menuanchor;

		$('div[class^="cs-demo-"').css('display', 'none');
		$('.' + demo).css('display', 'table');		
		
	});
	
});

