var canvas;
var anims = [];

var anim_ind = 0;
var frameIdx = 0;

function loadAnimation(path, ind1, ind2) {
    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    var paths = [];
    for(var k = ind1; k <= ind2; k++){
        var npath = path + String(pad(k, 4)) + ".png";
        paths.push(npath);
    }

    var frames = [];
    paths.forEach(path => frames.push(loadImage(path)));

    return frames
}

function preload() {
    anims.push(loadAnimation("data/demo_frames/", 1, 19));
}

function setup() {
    canvas = createCanvas(800, 500);
    canvas.parent("container");

    var par = select("#mcam");
    var pwidth = par.size()["width"]
    var pheight = par.size()["height"]

    resizeCanvas(pwidth, pheight);

    imageMode(CENTER);
    frameRate(14);
}

function draw() {
    clear();
    image(anims[anim_ind][frameIdx], width*0.5, height*0.6, width*0.6, height*0.6);

    frameIdx = frameIdx + 1;
    if (frameIdx >= anims[anim_ind].length){
        frameIdx = 0;
    }

    noStroke();
    textSize(20);
    textFont("Helvetica");
    textAlign(CENTER);
    var txt = "generirana animacija";
    for(var k = 0; k < txt.length; k++){
        var ch = txt.charAt(k);
        if(random(1) < 0.1){
            ch = Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 1);
            fill(255);
            ellipse(width - 400 + k * 20, height - 25 + random(-4, 4), 5, 5);
        }
        stroke(255);
        line(width - 400 + k*20, height - 25 + random(-4, 4), width - 400 + k*20, height - 5);
        noStroke();
        fill(random(200, 255));
        text(ch, width - 400 + k*20, height - 36 + random(-4, 4));
        var iters = round(random(3, 8));
        fill(255);
        for(var w = 0; w < iters; w++){
            ellipse(width - 400 + k * 20 + random(-8, 8), height - 65 + random(-8, 8), 3, 3);
        }
    }
}

function windowResized(){
    var par = select("#mcam");
    var pwidth = par.size()["width"]
    var pheight = par.size()["height"]
    resizeCanvas(pwidth, pheight);
}