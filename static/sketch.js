
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
        //frameBuffer.push(this.frames[idx]);
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
    constructor(idle, particles) {
        this.numFrames = 14*4;
        this.currentFrameIdx = 0;
        // this.currentFrame = this.frames[this.currentFrameIdx];
        this.nextAkt = this;
        this.particles = particles;
        this.particle_ind = 0*floor(random(0, 4));
        this.idle = idle;
        this.numFrames = this.particles[this.particle_ind].lifespan;
    }

    setNextAkt(nextAkt){
        this.nextAkt = nextAkt;
    }
    
    getNextAkt(){
        if(this.nextAkt !== kruzenje)
            this.nextAkt.currentFrameIdx = 0;
        this.nextAkt.previous = this;
        this.particle_ind = 0*floor(random(0, 4));
        this.numFrames = this.particles[0].lifespan;
        return this.nextAkt;
    }

    advance(){
        this.previous = this;
        var idx = this.currentFrameIdx;
        this.currentFrameIdx++;
        if(this.currentFrameIdx == this.numFrames && this === kruzenje)
            this.currentFrameIdx = 0;
        //this.particles[this.particle_ind].display(24);
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
}


var shiftx = 2;
var shifty = 10;

function setup() {
    canvas = createCanvas(905, 500);

    // canvas.drawingContext.globalCompositeOperation = 'multiply';

    canvas.parent("drawingContainer");

    var par = select("#mcam");
    //canvas.style('z-index', 1000);
    var pwidth = par.size()["width"]
    var pheight = par.size()["height"]

    if(windowWidth < windowHeight){
        om = 1.0*pwidth/pheight;
        pwidth = windowWidth;
        pheight = round(pwidth/om);
        console.log(par.size())
        select("#drawingContainer").size(pwidth, pheight)
        select("#mcam").size(pwidth, pheight)
        console.log(par.size())

    }

    select("#drawingContainer").size(pwidth, pheight)
    select("#mcam").size(pwidth, pheight)
    shiftx = round(shiftx * pwidth/905.);
    shifty = round(shifty * pwidth/905.);

    resizeCanvas(pwidth, pheight);
    background_image.resize(pwidth, pheight);

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

    var pts0 = [0.36842105, 0.42207792, 0.37200957, 0.50865801, 0.22966507, 0.60606061, 0.25239234, 0.4025974];
    var pts1 = [0.67344498, 0.42640693, 0.64712919, 0.35714286, 0.7284689, 0.3030303, 0.81220096, 0.45454545];
    var pts2 = [0.51076555, 0.59307359, 0.6076555, 0.57142857, 0.73564593, 0.72943723, 0.46889952, 0.82467532];
    var pts3 = [0.53110048, 0.30952381, 0.45574163, 0.32467532, 0.4007177, 0.25541126, 0.55023923, 0.23160173];
    
    // particles.push(new Particle(0, pts0));
    // particles.push(new Particle(1, pts1));
    // particles.push(new Particle(2, pts2));
    // particles.push(new Particle(3, pts3));

    pro1 = new Pro(idle1, [new Particle(0, pts0)]);
    pro2 = new Pro(idle2, [new Particle(1, pts1)]);
    pro3 = new Pro(idle3, [new Particle(2, pts2)]);
    pro4 = new Pro(idle4, [new Particle(3, pts3)]);

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
    select("#mcam").style('opacity', 1.0);
    //select("#loading").style('opacity', 0.0);
    // fadeOutEffect();
}

function draw() {

    clear();
    noStroke();
    fill(0);

    
    blendMode(MULTIPLY);
    image(background_image, 0, 0, width, height);

    translate(shiftx, shifty);

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
        clicked = false;
        for (var k = 0; k < akt.particles.length; k++) {
            akt.particles[k].displayFlag = true;
            akt.particles[k].age = round(random(-20, 0));
        }
        akt.numFrames = 20; // ovaj 100 mora bit varijabla za svaku proceduralnu animaciju
    }
    if(akt === kruzenje && (akt.previous === kruzenje || akt.previous === ulazak) && akt.currentFrameIdx == 33 && clicked){
        pro2.parent = akt;
        //pro2.parent.currentFrameIdx = (pro2.parent.currentFrameIdx + pro2.parent.numFrames - 1)%pro2.parent.numFrames;
        akt = pro2;
        akt.currentFrameIdx = 0;
        clicked = false;
        for (var k = 0; k < akt.particles.length; k++) {
            akt.particles[k].displayFlag = true;
            akt.particles[k].age = round(random(-20, 0));
        }
        akt.numFrames = 20; // ovaj 100 mora bit varijabla za svaku proceduralnu animaciju
    }
    if(akt === kruzenje && (akt.previous === kruzenje || akt.previous === ulazak) && akt.currentFrameIdx == 45 && clicked){
        pro3.parent = akt;
        //pro3.parent.currentFrameIdx = (pro3.parent.currentFrameIdx + pro3.parent.numFrames - 1)%pro3.parent.numFrames;
        akt = pro3;
        akt.currentFrameIdx = 0;
        clicked = false;
        for (var k = 0; k < akt.particles.length; k++) {
            akt.particles[k].displayFlag = true;
            akt.particles[k].age = round(random(-20, 0));
        }
        akt.numFrames = 20; // ovaj 100 mora bit varijabla za svaku proceduralnu animaciju
    }
    if(akt === kruzenje && (akt.previous === kruzenje || akt.previous === ulazak) && akt.currentFrameIdx == 61 && clicked){
        pro4.parent = akt;
        //pro4.parent.currentFrameIdx = (pro4.parent.currentFrameIdx + pro4.parent.numFrames - 1)%pro4.parent.numFrames;
        akt = pro4;
        akt.currentFrameIdx = 0;
        clicked = false;
        for (var k = 0; k < akt.particles.length; k++) {
            akt.particles[k].displayFlag = true;
            akt.particles[k].age = round(random(-20, 0));
        }
        akt.numFrames = 20; // ovaj 100 mora bit varijabla za svaku proceduralnu animaciju
    }

    if(akt !== pro1 && akt !== pro2 && akt !== pro3 && akt !== pro4){
        var ss1 = Math.round(2*Math.sin(frameCount*0.1));
        var ss2 = Math.round(-1-1*Math.sin(frameCount*0.1));
        //image(akt.getFrame((akt.currentFrameIdx+akt.numFrames-ss2)%akt.numFrames), 0, 0, width, height);
        /*if(frameBuffer.length == bufferSize){
            tint(255, 180 + 0*(0.5 + 0.5*sin(frameCount*0.2)));
            image(frameBuffer[bufferSize-2], 0, 0, width, height);
            tint(255, 100 + 0*(0.5 + 0.5*sin(frameCount*0.2)));
            image(frameBuffer[bufferSize-3], 0, 0, width, height);
        }*/
        if(frameBuffer.length == bufferSize && ghost == true && false){
            tint(255, 100, 200, random(50, 220) + 0*(0.5 + 0.5*sin(frameCount*0.2)));
            image(frameBuffer[bufferSize-1], 0, 0, width, height);
            if(random() < -0.5)
                filter(INVERT);
            tint(255, 200, 100, random(50, 220) + 0*(0.5 + 0.5*sin(frameCount*0.2)));
            image(frameBuffer[bufferSize-2], 0, 0, width, height);
            if(random() < -0.5)
                filter(INVERT);
            //filter(BLUR, 1);
        }
        //tint(255, 255);
        image(akt.advance(), 0, 0, width, height);
        if(random() < -0.5)
            filter(INVERT);
    }
    else{
        blendMode(BLEND);
        akt.advance();
        //blendMode(MULTIPLY);
        image(akt.idle.advance(), 0, 0, width, height);
        if(frameBuffer.length == bufferSize && (ghost == true || true) && false){
            tint(255, 100, 200, random(50, 220) + 0*(0.5 + 0.5*sin(frameCount*0.2)));
            image(frameBuffer[bufferSize-1], 0, 0, width, height);
            if(random() < -0.5)
                filter(INVERT);
            tint(255, 200, 100, random(50, 220) + 0*(0.5 + 0.5*sin(frameCount*0.2)));
            image(frameBuffer[bufferSize-2], 0, 0, width, height);
            if(random() < -0.5)
                filter(INVERT);
            //filter(BLUR, 1);
        }
        tint(255, 255);
    }

    /*
    if (playing || frameIdx != 0){
        image(anims[anim_ind][frameIdx], -width/2*0, -height/2*0, width, height);
        frameIdx = frameIdx + 1;
        if (frameIdx >= anims[anim_ind].length){
            playing = false;
            frameIdx = 0;
        }
    }

    for(var k = 0; k < particles.length*0+1; k++){
        var gridnum = 30;
        if(k == 2)
            gridnum = 18;
        particles[2].display(gridnum);
    }*/

    //rotate(radians(+12));
    //applyMatrix(1, 0, shear_factor, 1, 0, 0);
    /*clear();
    particle.display(pg);

    scale(0.5);

    translate(-width/2, -height/2);
    texture(pg);
    beginShape();
    vertex(473., 44., 0, 0);
    vertex(762., 98., 1, 0);
    vertex(611., 508., 1, 1);
    vertex(85., 258., 0, 1);
    endShape();*/

    print(round(frameRate()))
    if(ttime == "NIGHT"){
        //filter(INVERT);
    }
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

    /*if(keyCode == 32){
        playing = !playing;
    }
    else{
        changeAnim = true;
    }*/
}

function mouseClicked() {
    clicked = true;
    //for (var k = 0; k < particles.length; k++) {
    //    particles[k].displayFlag = true;
    //    particles[k].age = round(random(-20, 0));
    //}

    print(mouseX, mouseY);
}

function touchStarted() {
    clicked = true;
}


class Particle {
    constructor(idx, pts) {
        this.age = round(random(-20, 0));
        this.displayFlag = false;
        this.lifespan = round(random(80, 100));
        this.pts = pts;
        this.b = 0;

        var x0 = this.pts[0] * width;
        var y0 = this.pts[1] * height;
        var x1 = this.pts[2] * width;
        var y1 = this.pts[3] * height;
        var x2 = this.pts[4] * width;
        var y2 = this.pts[5] * height;
        var x3 = this.pts[6] * width;
        var y3 = this.pts[7] * height;

        this.points = []
        for(var y = 0; y <= 1.0; y += 0.02){
            for(var x = 0; x <= 1.0; x += 0.02){
                var px = x;
                var py = y;

                var xx1 = lerp(x0, x1, px);
                var yy1 = lerp(y0, y1, px);
                var xx2 = lerp(x3, x2, px);
                var yy2 = lerp(y3, y2, px);

                var xx = lerp(xx1, xx2, py);
                var yy = lerp(yy1, yy2, py);
                
                var col = background_image.get(Math.round(xx), Math.round(yy));

                this.points.push([xx, yy, col, px, py]);
            }
        }
    }

    display(gridnum) {

        gridnum = gridnum*2;
        this.age += 1;

        noStroke();
        resetMatrix();

        if(this.age < 0)
            return;
        
        //translate(width/2, height/2);
        var fac = 1;
        if (this.age-1 <= 10)
            fac = (this.age-1) / 10;
        if (this.age-1 > this.lifespan-10)
            fac = 1 - ((this.age-1) - (this.lifespan - 10)) / 10;
        
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
            ry = py*fac*(25 + 25*cos(2*3.14*py*py+2*px-1+(0.5+(1-py)*0.5)*frameCount*0.3));
            ellipse(x+rx, y-ry, 5, 5);
        }
    }
}
