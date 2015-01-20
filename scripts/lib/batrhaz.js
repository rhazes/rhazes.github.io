"use strict";
var minWinCount = 10;
var maxWinCount = 20;
var bLayer1, bLayer2;

var Building =  {
		  l : 0,
		  t : 0,
		  w : 20,
		  h : 70, 
		  color : [100,100,100],

		  draw : function() {
			   fill(this.color);
			   rect(this.l,this.t,this.w,this.h); }};


function buildWindows( bldg, prob ) {
	 bldg.windows = [];
	 var nAcross = int(random(10, 20)); 
	 var nHigh = int(random(10, 20)); 

	 //total window width is half the width of the building
	 var winWd =  bldg.w / (2.0 * nAcross ) ;
	 //total window height is half the height of the building
	 var winHt = bldg.h / (2.0 * nHigh );

	 //a little spacing from the edge of the building
	 var x = bldg.l + (1.0 / (2.0 * nAcross) );
	 var y = bldg.t + winHt;

	 var winProb = random(0.3,0.9); 
	 for(var i=0; i < nAcross; i++) {
	    for(var j=0; j < nHigh; j++) {
   		if(random() < winProb ) {
 		  var c = random(100,250);
		bldg.windows.push( {
			x: x + (i * winWd * 2.0),
			y: y + (j * winHt * 2.0),
			w: winWd,
			h: winHt,
		 	col: c} );
		}
	    }
	  }
};

function buildBuilding(left, top, aWidth, aHeight, aColor, winPerc) {
  var b = Object.create(Building);
  b.l = left;
  b.t = top;
  b.w = aWidth;
  b.h = aHeight;
  b.color = aColor;
  buildWindows(b, winPerc);
//  b.draw();
  return b;
}


/*
Building.prototype.buildWindows = function() {
 this.windows = new Array();
 nAcross = int(random(minWinCount, maxWinCount)); 
 nHigh = int(random(minWinCount, maxWinCount)); 

//console.log(nAcross, nHigh);
 //total window width is half the width of the building
 wWt = this.wt / (2.0 * nAcross ) ;
 //total window height is half the height of the building
 wHt = this.ht / (2.0 * nHigh );
 
 //a little spacing from the edge of the building
 var x = this.left + (1.0 / (2.0 * nAcross) );
 var y = this.top + wHt;
 
 for(i=0; i < nAcross; i++) {
    for( j=0; j < nHigh; j++) {
	this.windows.push( {
			winX: x + (i * wWt * 2.0),
			winY: y + (j * wHt * 2.0),
			w: wWt,
			h: wHt,
		 	winCol: 255} );
    }
  }
};
*/
var imgx = 650;
var imgy = -25; 
var v1offx = 52, v1offy = 82, v2offx = 191, v2offy = 165;
var col = [150,100];
function drawRhazsign() {

  var cosinterp = cos(millis() * rate);
  var sininterp = abs(sin(millis() * rate));
//  var imgx = map(cosinterp,-1.0,1.0,minSignX,maxSignX);
//  var imgy = map(sininterp,0,1.0,50,0);
//  imgx = 400; imgy = 200;
  fill(col);
  beginShape();
  vertex(imgx + v1offx,imgy + v1offy);
  vertex(imgx + v2offx, imgy + v2offy);
  vertex(500, height - 30);
  endShape(CLOSE);

  image(shadow,imgx,imgy);
}

var rate = .0002;
var building;
var shadow;
var signRate = 400;
var minSignX = 0;
var maxSignX = 800;

var layers = 7;
var buildingCountRange = [40,20];
var buildingHeightRange = [30,100];
//probabilty range for creating buildings
var buildingDensities = [.1,.9];
//probability range for creating windows
var windowDensities = [.1,.2];
var meanWidths = [], meanHeights = [], meanDensity = [], meanWindowDensity = [];
var meanWidth = 50.0;
var sdWidth = 10.0;

var buildings = [];

function preload() {
// shadow = loadImage("assets/bat-rhazes-02.png");
 shadow = loadImage("/img/bat-rhazes-distorted.png");
}

function renderBuildingLayers(canvasLayer,beginLayer, endLayer) {

}

function setup() {
  var _canvas = createCanvas(900,300);
  _canvas.parent('p5container');
  noStroke();

  //initialize building dimensions by layers
  for(var i=0; i<layers; i++) {
    var t = i/(layers-1.0);
    meanWidths.push(  lerp(width/buildingCountRange[0], width/buildingCountRange[1],t) );
    meanHeights.push( lerp(buildingHeightRange[0],buildingHeightRange[1],t) );
    meanDensity.push( lerp(buildingDensities[0],buildingDensities[1],t) );
    meanWindowDensity.push( lerp(windowDensities[0], windowDensities[1],t ) );
  }



  var baseline = height;
  for(var i=0; i<layers/2.0; i++) {
    var pos = 0;
    while(pos < width) {
      var bw =  random(.9*meanWidths[i],1.1*meanWidths[i]);
      var bh =  random(.7*meanHeights[i],1.3*meanHeights[i]);
	var bldg = buildBuilding(pos, baseline-bh,bw,bh, random(10,100),meanWindowDensity[i]); 
	pos += bldg.w; 
 	var shouldAdd = random();
	if(shouldAdd > meanDensity[i]) {
	      buildings.push(bldg);
	}
    }
  }
  bLayer1 = createGraphics(width,height);

    bLayer1.background(255,0);
    bLayer1.noStroke();
    for(var i=buildings.length-1; i >= 0; i--) {
		var b = buildings[i];
		bLayer1.fill(b.color);
	 	bLayer1.rect(b.l,b.t,b.w,b.h);
		for(var j=0; j < b.windows.length; ++j) {
	           bLayer1.fill(b.windows[j].col);
		   bLayer1.rect(b.windows[j].x, b.windows[j].y, b.windows[j].w, b.windows[j].h);
		}
    }

    buildings = [];
  for(var i=floor(layers/2.0); i<layers ; i++) {
    var pos = 0;
    while(pos < width) {
      var bw =  random(.9*meanWidths[i],1.1*meanWidths[i]);
      var bh =  random(.7*meanHeights[i],1.3*meanHeights[i]);
	var bldg = buildBuilding(pos, baseline-bh,bw,bh, random(0,90),meanWindowDensity[i]); 
	pos += bldg.w; 
 	var shouldAdd = random();
	if(shouldAdd > meanDensity[i]) {
	      buildings.push(bldg);
	}
    }
  }
  bLayer2 = createGraphics(width,height);

    bLayer2.background(255);
    bLayer2.noStroke();
    for(var i=buildings.length-1; i >= 0; i--) {
		var b = buildings[i];
		bLayer2.fill(b.color);
	 	bLayer2.rect(b.l,b.t,b.w,b.h);
		for(var j=0; j < b.windows.length; ++j) {
	           bLayer2.fill(b.windows[j].col);
		   bLayer2.rect(b.windows[j].x, b.windows[j].y, b.windows[j].w, b.windows[j].h);
		}
    }
 }

function draw() {
  background(255);
  image(bLayer2,0,0);
  drawRhazsign(); 

  image(bLayer1,0,0);
// building.draw(); 

 // drawRhazsign();
}

function mouseClicked() {
  bWidth = randomGaussian(meanWidth,sdWidth);
  console.log("building width = " , bWidth);
  building.wt = max(20.0, bWidth);
  building.buildWindows();
  return false;
}

