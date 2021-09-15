
console.log("hello");
var canvas;
var anims = [];
var anim1;

var anim_ind = 0;
var playing = false;
var frameIdx = 0;
var changeAnim = false;

var particles = [];

var ttime = "DAY";

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function loadAnimation(path, ind1, ind2) {
    var paths = [];
    for(var k = ind1; k <= ind2; k++){
        var npath = path + String(pad(k, 4)) + ".png";
        paths.push(npath);
    }
    frames = [];
    for(var k = 0; k < paths.length; k++){
        frames.push(loadImage(paths[k]));
    }
    console.log("loaded")
    return frames
}

function preload() {
    anims.push(loadAnimation("data/anim4/", 1, 67));
    anims.push(loadAnimation("data/anim5/", 1, 24));
}

function setup() {
    canvas = createCanvas(800, 500);
    canvas.parent("drawingContainer");

    var par = select("#mcam");
    //canvas.style('z-index', 1000);
    var pwidth = par.size()["width"]
    var pheight = par.size()["height"]

    resizeCanvas(pwidth, pheight);

    rectMode(CENTER);

    var pts0 = [0.36842105, 0.42207792, 0.37200957, 0.50865801, 0.22966507, 0.60606061, 0.25239234, 0.4025974];
    var pts1 = [0.67344498, 0.42640693, 0.64712919, 0.35714286, 0.7284689, 0.3030303, 0.81220096, 0.45454545];
    var pts2 = [0.51076555, 0.59307359, 0.6076555, 0.57142857, 0.73564593, 0.72943723, 0.46889952, 0.82467532];
    var pts3 = [0.53110048, 0.30952381, 0.45574163, 0.32467532, 0.4007177, 0.25541126, 0.55023923, 0.23160173];

    particles.push(new Particle(0, pts0));
    particles.push(new Particle(1, pts1));
    particles.push(new Particle(2, pts2));
    particles.push(new Particle(3, pts3));

    frameRate(14);
}

function draw() {
    clear();
    noStroke();
    
    fill(0);
    if (playing || frameIdx != 0){
        image(anims[anim_ind][frameIdx], -width/2*0, -height/2*0, width, height);
        //console.log(anims[anim_ind][frameIdx]);
        //frameIdx = (frameIdx + 1) % anims[anim_ind].getLastFrame();
        frameIdx = frameIdx + 1;
        if (frameIdx >= anims[anim_ind].length){
            playing = false;
            frameIdx = 0;
        }
    }
    /*if(frameIdx == 0 && changeAnim){
        anim_ind = (anim_ind + 1) % anims.length;
        changeAnim = false;
    }*/

    for(var k = 0; k < particles.length*0+1; k++){
        var gridnum = 30;
        if(k == 2)
            gridnum = 18;
        particles[2].display(gridnum);
    }

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

    console.log(anim_ind);
    /*if(keyCode == 32){
        playing = !playing;
    }
    else{
        changeAnim = true;
    }*/
}

function mouseClicked() {

    for (var k = 0; k < particles.length; k++) {
        particles[k].displayFlag = true;
        particles[k].age = round(random(-20, 0));
    }

    print(mouseX, mouseY);
}


class Particle {
    constructor(idx, pts) {
        this.age = round(random(-20, 0));
        this.displayFlag = false;
        this.lifespan = round(random(80, 100));
        this.pts = pts;
    }

    display(gridnum) {
        if (!this.displayFlag)
            return;

        this.age += 1;

        if(this.age < 0)
            return;

        var x0 = this.pts[0] * width;
        var y0 = this.pts[1] * height;
        var x1 = this.pts[2] * width;
        var y1 = this.pts[3] * height;
        var x2 = this.pts[4] * width;
        var y2 = this.pts[5] * height;
        var x3 = this.pts[6] * width;
        var y3 = this.pts[7] * height;
        
        noStroke();
        resetMatrix();
        //translate(width/2, height/2);
        var fac = 1;
        if (this.age-1 <= 10)
            fac = (this.age-1) / 10;
        if (this.age-1 > this.lifespan-10)
            fac = 1 - ((this.age-1) - (this.lifespan - 10)) / 10;
        for(var y = -248; y <= +248; y += gridnum){
            for (var x =  -248; x <= +248; x += gridnum) {

                if(random(1) > pow(fac, 2))
                    continue;

                var px = map(x, -248, 248, 0, 1);
                var py = map(y, -248, 248, 0, 1);

                var xx1 = lerp(x0, x1, px);
                var yy1 = lerp(y0, y1, px);
                var xx2 = lerp(x3, x2, px);
                var yy2 = lerp(y3, y2, px);

                var xx = lerp(xx1, xx2, py);
                var yy = lerp(yy1, yy2, py);

                var sx = random(2, 3) * 1.3;
                var sy = random(2, 3) * 1.3;

                if (ttime == "DAY") {
                    fill(40);
                }
                else {
                    fill(40);
                }
                noStroke();
                //ellipse(xx + random(-1, +1), yy + random(-1, +1), sx, sy);

                if (ttime == "DAY") {
                    stroke(40, 200);
                }
                else {
                    stroke(80, 200);
                }
                strokeWeight(2);

                noFill();
                /*beginShape();
                for(var part = 0; part < fac*6; part++){
                    var vx = xx;
                    var vy = yy - 20;
                    vertex(vx+random(-1,1), vy+random(-1,1));
                }
                endShape();*/
                line(xx + random(-1, +1), yy + random(-1, +1), xx + random(-1, +1), yy + random(-1, +1)-20*fac);

            }
        }

        if(this.age >= this.lifespan){
            this.displayFlag = false;
            this.lifespan = round(random(50, 100));
        }
    }
}