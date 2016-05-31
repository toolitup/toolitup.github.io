var canvas = document.getElementById('cubic-bezier');
var context = canvas.getContext('2d');
var animateCanvas = document.getElementById('animate-bezier');
var animateContext = animateCanvas.getContext('2d');
var playCanvas = document.getElementById('cubic-bezier-play');
var playContext = playCanvas.getContext('2d');

var playingAnimation = false;

var compareCurves = [
  new CompareBezier('#linear', new Point(0.0, 0.0), new Point(1.0, 1.0)), new CompareBezier('#ease', new Point(0.25, 0.1), new Point(0.25, 1)),
  new CompareBezier('#ease-in', new Point(0.42, 0.0), new Point(1.0, 1.0)), new CompareBezier('#ease-in-out', new Point(0.42, 0.0), new Point(0.58, 1.0)),
  new CompareBezier('#ease-out', new Point(0.0, 0.0), new Point(0.58, 1.0))
];

var activeCompareCurve = compareCurves[0];

function Point(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Point.prototype.toString = function() {
  return '(' + this.x + ', ' + this.y + ')';

};


var drawCompareCurves = function() {

  _.each(compareCurves, function(c) { c.draw(); });
  //select one
  compareCurves[0].click();

};

function validateBezierPoint(p) {
  if (p && p.x >= 0 && p.x <= 1 && p.y < 2 && p.y > -2)
    return true;
  return false;
}

function CompareBezier(s, p0, p1) {


  if (!s) throw "Provide proper selector";

  this.canvas = $(s)[0];
  this.ctx = this.canvas.getContext('2d');

  if (!validateBezierPoint(p0)) throw p0 + " is not valid";
  if (!validateBezierPoint(p1)) throw p1 + " is not valid";

  this.P0 = p0;
  this.P1 = p1;

  this.selector = s;

  //bind
  var that = this;
  $(s).on('click', function(e) {
    $('.cb-tick').hide();
    $(this).next().show();
    activeCompareCurve = that;
    plotPlayCurve();
  });

  this.click = function() {
    $(this.selector).click();
  };


  this.draw = function() {

    this.ctx.canvas.width = this.ctx.canvas.width;

    var w = this.ctx.canvas.width;
    var h = this.ctx.canvas.height;

    if (w != h) throw w + " !=" + h + " in compare bezier";

    var x1 = parseInt(this.P0.x * w);
    var x2 = parseInt(this.P1.x * w);

    var y1 = parseInt((this.P0.y > 1) ? (1 - this.P0.y) * w : ((this.P0.y < 0) ? (Math.abs(this.P0.y) * w) + w : (w - this.P0.y * w)));
    var y2 = parseInt((this.P1.y > 1) ? (1 - this.P1.y) * w : ((this.P1.y < 0) ? (Math.abs(this.P1.y) * w) + w : (w - this.P1.y * w)));

    this.ctx.beginPath();
    this.ctx.moveTo(0, w);
    this.ctx.bezierCurveTo(x1, y1, x2, y2, w, 0);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
    this.ctx.stroke();

  };
}

CompareBezier.prototype.toString = function() {
  return "{" + this.p0 + ", " + p1 + "}";
};


var movePointerRatio = function() {

  var d0 = $('#P0').position();
  var d1 = $('#P1').position();

  var e = $('#cubic-bezier');
  var w = e.width();
  var h = e.height();
  var adj = (h - w) / 2;

  return [{ x: d0.left / w, y: (d0.top - adj) / w }, { x: d1.left / w, y: (d1.top - adj) / w }];

};

var coordinatesToPoints = function(p0, p1, $$) {

  var w = $$.width();
  var h = $$.height();

  if (h < w) throw "height is not greater than width";

  // Extra space for Y-axis 
  var adj = (h - w) / 2;

  var parent = $$.parent();
  var pdh = parent.outerHeight(true) - parent.innerHeight();
  var pdw = parent.outerWidth(true) - parent.innerWidth();

  var gw = w - pdw;
  var gh = h - pdh;

  if (p0.left > 1 || p0.left < 0 || p1.left > 1 || p1.left < 0) throw "x axis should be in a range [0,1]";

  var x1 = parseInt(p0.left * gw);
  var x2 = parseInt(p1.left * gw);

  var y1 = parseInt((p0.top > 1) ? (1 - p0.top) * w + adj : ((p0.top < 0) ? (Math.abs(p0.top) * w) + w + adj : (w - p0.top * w) + adj));
  var y2 = parseInt((p1.top > 1) ? (1 - p1.top) * w + adj : ((p1.top < 0) ? (Math.abs(p1.top) * w) + w + adj : (w - p1.top * w) + adj));

  return [x1, y1, x2, y2];

};

var drawPoints = function(points) {

  if (!points || points.length != 4)
    throw "Invalid points: " + points;

  $('#P0').css('top', points[1]);
  $('#P0').css('left', points[0]);
  $('#P1').css('top', points[3]);
  $('#P1').css('left', points[2]);
  $('#P0').data('x', points[0]);
  $('#P0').data('y', points[1]);
  $('#P1').data('x', points[2]);
  $('#P1').data('y', points[3]);


};


var animateBezier = function(x1, y1, x2, y2) {
  var w = animateContext.canvas.width;
  var h = animateContext.canvas.height;

  if (w != h) throw "w != h in animate bezier";
  animateContext.canvas.width = animateContext.canvas.width;

  var elem = $('#animate-bezier');
  var ratio = _.map(movePointerRatio(), function(xy) {
    return { x: parseInt(xy.x * w), y: parseInt(xy.y * w) };
  });


  animateContext.beginPath();
  animateContext.moveTo(0, h);
  animateContext.bezierCurveTo(ratio[0].x, ratio[0].y, ratio[1].x, ratio[1].y, w, 0);
  animateContext.lineWidth = 2;
  animateContext.strokeStyle = "rgba(255,255,255,1)";
  animateContext.stroke();


};


var timeDelay = function(e) {

  context.font = "14px times";
  context.fillStyle = "rgba(0, 0, 0, 0.4)";

  var mx = e && (e.offsetX || e.clientX - $(e.target).offset().left);
  var my = e && (e.offsetY || e.clientY - $(e.target).offset().top);
  var w = context.canvas.width;
  var h = context.canvas.height;
  var adj = (h - w) / 2;


  if (!e || e.type != 'mousemove' || !mx || !my) {
    context.fillText("DURATION", w / 3.5, w + adj + 30);
    context.fillText("TRANSITION", w / 3.5, adj - 10);
  } else {
    var ah = h - 2.0 * adj;
    var parent = $('#cubic-bezier').parent();
    var pdh = parent.outerHeight(true) - parent.innerHeight();
    var transition = parseInt((+(((ah - (my - pdh - adj)) / ah).toFixed(2))) * 100);
    var delay = parseInt(Math.ceil(mx / w * 100));
    context.fillText("DURATION(" + delay + "%)", w / 3.5, w + adj + 30);
    context.fillText("TRANSITION(" + transition + "%)", w / 3.5, adj - 10);
  }
};

function initPlot(w, p) {
  //reset screen
  context.canvas.width = context.canvas.width;

  context.fillStyle = "rgba(0, 0, 0, 0.025)";
  var ticks = w / 10;
  for (var y = w + p - ticks, x = w / ticks - 1; y >= p; y -= ticks, x -= 1) {
    if (x == 5) {
      context.fillStyle = "rgba(55, 80, 190, 0.25)";
    } else {
      context.fillStyle = "rgba(100, 90, 90, 0.1)";
    }
    context.fillRect(0.5, y, w, 1);
    context.fillRect(x * ticks - 0.5, p, 1, w);
  }
  context.fillRect(w - 0.5, p, 1, w);

  context.moveTo(0, p);
  context.lineTo(0, w + p);
  context.lineTo(w + p, w + p);
  context.lineWidth = 2;
  context.strokeStyle = "rgba(0, 0, 0, 0.4)";
  context.stroke();

  context.fillStyle = 'rgba(255,0,202,0.055)';
  context.beginPath();

  var fph = $('#FP0').height() - 2;
  var fpw = $('#FP0').width() - 2;

  context.moveTo(0, w + p - (fpw + fph - 5));
  context.lineTo(w + p - (fpw + fph - 5), 0);
  context.lineTo(w + p, Math.abs(fph - fpw));
  context.lineTo(Math.abs(fph - fpw), w + p);
  context.closePath();

  context.fill();

}

function plotCurve(e) {

  // coordinates
  var p0 = $('#P0').data();
  var p1 = $('#P1').data();

  var w = $('#cubic-bezier').width();
  var h = $('#cubic-bezier').height();

  if (h < w) throw "height is not greater than width";

  // Extra space for Y-axis 
  var adj = (h - w) / 2;

  var parent = $('#cubic-bezier').parent();
  var pdh = parent.outerHeight(true) - parent.innerHeight();
  var pdw = parent.outerWidth(true) - parent.innerWidth();

  // draw plot
  initPlot(w, adj);


  var ah = h - 2.0 * adj;
  var x1 = +((((p0.x - pdw) * 1.0) / w).toFixed(2));
  var y1 = +(((ah - (p0.y - pdh - adj)) / ah).toFixed(2));
  var x2 = +(((p1.x - pdw) * 1.0 / w).toFixed(2));
  var y2 = +(((ah - (p1.y - pdh - adj)) / ah).toFixed(2));


  $('.cb-x1').text(x1);
  $('.cb-x2').text(x2);
  $('.cb-y1').text(y1);
  $('.cb-y2').text(y2);

  //update url
  window.history.replaceState({}, 'Cubic bezier curve generator', '/cubic-bezier.html?x1=' + x1 + "&y1=" + y1 + "&x2=" + x2 + "&y2=" + y2);

  var fph = $('#FP0').height() - 2;
  var fpw = $('#FP0').width() - 2;


  // tracking lines
  context.beginPath();
  context.moveTo(0, w + adj);
  context.lineTo(p0.x - pdw, p0.y - pdh);
  context.closePath();
  context.lineWidth = 5;
  context.strokeStyle = 'deepskyblue';
  context.stroke();

  context.beginPath();
  context.moveTo(w, adj);
  context.lineTo(p1.x - pdw, p1.y - pdh);
  context.closePath();
  context.lineWidth = 5;
  context.strokeStyle = "rgba(50, 205, 149, 0.86)";
  context.stroke();

  // bezier curve
  context.beginPath();
  context.moveTo(0, w + adj);
  context.bezierCurveTo(p0.x - pdw, p0.y - pdh, p1.x - pdw, p1.y - pdh, w, adj);
  context.lineWidth = 5;
  context.strokeStyle = "deeppink";
  context.stroke();

  //FP
  var fp0Top = w + pdh + adj;
  $('#FP0').css('top', fp0Top + "px");
  $('#FP0').css('left', "0px");

  var fp1Top = pdh + adj;
  var fp1Left = w;
  $('#FP1').css('top', fp1Top + "px");
  $('#FP1').css('left', fp1Left + "px");

  timeDelay(e);

  //animate
  animateBezier(x1, y1, x2, y2);

  //play curve
  plotPlayCurve();
}





function drag(e) {
  var pos = $(this).position();
  var top = pos.top;
  var left = pos.left;

  var data = $(this).data();

  $(this).data('x', left);
  $(this).data('y', top);

  plotCurve(e);
  clippy();
}




var clippy = function() {
  var content = $('.cb-code').text().replace(/\s+/g, " ").trim();

  var prefixes = ['-moz-', '-o-', '-webkit-', ''];
  var output = _.chain(prefixes).map(function(p) {
    return p + content + ";\n";
  }).reduce(function(i, e) {
    return i + e;
  }, "").value().trim();

  $('.cb-copy').attr('data-clipboard-text', output);
  $('.cb-copy').show();
};


var initSlider = function() {

  $("#cb-slider").slider({
      animate: true,
      min: 1,
      max: 100,
      value: 10,
      handle: true,
      slide: function(event, ui) {
        var value = ui.value;
        $('.cb-duration').text((value / 10) + "s");
      }

    })
    .slider("pips", {
      rest: "label",
      suffix: "&#8243",
      formatLabel: function(value) {
        if (value % 20 === 0)
          return (value / 10) + "<b class=\"seconds\">" + this.suffix + "</b>";
        else return "";
      }
    }).slider('float', {
      suffix: "s",
      formatLabel: function(value) {
        return (value / 10).toFixed(1) + this.suffix;
      }
    });

};

var plotPlayCurve = function() {

  if (playingAnimation) return;

  var w = playContext.canvas.width;
  var h = playContext.canvas.height;
  playContext.canvas.width = playContext.canvas.width;

  var adj = (h - w) / 2;

  // grid
  playContext.fillStyle = "rgba(0, 0, 0, 0.025)";
  var ticks = w / 10;
  var p = adj;
  for (var y = w + p - ticks, x = w / ticks - 1; y >= p; y -= ticks, x -= 1) {
    if (x == 5) {
      playContext.fillStyle = "rgba(55, 80, 190, 0.25)";
    } else {
      playContext.fillStyle = "rgba(100, 90, 90, 0.1)";
    }
    playContext.fillRect(0.5, y, w, 1);
    playContext.fillRect(x * ticks - 0.5, p, 1, w);
  }
  playContext.fillRect(w - 0.5, p, 1, w);

  // border
  playContext.beginPath();
  playContext.moveTo(0, adj);
  playContext.lineTo(0, w + adj);
  playContext.lineTo(w, w + adj);
  playContext.lineTo(w, adj);
  playContext.closePath();
  playContext.lineWidth = 2;
  playContext.strokeStyle = 'darkgrey';
  playContext.stroke();

  var cb = activeCompareCurve;
  var x1 = parseInt(cb.P0.x * w);
  var x2 = parseInt(cb.P1.x * w);

  var y1 = parseInt((cb.P0.y > 1) ? (1 - cb.P0.y) * w + adj : ((cb.P0.y < 0) ? (Math.abs(cb.P0.y) * w) + w + adj : (w - cb.P0.y * w) + adj));
  var y2 = parseInt((cb.P1.y > 1) ? (1 - cb.P1.y) * w + adj : ((cb.P1.y < 0) ? (Math.abs(cb.P1.y) * w) + w + adj : (w - cb.P1.y * w) + adj));

  // draw compare curve
  playContext.beginPath();
  playContext.moveTo(0, w + adj);
  playContext.bezierCurveTo(x1, y1, x2, y2, w, adj);
  playContext.lineWidth = 5;
  playContext.strokeStyle = "rgba(105, 105, 105, 0.3)";
  playContext.stroke();

  // ratio of movable drag pointers
  var ratio = _.map(movePointerRatio(), function(xy) {
    return { x: parseInt(xy.x * w), y: parseInt(xy.y * w) };
  });


  playContext.beginPath();
  playContext.moveTo(0, w + adj);
  playContext.bezierCurveTo(ratio[0].x, ratio[0].y + adj, ratio[1].x, ratio[1].y + adj, w, adj);
  playContext.lineWidth = 5;
  playContext.strokeStyle = "rgba(50, 205, 149, 0.3)";
  playContext.stroke();


};


/* courtesy : http://13thparallel.com/archive/bezier-curves/ */
var cubicBezier = {};
cubicBezier.B1 = function(t) {
  return t * t * t;
};
cubicBezier.B2 = function(t) {
  return 3 * t * t * (1 - t);
};
cubicBezier.B3 = function(t) {
  return 3 * t * (1 - t) * (1 - t);
};
cubicBezier.B4 = function(t) {
  return (1 - t) * (1 - t) * (1 - t);
};

cubicBezier.getBezier = function(p, FP0, P0, P1, FP1) {
  var dx = FP0.x * this.B1(p) + P0.x * this.B2(p) + P1.x * this.B3(p) + FP1.x * this.B4(p);
  var dy = FP0.y * this.B1(p) + P0.y * this.B2(p) + P1.y * this.B3(p) + FP1.y * this.B4(p);
  return { x: dx, y: dy };
};





var playAnimation = function() {


  // rest plot curve
  plotPlayCurve();

  //set playing state
  playingAnimation = true;

  //disable click, change opacity and cursur
  $('#cb-compare').attr('disabled', 'disabled');
  $('#cb-compare').css('opacity', '0.5');
  $('#cb-compare').css('cursor', 'not-allowed');

  var duration = $("#cb-slider").slider("value") * 20;
  var iteration = 0;

  var w = playContext.canvas.width;
  var h = playContext.canvas.height;

  var adj = (h - w) / 2;

  // moving drag pointers cache
  var ratio = _.map(movePointerRatio(), function(xy) {
    return { x: parseInt(xy.x * w), y: parseInt(xy.y * w) };
  });

  // compare curve	
  var cmpCurve = activeCompareCurve;
  var x1 = parseInt(cmpCurve.P0.x * w);
  var x2 = parseInt(cmpCurve.P1.x * w);

  var y1 = parseInt((cmpCurve.P0.y > 1) ? (1 - cmpCurve.P0.y) * w + adj : ((cmpCurve.P0.y < 0) ? (Math.abs(cmpCurve.P0.y) * w) + w + adj : (w - cmpCurve.P0.y * w) + adj));
  var y2 = parseInt((cmpCurve.P1.y > 1) ? (1 - cmpCurve.P1.y) * w + adj : ((cmpCurve.P1.y < 0) ? (Math.abs(cmpCurve.P1.y) * w) + w + adj : (w - cmpCurve.P1.y * w) + adj));

  var compare = [{ x: w, y: adj }, { x: x2, y: y2 }, { x: x1, y: y1 }, { x: 0, y: w + adj }];
  var cb = [{ x: w, y: adj }, { x: ratio[1].x, y: ratio[1].y + adj }, { x: ratio[0].x, y: ratio[0].y + adj, }, { x: 0, y: w + adj }];


  var play = function() {
    if (iteration > duration) {
      clearInterval(interval);
      //plotPlayCurve();
      $('#cb-compare').removeAttr('disabled');
      $('#cb-compare').css('opacity', '1');
      $('#cb-compare').css('cursor', 'pointer');
      playingAnimation = false;
    } else {
      var ct = iteration / duration;
      if (iteration > 0) {
        var ct1 = (iteration - 1) / duration;
        var cbPoint = cubicBezier.getBezier(ct, cb[0], cb[1], cb[2], cb[3]);
        var cboPoint = cubicBezier.getBezier(ct1, cb[0], cb[1], cb[2], cb[3]);

        playContext.beginPath();
        playContext.quadraticCurveTo(cboPoint.x, cboPoint.y, cbPoint.x, cbPoint.y);
        playContext.strokeStyle = "rgba(50, 205, 149, 1)";
        playContext.stroke();

        var point = cubicBezier.getBezier(ct, compare[0], compare[1], compare[2], compare[3]);
        var opoint = cubicBezier.getBezier(ct1, compare[0], compare[1], compare[2], compare[3]);

        playContext.beginPath();
        playContext.quadraticCurveTo(opoint.x, opoint.y, point.x, point.y);
        playContext.strokeStyle = "rgba(105, 105, 105, 1)";
        playContext.stroke();
      }
      iteration += 1;
    }
  };

  var interval = setInterval(play, 5);

};

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var drawInitialCurve = function() {

  var x1 = getParameterByName('x1');
  var y1 = getParameterByName('y1');
  var x2 = getParameterByName('x2');
  var y2 = getParameterByName('y2');

  var points;
  if (x1 && x2 && validateBezierPoint(new Point(x1, y1)) && x2 && y2 && validateBezierPoint(new Point(x2, y2))) {
    points = coordinatesToPoints({ top: y1, left: x1 }, { top: y2, left: x2 }, $('#cubic-bezier'));
  } else {
    points = coordinatesToPoints({ top: 0.31, left: 0.74 }, { top: 0.80, left: 0.37 }, $('#cubic-bezier'));
  }
  // initial postion - for testing
  drawPoints(points);

};

// init function
$(function() {

  $('#cubic-bezier').on('mousemove', drag);
  $('#cubic-bezier').on('mouseout', drag);
  $('#P0, #P1').draggable({
    containment: '#cubic-bezier',
    scroll: false,
    drag: drag,
    stop: drag,
    cancel: false,
    stack: ".curve-pointer"
  });

  drawInitialCurve();

  plotCurve();

  $('.cb-code').on('mouseenter', clippy);

  // for dev 
  ZeroClipboard.config({ trustedDomains: ["*"] });

  var client = new ZeroClipboard($('.cb-copy'));

  // draw compare curves
  drawCompareCurves();

  initSlider();

  $('#cb-compare').on('click', function(e) {
    playAnimation();
  });

});
