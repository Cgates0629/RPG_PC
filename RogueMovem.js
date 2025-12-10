let room = [
    ["&#9487;","&#9473;","&#9473;","&#9489;"],
    ["&#9475;", "&#9617;","&#9617;","&#9475;"],
    ["&#9475;", "&#9617;","&#9617;","&#9475;"],
    ["&#9475;", "&#9617;","&#9617;","<div class='vl'></div>"],
    ["&#9495;", "<div class='hl'></div>","<div class='hl'></div>","<div class='vl'></div>"],
];

function enter(event){
  GS = document.getElementById("GameScreen");
  if(event.key=="Enter"){
    let screemess;
    room.forEach(element => {
        screemess +="<p>";
        screemess+= element.join('');
        screemess +="</p>";
    });
    document.getElementById("GameScreen").innerHTML = screemess;
    console.log(room[1].join(''));
  }}
