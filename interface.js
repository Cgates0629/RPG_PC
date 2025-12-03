let myfilesopen = false;
let webopen = false;
let phoneopen = false;
let user;
let indexU = -1;
fetch("./testfile.json")
  .then(res => res.json())
  .then(data => setdata(data))
function setdata(data){
 saveddata = data;
}
function playAudio(audio){
  var x = document.getElementById(audio)
  x.play();
}
function openfiles(){
    if(document.getElementById("mydiv")){return;}
  const thewindow = document.getElementById("Lbar");
  const newDiv = document.createElement("div");
  newDiv.innerHTML = '<div id="mydiv" class="Mwindow"> <div id="mydivheader" class="title-bar"> <div class="wtext"><img src="mypc.png"> My Computer</div><div class="title-bar-controls"> <button class="Close" id="close" style="position: static; left: 4%; top: 7%;" onclick="windowclose('+"'mydiv'"+')">X</button></div></div><div style="align-items: center; display: flex; gap: 25px; flex-wrap: wrap;" id="cont"></div>';
  document.body.insertBefore(newDiv, thewindow);
  dragElement(document.getElementById("mydiv"));
  fetch("./testfile.json")
  .then(res => res.json())
  .then(data => showData(data))
  myfilesopen = true;
  function showData(data){
    const files = data.files;
    files.forEach(createicon);
    function createicon(item, index){
      let allowed = false;
      checkPerm();
      if(allowed != true){ return;}
        let newfile = document.createElement("div");
        newfile.innerHTML = '<div id="icon'+data.files[index].name+'" class="evil" onclick="opentextfile('+index+')" style="width: 35px; height: 35px; font-size: smaller; text-align: center;"><img style="width: 35px; height: 35px;" src="'+data.files[index].icon+'"><div style="">' + data.files[index].name + '</div></div>';
        console.table(data.insides)
        const cont = document.getElementById("cont");
        document.body.insertBefore(newfile, thewindow); 
        newfile = document.getElementById("icon"+data.files[index].name)
        cont.appendChild(newfile);
        function checkPerm(){
          data.files[index].Perm.forEach(findIndex);
          function findIndex(item, index){
            if(item == user){
              allowed = true;
            }
          }
        }
    }
  }
}
function openweb(){
  if(document.getElementById("myweb")){return;}
  const thewindow = document.getElementById("Lbar");
  const newDiv = document.createElement("div");
  newDiv.innerHTML = '<div id="myweb" class="Mwindow"><div id="mywebheader" class="title-bar" style="height: 35px"><img style="margin-left: 1%; width: 15px; height: 15px; text-align: right;" src="theweb.png"></div><input id="sitead" value="ZaleskiCollect.com" type="text" style="width: 79%; position: absolute; left: 25; top: 10;"><div class="title-bar-controls"> <button style="position: absolute; right: 55; top: 10; height: 25px; width:45px" onclick="searchweb()">Search</button><button class="Close" id="close" onclick="windowclose('+"'myweb'"+')">X</button></div><div id="inside" class="inside"></div></div> ';
  document.body.insertBefore(newDiv, thewindow);
  dragElement(document.getElementById("myweb"));
}
function openphone(){
  if(document.getElementById("mybuttons")){return;}
  const thewindow = document.getElementById("Lbar");
  const newDiv = document.createElement("div");
  newDiv.innerHTML = '<div id="mybuttons" class="Mwindow" style="width: 250px; height: 200px; background-color: silver; top: 250px; min-height: 100px; min-width: 100px;"> <div id="mybuttonsheader" class="title-bar"><div class="wtext" style="font-size: small;"><img style="width: 25px; height: 25px;" src="telephone-icon-3614.png">E.C.T</div><div class="title-bar-controls"><button class="Close" id="close" onclick="windowclose('+"'mybuttons'"+')">X</button></div></div><div class="window-body" style="min-height: 100px; min-width: 100px;"></b> <input id="phone" value="" type="tel" style="width: 100%;" disabled><br> <br> <button onclick="dial('+"'1'"+'), playAudio('+"'1'"+')" style="width: 25px; height: 25px;">1</button><button onclick="dial('+"'2'"+'), playAudio('+"'2'"+')">2</button><button onclick="dial('+"'3'"+'), playAudio('+"'3'"+')">3</button><br> <button onclick="dial('+"'4'"+'), playAudio('+"'4'"+')">4</button><button onclick="dial('+"'5'"+'), playAudio('+"'5'"+')">5</button><button onclick="dial('+"'6'"+'), playAudio('+"'6'"+')">6</button><br> <button onclick="dial('+"'7'"+'), playAudio('+"'7'"+')">7</button><button onclick="dial('+"'8'"+'), playAudio('+"'8'"+')">8</button><button onclick="dial('+"'9'"+'), playAudio('+"'9'"+')">9</button><br> <button onclick="startcall()">&#9742;</button><button onclick="dial('+"'0'"+'), playAudio('+"'0'"+')">0</button><button onclick="dial('+"'-1'"+')">&#8617;</button> <div id="audios"></div> </div> </div>';
  document.body.insertBefore(newDiv, thewindow);
  dragElement(document.getElementById("mybuttons"));
}
function searchweb(){
  const sitead = document.getElementById("sitead").value;
  let found = false;
  saveddata.Sites.forEach(findIndex);
  function findIndex(item, index){
  const JsonSitename = saveddata.Sites[index].Adress;
    if(JsonSitename == sitead){
      document.getElementById("inside").innerHTML = saveddata.Sites[index].HTML;
      found = true;
      return;
    }else if(found != true){
      document.getElementById("inside").innerHTML = saveddata.Sites[0].HTML;
    }
}
}
function login(){
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  saveddata.Users.forEach(findIndex);
  if(indexU != -1){
    if(saveddata.Users[indexU].Password == password){
      document.getElementById("homescreen").style.visibility = "visible";
      document.getElementById("loginscreen").style.visibility = "hidden";
      user = saveddata.Users[indexU].Username;
      if(user == "VizlzzpclVjjbsapza" || user == "AdminGuy2"){
          const thewindow = document.getElementById("Lbar");
          const newDiv = document.createElement("div");
          newDiv.innerHTML = '<div class="app" onclick="openphone()" style="top: 22%; text-align: center;"><img style="width: 35px; height: 35px;" src="telephone-icon-3614.png"> <div class="apptext">External Communication Tapper</div></div>';
          document.body.insertBefore(newDiv, thewindow);
      }
    }
  }
  else{playAudio('error');}
  function findIndex(item, index){
    const JsonUsername = saveddata.Users[index].Username;
    if(JsonUsername == username){
      indexU = index;
    }
    }
}
function opentextfile(textid){
  if( document.getElementById(saveddata.files[textid].name)){return;}
  console.table(saveddata.files[textid].insides);
  const thewindow = document.getElementById("Lbar");
  const newDiv = document.createElement("div");
  newDiv.innerHTML = '<div id="'+saveddata.files[textid].name+'" class="Mwindow"> <div id="'+saveddata.files[textid].name+'header" class="title-bar"><div class="wtext"><img  style="width: 25px; height: 25px;" src="'+saveddata.files[textid].icon+'">'+saveddata.files[textid].name+'</div><div class="title-bar-controls"><button class="Close" id="close" onclick="windowclose('+"'"+saveddata.files[textid].name+"'"+')">X</button></div></div><div class="window-body">'+saveddata.files[textid].insides+'</div></div>';
  document.body.insertBefore(newDiv, thewindow);
  dragElement(document.getElementById(saveddata.files[textid].name));
}
window.addEventListener('load', function() {
dragElement(document.getElementById("myFault"));
dragElement(this.document.getElementById("mybuttons"));
playAudio("startup");
});
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
function windowclose(idet){
    const element = document.getElementById(idet);
    element.remove();
}
function dial(num){
  let phonebox = document.getElementById("phone");
  let v = phonebox.value;
  if(num == -1){
    phonebox.value = v.slice(0, v.length-1);
    playAudio(num.toString());
  }
  else{
    phonebox.value += num;
  }
}
function startcall(){
  let phonebox = document.getElementById("phone");
  let found = false;
  saveddata.Numbers.forEach(findIndex);
  function findIndex(item, index){
  const JsonSitename = saveddata.Numbers[index].nu;
    if(JsonSitename == phonebox.value){
      document.getElementById("audios").innerHTML = saveddata.Numbers[index].file;
      found = true;
      return;
    }
}
}
function checkpasskey(){
  //let passkey = ;
}