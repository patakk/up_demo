
var canvas;
var anims = [];
var anim1;

var anim_ind = 0;
var playing = false;
var frameIdx = 0;
var changeAnim = false;

var particles = [];

var background_image;

var ttime = "DAY";

var frameBuffer = [];
var bufferSize = 4;

var ghost = false;
var sca = 1;
var effect_trans = 20;

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function fadeOutEffect() {
    var fadeTarget = document.getElementById("loading");
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.25;
        } else {
            clearInterval(fadeEffect);
        }
    }, 200);
}

function loadAnimation(path, ind1, ind2) {
    var paths = [];
    for(var k = ind1; k <= ind2; k++){
        //var npath = path + String(pad(k, 4)) + ".png";
        if(path == "static/data/frames_lowres/4_anim_aktivacija_druga/4_ani_" && k == 21)
        continue;
        if(path == "static/data/frames_lowres/6_anim_aktivacija_cetvrta/6_ani_" && k == 87)
            continue;
        if(path == "static/data/frames_lowres/6_anim_aktivacija_cetvrta/6_ani_" && k == 88)
            continue;
        var npath = path + String(k) + ".png";
        paths.push(npath);
    }
    frames = [];
    print('started loading images')
    for(var k = 0; k < paths.length; k++){
        frames.push(loadImage(paths[k], img => {} ));
    }
    print('ended')
    return frames
}

var ulazak;
var kruzenje;
var akt1;
var akt2;
var akt3;
var akt4;
var idle1;
var idle2;
var idle3;
var idle4;

var pro1;
var pro2;
var pro3;
var pro4;

var ulazak_gif;
var kruzenje_gif;
var akt1_gif;
var akt2_gif;
var akt3_gif;
var akt4_gif;
var idle1_gif;
var idle2_gif;
var idle3_gif;
var idle4_gif;

var akt;

var clicked = false;


class Akt {
    constructor(gif) {
        this.gif = gif;
        // this.frames = loadAnimation(this.prefix, this.fs, this.fe);
        this.numFrames = this.gif.numFrames();
        this.currentFrameIdx = 0;
        // this.currentFrame = this.frames[this.currentFrameIdx];
        this.nextAkt = this;
    }

    setNextAkt(nextAkt){
        this.nextAkt = nextAkt;
    }
    
    getNextAkt(){
        if(this.nextAkt !== kruzenje)
            this.nextAkt.currentFrameIdx = 0;
        this.nextAkt.previous = this;
        return this.nextAkt;
    }

    advance(){
        this.previous = this;
        var idx = this.currentFrameIdx;
        this.currentFrameIdx++;
        if(this.currentFrameIdx == this.numFrames && (this === kruzenje || this === idle1 || this === idle2 || this === idle3 || this === idle4))
            this.currentFrameIdx = 0;
        //frameBuffer.push(this.gif);
        //if(frameBuffer.length == bufferSize+1)
        //    frameBuffer.shift();
        this.gif.setFrame(idx)
        return this.gif;
    }

    getFrame(idx){
        if(idx === null){
            //frameBuffer.push(this.frames[this.currentFrameIdx]);
            //if(frameBuffer.length == bufferSize+1)
            //    frameBuffer.shift();
            return this.frames[this.currentFrameIdx];
        }
        else{
            //frameBuffer.push(this.frames[idx]);
            //if(frameBuffer.length == bufferSize+1)
            //    frameBuffer.shift();
            return this.frames[idx];
        }
    }
}


class Pro {
    constructor(idle, effect) {
        this.currentFrameIdx = 0;
        // this.currentFrame = this.frames[this.currentFrameIdx];
        this.nextAkt = this;
        this.effect = effect;
        this.idle = idle;
        this.numFrames = this.effect.duration;
    }

    setNextAkt(nextAkt){
        this.nextAkt = nextAkt;
    }
    
    getNextAkt(){
        if(this.nextAkt !== kruzenje){
        }
        this.nextAkt.previous = this;
        this.numFrames = this.effect.duration;
        return this.nextAkt;
    }

    advance(){
        this.previous = this;
        var idx = this.currentFrameIdx;
        this.currentFrameIdx++;
        if(this.currentFrameIdx == this.numFrames && this === kruzenje)
            this.currentFrameIdx = 0;
        this.effect.display();
        if(frameCount % 2 == 0){
            //image(this.parent.getFrame(this.parent.currentFrameIdx), shiftx, shifty, width, height);
            //filter(ERODE);
        }
        else{
            //image(this.parent.getFrame(this.parent.currentFrameIdx), shiftx, shifty, width, height);
        }
    }
}

/*
function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
        callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}
  
toDataURL('http://gibaster.zapto.org:8089/curlr.php', function(dataUrl) {
    console.log('RESULT:', dataUrl)
})*/

var myfont;

function preload() {
    background_image = loadImage('static/background_image.jpg')
    ulazak_gif = loadImage("static/1_white_ulazak.gif");
    kruzenje_gif = loadImage("static/2_white_kruzenje.gif");
    akt1_gif = loadImage("static/3_white_aktivacija_prva.gif");
    akt2_gif = loadImage("static/4_white_aktivacija_druga.gif");
    akt3_gif = loadImage("static/5_white_aktivacija_treca.gif");
    akt4_gif = loadImage("static/6_white_aktivacija_cetvrta.gif");
    idle1_gif = loadImage("static/idle_11.gif");
    idle2_gif = loadImage("static/idle_34.gif");
    idle3_gif = loadImage("static/idle_46.gif");
    idle4_gif = loadImage("static/idle_62.gif");
    myfont = loadFont("static/CourierPrime-Regular.ttf");
    //myfont = loadFont("static/VT323-Regular.ttf");
    //myfont = loadFont("static/CutiveMono-Regular.ttf");
}


var shiftx = 2;
var shifty = 10;
var outters;
var pwidth;
var pheight;

function setup() {
    canvas = createCanvas(905, 500);

    // canvas.drawingContext.globalCompositeOperation = 'multiply';

    canvas.parent("drawingContainer");

    var par = select("#mcam");
    //canvas.style('z-index', 1000);
    pwidth = par.size()["width"]
    pheight = par.size()["height"]

    if(windowWidth < windowHeight){
        om = 1.0*pwidth/pheight;
        pwidth = windowWidth;
        pheight = round(pwidth/om);
        canvas.resize(pwidth, pheight);
        console.log(par.size())
        select("#drawingContainer").size(pwidth, pheight)
        select("#mcam").size(pwidth, pheight)
        console.log(par.size())

    }

    select("#drawingContainer").size(pwidth, pheight)
    select("#mcam").size(pwidth, pheight)
    shiftx = round(shiftx * pwidth/905.);
    shifty = round(shifty * pwidth/905.);

    sca = pwidth/905.;

    resizeCanvas(pwidth, pheight);
    //background_image.resize(pwidth, pheight);

    rectMode(CENTER);
    
    ulazak = new Akt(ulazak_gif);
    kruzenje = new Akt(kruzenje_gif);
    akt1 = new Akt(akt1_gif);
    akt2 = new Akt(akt2_gif);
    akt3 = new Akt(akt3_gif);
    akt4 = new Akt(akt4_gif);
    idle1 = new Akt(idle1_gif);
    idle2 = new Akt(idle2_gif);
    idle3 = new Akt(idle3_gif);
    idle4 = new Akt(idle4_gif);

    var pts1 = [0.3769, 0.5426, 0.4620, 0.6006, 0.3946, 0.9100, 0.1913, 0.6786];
    var pts2 = [0.6175, 0.5578, 0.6573, 0.4758, 0.8385, 0.5078, 0.7844, 0.7558];
    var pts3 = [0.5624, 0.2338, 0.7171, 0.2998, 0.6121, 0.3678, 0.5414, 0.3338];
    var pts4 = [0.2262, 0.3977, 0.3565, 0.2737, 0.4228, 0.3557, 0.3698, 0.4157];

    outters =  [[0.7106814*pwidth, 0.2986666*pheight],
                [0.5692449*pwidth, 0.2366666*pheight],
                [0.5438305*pwidth, 0.2326666*pheight],
                [0.3758747*pwidth, 0.2606666*pheight],
                [0.3493554*pwidth, 0.2766666*pheight],
                [0.2300184*pwidth, 0.3946666*pheight],
                [0.2255985*pwidth, 0.4166666*pheight],
                [0.1979742*pwidth, 0.6346666*pheight],
                [0.1957642*pwidth, 0.6846666*pheight],
                [0.3836095*pwidth, 0.8906666*pheight],
                [0.4388582*pwidth, 0.8886666*pheight],
                [0.7780847*pwidth, 0.7746666*pheight],
                [0.7869244*pwidth, 0.7466666*pheight],
                [0.8373112*pwidth, 0.5166666*pheight],
                [0.8141068*pwidth, 0.4806666*pheight],
                [0.7234990*pwidth, 0.3166666*pheight]];

    outters =  [[0.567876*pwidth, 0.235714*pheight],
                [0.710418*pwidth, 0.299714*pheight],
                [0.712628*pwidth, 0.329714*pheight],
                [0.793291*pwidth, 0.473714*pheight],
                [0.833070*pwidth, 0.519714*pheight],
                [0.785556*pwidth, 0.735714*pheight],
                [0.719258*pwidth, 0.737714*pheight],
                [0.451854*pwidth, 0.829714*pheight],
                [0.382241*pwidth, 0.881714*pheight],
                [0.199921*pwidth, 0.681714*pheight],
                [0.222020*pwidth, 0.615714*pheight],
                [0.244119*pwidth, 0.425714*pheight],
                [0.234175*pwidth, 0.391714*pheight],
                [0.350197*pwidth, 0.279714*pheight],
                [0.392186*pwidth, 0.281714*pheight],
                [0.535832*pwidth, 0.253714*pheight]];

 
    pro1 = new Pro(idle1, new Rug(0, pts3, 60, 0.026, 1));
    pro2 = new Pro(idle2, new DotMess(1, pts2, 60));
    pro3 = new Pro(idle3, new Rug(2, pts1, 60, 0.02, 0));
    pro4 = new Pro(idle4, new DotMess(3, pts4, 60));

    frameRate(10);

    akt = ulazak;

    ulazak.setNextAkt(kruzenje);
    akt1.setNextAkt(kruzenje);
    akt2.setNextAkt(kruzenje);
    akt3.setNextAkt(kruzenje);
    akt4.setNextAkt(kruzenje);
    pro1.setNextAkt(kruzenje);
    pro2.setNextAkt(kruzenje);
    pro3.setNextAkt(kruzenje);
    pro4.setNextAkt(kruzenje);
    console.log("STARTED");
    
    // let loading_anim = select("#loading");
    // loading_anim.hide();
    // select("#mcam").style('opacity', 1.0);
    //select("#loading").style('opacity', 0.0);
    // fadeOutEffect();
    textSize(26*pheight/500.);
    textAlign(RIGHT, TOP);
    textFont(myfont);
}

function draw() {

    clear();
    noStroke();
    fill(0);
    image(background_image, 0, 0, pwidth, pheight);
    
    translate(shiftx, shifty);

    blendMode(BLEND);
    var dday = day();
    var mmonth = month();
    var yyear = year();
    var hhour = hour();
    var mminute = minute();
    var ssecond = second();

    var text_label = String(day()).padStart(2, '0') + "/"
    + String(month()).padStart(2, '0') + "/"
    + String(year()) + " "
    + String(hour()).padStart(2, '0') + ":"
    + String(minute()).padStart(2, '0') + ":"
    + String(second()).padStart(2, '0');

    fill(180);
    noStroke();
    text(text_label,width-shiftx-6,-shifty+6);

    blendMode(MULTIPLY);
    if(akt.currentFrameIdx == akt.numFrames && akt !== kruzenje){
        akt = akt.getNextAkt();
    }

    if(akt === kruzenje && (akt.previous === kruzenje || akt.previous === ulazak) && akt.currentFrameIdx == 0 && clicked){
        akt = akt1;
        akt.currentFrameIdx = 0;
        clicked = false;
    }

    if(akt === kruzenje && (akt.previous === kruzenje || akt.previous === ulazak) && akt.currentFrameIdx == 25 && clicked){
        akt = akt2;
        akt.currentFrameIdx = 0;
        clicked = false;
    }
    
    if(akt === kruzenje && (akt.previous === kruzenje || akt.previous === ulazak) && akt.currentFrameIdx == 41 && clicked){
        akt = akt3;
        akt.currentFrameIdx = 0;
        clicked = false;
    }
    
    if(akt === kruzenje && (akt.previous === kruzenje || akt.previous === ulazak) && akt.currentFrameIdx == 52 && clicked){
        akt = akt4;
        akt.currentFrameIdx = 0;
        clicked = false;
    }

    if(akt === kruzenje && (akt.previous === kruzenje || akt.previous === ulazak) && akt.currentFrameIdx == 10 && clicked){
        pro1.parent = akt;
        //pro1.parent.currentFrameIdx = (pro1.parent.currentFrameIdx + pro1.parent.numFrames - 1)%pro1.parent.numFrames;
        akt = pro1;
        akt.currentFrameIdx = 0;
        akt.effect.age = 0;
        clicked = false;
    }
    if(akt === kruzenje && (akt.previous === kruzenje || akt.previous === ulazak) && akt.currentFrameIdx == 33 && clicked){
        pro2.parent = akt;
        //pro2.parent.currentFrameIdx = (pro2.parent.currentFrameIdx + pro2.parent.numFrames - 1)%pro2.parent.numFrames;
        akt = pro2;
        akt.currentFrameIdx = 0;
        akt.effect.age = 0;
        clicked = false;
    }
    if(akt === kruzenje && (akt.previous === kruzenje || akt.previous === ulazak) && akt.currentFrameIdx == 45 && clicked){
        pro3.parent = akt;
        //pro3.parent.currentFrameIdx = (pro3.parent.currentFrameIdx + pro3.parent.numFrames - 1)%pro3.parent.numFrames;
        akt = pro3;
        akt.currentFrameIdx = 0;
        akt.effect.age = 0;
        clicked = false;
    }
    if(akt === kruzenje && (akt.previous === kruzenje || akt.previous === ulazak) && akt.currentFrameIdx == 61 && clicked){
        pro4.parent = akt;
        //pro4.parent.currentFrameIdx = (pro4.parent.currentFrameIdx + pro4.parent.numFrames - 1)%pro4.parent.numFrames;
        akt = pro4;
        akt.currentFrameIdx = 0;
        akt.effect.age = 0;
        clicked = false;
    }

    if(akt !== pro1 && akt !== pro2 && akt !== pro3 && akt !== pro4){
        var ss1 = Math.round(2*Math.sin(frameCount*0.1));
        var ss2 = Math.round(-1-1*Math.sin(frameCount*0.1));
        image(akt.advance(), 0, 0, width, height);
        if(random() < -0.5)
            filter(INVERT);
    }
    else{
        if(akt === pro1 || akt === pro2){
            blendMode(BLEND);
            akt.advance();
            blendMode(MULTIPLY);
            image(akt.idle.advance(), 0, 0, width, height);
        }
        else{
            blendMode(MULTIPLY);
            image(akt.idle.advance(), 0, 0, width, height);
            blendMode(BLEND);
            akt.advance();
        }
        tint(255, 255);
    }

    print(round(frameRate()));
}

function power(p, g) {
    if (p < 0.5)
        return 0.5 * pow(2*p, g);
    else
        return 1 - 0.5 * pow(2*(1 - p), g);
}

function keyPressed() {
    if (keyCode == 49){
        anim_ind = 0;
        playing = true;
    }
    if (keyCode == 50){
        anim_ind = 1;
        playing = true;
    }
    if (keyCode == 51) {
        anim_ind = 2;
        playing = true;
    }
    if (keyCode == 52) {
        anim_ind = 3;
        playing = true;
    }
    if (keyCode == 48) {
        ghost = !ghost;
    }
}

function mouseClicked() {
    clicked = true;
    print(1.*mouseX/width, 1.*mouseY/height);
}

function touchStarted() {
    clicked = true;
}


class Rug {
    constructor(idx, pts, duration, detail, direction) {
        this.age = 0;
        this.displayFlag = false;
        this.duration = duration;
        this.pts = pts;
        this.b = 0;
        this.direction = direction;
        this.idx = idx;

        var x0 = this.pts[0] * pwidth;
        var y0 = this.pts[1] * pheight;
        var x1 = this.pts[2] * pwidth;
        var y1 = this.pts[3] * pheight;
        var x2 = this.pts[4] * pwidth;
        var y2 = this.pts[5] * pheight;
        var x3 = this.pts[6] * pwidth;
        var y3 = this.pts[7] * pheight;

        this.points = []
        var bgw = background_image.width;
        var bgh = background_image.height;
        for(var y = 0; y <= 1.0; y += detail){
            for(var x = 0; x <= 1.0; x += detail){
                var px = x;
                var py = y;

                var xx1 = lerp(x0, x1, px);
                var yy1 = lerp(y0, y1, px);
                var xx2 = lerp(x3, x2, px);
                var yy2 = lerp(y3, y2, px);

                var xx = lerp(xx1, xx2, py);
                var yy = lerp(yy1, yy2, py);
                
                var col = background_image.get(Math.round(xx*bgw/pwidth), Math.round(yy*bgh/pheight));

                this.points.push([xx, yy, col, px, py]);
            }
        }
    }

    display() {

        this.age += 1;

        resetMatrix();
        //scale(sca);

        if(this.age < 0)
            return;
        
        //translate(width/2, height/2);
        var fac = 1;
        if (this.age-1 <= effect_trans)
            fac = (this.age-1) / effect_trans;
        if (this.age-1 > this.duration-effect_trans)
            fac = 1 - ((this.age-1) - (this.duration - effect_trans)) / effect_trans;
      
        noStroke();
        for(var k = 0; k < this.points.length; k++){
            var x = this.points[k][0];
            var y = this.points[k][1];
            var col = this.points[k][2];
            var px = this.points[k][3];
            var py = this.points[k][4];

            var thr = 0.7;
            var fadex = abs(px-0.5)/0.5;
            if(fadex > thr)
                fadex = (fadex-thr)/(1-thr);
            else
                fadex = 0;
            fadex = 1 - fadex;
            var fadey = abs(py-0.5)/0.5;
            if(fadey > thr)
                fadey = (fadey-thr)/(1-thr);
            else
                fadey = 0;
            fadey = 1 - fadey;
            var fade = pow(fadex * fadey, 3);

            var rr = red(col)*0.6;
            var gg = green(col)*0.6;
            var bb = blue(col)*0.6;
            var aa = alpha(col)*fade*0.4;
            fill(rr, gg, bb, aa*fac);
            var rx = 0*random(-2,2);
            var ry = 0*random(-2,2) - 1.0*k/this.points.length*50*random(fac);
            ry = py*fac*(25 + 25*cos(2*3.14*py*py+2*px-1+(0.5+(1-py)*0.5)*this.age*0.48));
            ry = py*fac*(25 + 25*cos((0.5+(1-px)*0.5)*this.age*0.48));
            fill(30, 200*fac);
            ellipse(x+rx, y, 5*sca, 5*sca);
        }
        
        noStroke();
        for(var k = 0; k < this.points.length; k++){
            var x = this.points[k][0];
            var y = this.points[k][1];
            var col = this.points[k][2];
            var px = this.points[k][3];
            var py = this.points[k][4];
            var rr = red(col);
            var gg = green(col);
            var bb = blue(col);
            var aa = alpha(col);
            fill(rr, gg, bb, aa*fac);
            var rx = 0*random(-2,2);
            var ry = 0*random(-2,2) - 1.0*k/this.points.length*50*random(fac);
            var time = map(this.age, 0, this.duration-1, 0, 1);
            time = 8*(1 - abs(time-0.5)/0.5);
            if(this.direction == 0){
                ry = (0.1+0.9*py)*fac*(25 + 25*cos((0.5+(1-px)*0.5)*time));
                ry = (0.1+0.9*py)*fac*(25 + 25*sin((0.5+px*0.5)*5 + this.age*0.48));
            }
            else{
                ry = (0.1+0.9*py)*fac*(25 + 25*cos((0.5+(1-py)*0.5)*time));
                ry = (0.1+0.9*py)*fac*(25 + 25*sin((0.5+py*0.5)*5 + this.age*0.48));
            }
            var nz = noise(px*1,py*1,this.idx+this.age*0.2);
            ry += fac*35*nz;
            ellipse(x+rx, y-sca*ry, 5*sca, 5*sca);
        }

    }
}

class DotMess {
    constructor(idx, pts, duration) {
        this.age = 0;
        this.displayFlag = false;
        this.duration = duration;
        this.pts = pts;
        this.b = 0;

        this.x0 = this.pts[0] * width;
        this.y0 = this.pts[1] * height;
        this.x1 = this.pts[2] * width;
        this.y1 = this.pts[3] * height;
        this.x2 = this.pts[4] * width;
        this.y2 = this.pts[5] * height;
        this.x3 = this.pts[6] * width;
        this.y3 = this.pts[7] * height;
    }

    display() {

        this.age += 1;

        noStroke();
        resetMatrix();
        //scale(sca);

        if(this.age < 0)
            return;
        
        var fac = 1;
        if (this.age-1 <= effect_trans)
            fac = (this.age-1) / effect_trans;
        if (this.age-1 > this.duration-effect_trans)
            fac = 1 - ((this.age-1) - (this.duration - effect_trans)) / effect_trans;
        
        fill(0);
        noStroke();
        stroke(0);
        noFill();
        strokeWeight(1.4);
        for(var k = 0; k < 130; k++){
            var px = random(1);
            var py = 2;

            var xx1 = lerp(this.x0, this.x1, px);
            var yy1 = lerp(this.y0, this.y1, px);
            var xx2 = lerp(this.x3, this.x2, px);
            var yy2 = lerp(this.y3, this.y2, px);

            var xx = lerp(xx1, xx2, py);
            var yy = lerp(yy1, yy2, py);

            var rr = fac * random(3, 5);
            //ellipse(xx, yy, rr, rr);

            //stroke(0, fac*random(255));
            //line(xx1,yy1,xx2,yy2);
        }
        
        noStroke();
        for(var k = 0; k < 3; k++){
            var seq = (3-k)/3.;
            var pt1 = ((this.age+outters.length-k)*2)%outters.length;
            var pt2 = (pt1+1)%outters.length;
            var x1 = outters[outters.length-1-pt1][0];
            var y1 = outters[outters.length-1-pt1][1];
            var x2 = outters[outters.length-1-pt2][0];
            var y2 = outters[outters.length-1-pt2][1];
            var d1 = dist(x1,y1,width/2,height/2);
            var d2 = dist(x1,y1,width/2,height/2);
            var dx1 = (x1 - width/2)/d1;
            var dy1 = (y1 - height/2)/d1;
            var dx2 = (x2 - width/2)/d2;
            var dy2 = (y2 - height/2)/d2;

            var y11 = y1 - sca*random(24, 80)*fac*seq;
            var y22 = y2 - sca*random(24, 80)*fac*seq;

            for(var ww = 0; ww < 4; ww++){
                fill(0, random(50, 160)*fac);
                noStroke();
                beginShape();
                vertex(x1, y1);
                vertex(x1+sca*random(-20, 20), y11+sca*random(-20, 6));
                vertex(x2+sca*random(-20, 20), y22+sca*random(-20, 6));
                vertex(x2, y2);
                endShape();
            }
            //line(x1, y11, x1+5*dx1, y11+5*dy1);
            //line(x2, y22, x2+5*dx2, y22+5*dy2);

            stroke(0, 255*fac);
            for(var qq = 0; qq < 20; qq++){
                var xx1 = x1 + 2*random(-1,1);
                var yy1 = y1 - 10*random(-0,1);
                var xx2 = xx1 + 2*random(-1,1);
                var yy2 = yy1 - 10*random(-0,1);
                //line(xx1, yy1, xx2, yy2);
            }
        }
    }
}
