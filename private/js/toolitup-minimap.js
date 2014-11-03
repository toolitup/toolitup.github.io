
function init() {
	
	var minimap = $('body').minimap();
	window.minimap = minimap;
	
	$('#pos1, #pos2').change(function(){
		var pos = this.checked ? "Right" : "Left";
		$('#pos1').prop('checked', this.checked);
		$('#pos2').prop('checked', this.checked);
		minimap.setPosition(pos);
	});
	
	$('#toggle').change(function() {
		if(this.checked) {
			minimap.show();
		} else {
			minimap.hide();
		}
	});

	$('#smoothScroll, #smoothScroll1').change(function() {
		minimap.setSmoothScroll(this.checked);
		$('#smoothScroll').prop('checked', this.checked);
		$('#smoothScroll1').prop('checked', this.checked);		
	});	


}

function initSlider($slider, slide) {
	return $slider.slider({ 
		animate: true, 
		min: slide.min, 
		max: slide.max, 
		value: slide.value, 
		handle: true,
		slide: function (event, ui) {
			var divider = slide.divBy || 100;
			console.log(divider);
			var value = ui.value/divider;
			if(slide.onSlide) slide.onSlide(value);
		}
		
	})
	.slider("pips", { 
		rest: "label", suffix: "", 
		formatLabel: function(value) {
			var divider = slide.divBy || 100;
			if(value % 10 == 0)
				return (value/divider);
			else return "";
		}
	}).slider('float', {
		suffix:"",
		formatLabel: function(value) {
			var divider = slide.divBy || 100;
			var fixed = (""+divider).length - 1;
			return (value/divider).toFixed(fixed) + this.suffix;
		}
	});
}

$(function() {

	var sliders = {
		"#hRslider" : {
			min: 1,
			max: 100,
			value: 60,
			divBy: 100,
			onSlide: function(value) {
				window.minimap.setHeightRatio(value);
				window['#hRslider1'].slider("value", value * 100 );
			}
		},
		"#wRslider" :  {
			min: 1,
			max: 50,
			value: 5,
			divBy: 100,
			onSlide: function(value) {
				window.minimap.setWidthRatio(value);
				window['#wRslider1'].slider("value", value * 100 );
			}
		},
		"#ohRslider" :  {
			min: 0,
			max: 899,
			value: 35,
			divBy: 1000,
			onSlide: function(value) {
				window.minimap.setOffsetHeightRatio(value);
				window['#ohRslider1'].slider("value", value * 1000 );
			}
		},
		"#owRslider" : {
			min: 0,
			max: 899,
			value: 35,
			divBy: 1000,
			onSlide: function(value) {
				window.minimap.setOffsetWidthRatio(value);
				window['#owRslider1'].slider("value", value * 1000);
			}
		},
		"#hRslider1" : {
			min: 1,
			max: 100,
			value: 60,
			divBy: 100,
			onSlide: function(value) {
				window.minimap.setHeightRatio(value);
				window['#hRslider'].slider("value", value  * 100);
			}
		},
		"#wRslider1" :  {
			min: 1,
			max: 50,
			value: 5,
			divBy: 100,
			onSlide: function(value) {
				window.minimap.setWidthRatio(value);
				window['#wRslider'].slider("value", value  * 100);
			}
		},
		"#ohRslider1" :  {
			min: 0,
			max: 899,
			value: 35,
			divBy: 1000,
			onSlide: function(value) {
				window.minimap.setOffsetHeightRatio(value);
				window['#ohRslider'].slider("value", value * 1000);
			}
		},
		"#owRslider1" : {
			min: 0,
			max: 899,
			value: 35,
			divBy: 1000,
			onSlide: function(value) {
				window.minimap.setOffsetWidthRatio(value);
				window['#owRslider'].slider("value", value * 1000 );
			}
		},
		"#smoothDelay" : {
			min: 0,
			max: 500,
			value: 20,
			divBy: 100,
			onSlide: function(value) {
				value = value < 4 ? 4 : value;
				window.minimap.setSmoothScrollDelay(value);
				window['#smoothDelay1'].slider("value", value * 100 );
			}
		},
		"#smoothDelay1" : {
			min: 0,
			max: 500,
			value: 20,
			divBy: 100,
			onSlide: function(value) {
				value = value < 4 ? 4 : value;
				window.minimap.setSmoothScrollDelay(value);
				window['#smoothDelay'].slider("value", value * 100 );
			}
		},
	};

	
	
	for(var s in sliders) {
		var $slider = $(s);
		var slide = sliders[s];
		window[s] = initSlider($slider, slide);
	}
	setTimeout(init, 500);
});
