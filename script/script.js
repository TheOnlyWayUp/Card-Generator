let card = document.getElementById('card');
let ctx = card.getContext('2d');

let gen = document.getElementById('gen');
let link = document.getElementById("link");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let linkData = urlParams.get('data');

if (linkData == null) {
    linkData = '0;0;0;0;0;0-0;0;0;0;0;0-0;0;0;0;0;0-0;0;0;0;0;0-0;0;0;0;0;0-0;0;0;0;0;0-0;0;0;0;0;0-0;0;0;0;0;0-0;0;0;0;0;0';
} else {
    alert("Link already generated. Copy the link to share!");
}

const rect = card.getBoundingClientRect();
let cardPos = {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY
};

const size = 35;

// 0: Red, 1: Green, 2: Blue
let originalColors = [
    [255, 0, 0],   // red
    [255, 125, 0], // orange
    [255, 255, 0], // yellow
    [125, 255, 0], // emerald
    [0, 255, 0],   // green
    [0, 255, 125], // turquoise
    [0, 255, 255], // cyan
    [0, 125, 255], // azure
    [0, 0, 255],   // blue
    [125, 0, 255], // violet
    [255, 0, 255], // magenta
    [255, 0, 125]  // pink
];

// ORDERS:
// [0] white, [1] black, [2] red, [3] orange, [4] yellow, [5] emerald, [6] green, 
// [7] turquoise, [8] cyan, [9] azure, [10] blue, [11] violet, [12] magenta, [13] pink
let colors = [
    "rgb(255, 255, 255)",
    "rgb(0, 0, 0)"
];

let data = [];

function colorGen(desat){
    for (let i = 0; i < originalColors.length; i++) {
        const col = originalColors[i];

        const r = col[0];
        const g = col[1];
        const b = col[2];
    
        const L = 0.3*r + 0.6*g + 0.1*b;

        let new_r = r + desat * (L - r);
        let new_g = g + desat * (L - g);
        let new_b = b + desat * (L - b);
    
        colors.push(`rgb(${new_r}, ${new_g}, ${new_b})`);
    }
}

function cardGen(width, height){
    linkDataDecode = decode(linkData);
    for (let i = 0; i < height; i++) {
        let dr = []
        for (let j = 0; j < width; j++) {
            dr.push(linkDataDecode[i][j]);
        }
        data.push(dr);
    }
}

function drawRectangle(color, x, y, width, height) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function update(){
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            drawRectangle(colors[data[i][j]], j*size, i*size, size, size);
        }
    }
}

function draw(event) {
    let pos = {
        x: Math.floor((event.clientX - cardPos.x) / size),
        y: Math.floor((event.clientY - cardPos.y) / size)
    };

    var e = document.getElementById("color");
    var sel = e.value;

    data[pos.y][pos.x] = parseInt(sel);
    update();
}

function encode() {
    let output = "";

    let d = []
    for (let i = 0; i < data.length; i++) {
        d.push(data[i].join(";"));
    }
    output = d.join("-");
    return output;
}

function decode(input) {
    let target = input;
    let output = [];

    output = target.split("-");

    for (let i = 0; i < output.length; i++) {
        output[i] = output[i].split(";");
    }

    return output;
}

colorGen(0.5);
cardGen(card.width / size, card.height / size);
update();

card.addEventListener("mousedown", function(event) {
    draw(event);
});

gen.addEventListener("click", function() {
    window.location.href = "?data=" + encode();
});