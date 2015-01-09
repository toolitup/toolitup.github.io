

function generateJRate(id, options) {

    var defaults = {
        rating: 3,
        shape: "STAR",
        count: 5,
        width: "30",
        height: "30",
        widthGrowth: 0.0,
        heightGrowth: 0.0,
        backgroundColor: "white",
        startColor: "yellow",
        endColor: "green",
        strokeColor: "black",
        shapeGap: "0px",
        opacity: 1,
        min: 0,
        max: 5,
        precision: 1,
        horizontal: true,
        reverse: false,
        readOnly: false,
        onChange: null,
        onSet: null
    };
	console.dir(options);
	var settings = $.extend({}, defaults, options);

	//console.dir(settings);
	$("#"+id).jRate({
		rating: settings.rating,
		shape: settings.shape,
        count: settings.count,
        width: settings.width,
        height: settings.height,
        widthGrowth: settings.widthGrowth,
        heightGrowth: settings.heightGrowth,
        backgroundColor: settings.backgroundColor,
        startColor: settings.startColor,
        endColor: settings.endColor,
        strokeColor: settings.strokeColor,
        shapeGap: settings.shapeGap,
        opacity: settings.opacity,
        min: settings.min,
        max: settings.max,
        precision: settings.precision,
        horizontal: settings.horizontal,
        reverse: settings.reverse,
        readOnly: settings.readOnly,
        onChange: function(rating) {
				console.log("Rating: "+rating+"  Id: "+id);
				$("#"+id+"-value").text(rating);
		},
        onSet: settings.onSet
	});

}


$(function() {

	console.log("Entering into Start");
	generateJRate('demo-main', {});
	generateJRate('demo-color', {startColor: 'cyan', endColor: 'blue'});
	generateJRate('demo-width', {width: '60', height: '60'});
	generateJRate('demo-shape', {shape: 'RHOMBUS'});
	generateJRate('demo-width-growth', {widthGrowth: 0.2, heightGrowth: 0.2});
	generateJRate('demo-count', {count: 10});
	generateJRate('demo-bg-color', {backgroundColor: 'black'});
	generateJRate('demo-gap', {shapeGap: '10px'});
	generateJRate('demo-opacity', {opacity: 0.3});

	generateJRate('demo-min-max', {min: 10, max: 15, rating: 11});
	generateJRate('demo-precision', {precision: 0});
	generateJRate('demo-horizontal', {horizontal: false});
	generateJRate('demo-reverse', {reverse: true});
	generateJRate('demo-readonly', {readOnly: true});
	
	callOnChange();
	callOnSet();
	console.log("Ending all");

});

function callOnChange() {
	console.log("Call Onchange");
	$("#demo-onchange").jRate({
		rating: 3,
		width: 30,
		height: 30,
		onChange: function(rating) {
			$('#demo-onchange-value').text("Your Rating: "+rating);
		}
	});
}

function callOnSet() {
	console.log("Call onset");
	$("#demo-onset").jRate({
		rating: 3,
		width: 30,
		height: 30,
		onSet: function(rating) {
			$('#demo-onset-value').text("Selected Rating: "+rating);
		}
	});
}
