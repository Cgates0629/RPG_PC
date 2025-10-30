let myfilesopen = false;
let webopen = false;
let saveddata; 
let user;
let indexU = -1;
fetch("./testfile.json")
  .then(res => res.json())
  .then(data => setdata(data))
function setdata(data){
 saveddata = data;
}
function openfiles(){
  if(myfilesopen){return}
  const thewindow = document.getElementById("Lbar");
  const newDiv = document.createElement("div");
  newDiv.innerHTML = '<div id="mydiv" class="window"> <div id="mydivheader" class="handle"> <div class="wtext"><img src="mypc.png"> My Computer</div> <button class="Close" id="close" onclick="windowclose('+"'mydiv'"+')">X</button></div><div style="align-items: center; display: flex; gap: 25px;" id="cont"></div>';
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
        newfile.innerHTML = '<div id="icon'+data.files[index].name+'" class="evil" onclick="opentextfile('+index+')" style="width: 2%; height: 2%; font-size: smaller;"><img style="width: 35px; height: 35px;" src="textfileicon.png">' + data.files[index].name + '</div>';
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
  if(webopen){return}
  const thewindow = document.getElementById("Lbar");
  const newDiv = document.createElement("div");
  newDiv.innerHTML = '<div id="myweb" class="window"><div id="mywebheader" class="handle"><img style="margin-left: 1%; width: 15px; height: 15px;" src="theweb.png"></div><input id="sitead" type="text" style="width: 79%; position: absolute; left: 25; top: 10;"> <button style="position: absolute; right: 55; top: 10;" onclick="searchweb()">Search</button><button class="Close" id="close" onclick="windowclose('+"'myweb'"+')">X</button><div id="inside" style="overflow: scroll; width: 100%; height: 90%;"></div></div> ';
  document.body.insertBefore(newDiv, thewindow);
  dragElement(document.getElementById("myweb"));
}
function searchweb(){
  const sitead = document.getElementById("sitead").value;
  saveddata.Sites.forEach(findIndex);
  function findIndex(item, index){
  const JsonSitename = saveddata.Sites[index].Adress;
    if(JsonSitename == sitead){
      document.getElementById("inside").innerHTML = saveddata.Sites[index].HTML;
    }else{
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
    }
  }
  function findIndex(item, index){
    const JsonUsername = saveddata.Users[index].Username;
    if(JsonUsername == username){
      indexU = index;
    }
    }
}
function opentextfile(textid){
  console.table(saveddata.files[textid].insides);
  const thewindow = document.getElementById("Lbar");
  const newDiv = document.createElement("div");
  newDiv.innerHTML = '<div id="'+saveddata.files[textid].name+'" class="window"> <div id="'+saveddata.files[textid].name+'header" class="handle"><div class="wtext"><img  style="width: 25px; height: 25px;" src="textfileicon.png">'+saveddata.files[textid].name+'</div><button class="Close" id="close" onclick="windowclose('+"'"+saveddata.files[textid].name+"'"+')">X</button></div><div>'+saveddata.files[textid].insides+'</div></div>';
  document.body.insertBefore(newDiv, thewindow);
  dragElement(document.getElementById(saveddata.files[textid].name));
}
window.addEventListener('load', function() {
dragElement(document.getElementById("mydiv"));
dragElement(document.getElementById("myweb"));
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
    if(idet == "mydiv"){
    myfilesopen = false;}
    if(id == "myweb"){
      webopen = false;
    }
}
