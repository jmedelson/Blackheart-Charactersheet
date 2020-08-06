var cultists;
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAuy6eCk2Y01w5rsWPWVom8MHYxTdco_JE",
    authDomain: "dnd-project-d9308.firebaseapp.com",
    databaseURL: "https://dnd-project-d9308.firebaseio.com",
    projectId: "dnd-project-d9308",
    storageBucket: "dnd-project-d9308.appspot.com",
    messagingSenderId: "393824270225",
    appId: "1:393824270225:web:0abc486ee81a6123a68c30",
    measurementId: "G-WQDFP2MV11"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
database = firebase.database();
var ref = database.ref('cultists');
ref.on('value', gotData, errData);
var cultists = {}
var cultistID = [];
var cultistName = [];
function gotData(data){
    console.log(data.val())
    var items = data.val()
    cultists = items
    var keys = Object.keys(items)
    let options = '';
    for(let key of keys){
        cultistID.push(key)
        let name =items[key]["name"]
        cultistName.push(name)
        options += `<option value='${name}'/>`
    }
    document.getElementById('loadList').innerHTML = options
    console.log(cultistID,cultistName, options)
    // for(var i = 0; i<keys.length; i++){
    //     var k = keys[i];
    //     var name = items[k].name
    //     console.log(name)
    // }

}
function errData(err){
    console.log(err)
}
function childAdded(data){
    console.log('Child Added',data)
    console.log(data.val())
}


function reportWindowSize() {
    const viewW = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const viewH = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    let scaleX = viewW/700;
    let scaleY = viewH/900;
    let minScale = Math.min(scaleX,scaleY);
    let message = "scale(" + minScale + ")";
    document.getElementById("main").style.transform = message;  
    document.getElementById("loading").style.transform = message; 
    console.log(viewW,viewH,minScale,message)
}
function setAbility(role){
    var message = ''
    role = role.toLowerCase()
    switch (String(role)){
        case "the apothecary":
            message = "Once per game - add +1 to every roll for the day."
            break;
        case "the witch":
            message = "Once per game - Reroll one dice roll."
            break;
        case "the hunter":
            message = "Once per game - Can check their traps and get an extra scene in THE FOREST."
            break;
        case "the scavenger":
            message = "Succeeds their easy challenge during the summoning."
            break;
        case "the innkeeper":
            message = "Once per game - Can automatically succeed at a failed TOWN HALL roll."
            break;
        case "the troubadour":
            message = "Knowledge of song lets them re-roll their mutation if they so choose."
            break;
        case "the farmer":
            message = "Once per game - May tend to their crops and gain an extra scene at THE FARM."
            break;
        case "the reverend":
            message = "Once per game - Due to unwavering faith in God, can re-roll one failed challenge per game."
            break;
        case "the merchant":
            message = "Once per game - Can automatically succeed at a failed TOWN HALL roll."
            break;
        case "the butcher":
            message = "Once per game - Can substitute their strongest stat in for one challenge." 
            break;
        case "the marshall":
            message = "Once per game - Can conduct an \"official\" investigation and gain +1 to all rolls that day."        
            break;
        case "the blacksmith":
            message = "Once per game - Can substitute their strongest stat in for one challenge."
        default:
            message = "Unknown ability"
            break;
    }
    var elem = document.getElementById('ability')
    elem.value = message
    console.log(role,'message set', message)
}
function onInput(){
    var val = document.getElementById("role").value;
    var opts = document.getElementById('roles')
    console.log(val)
    console.log(opts.options)
    for(item of opts.options){
        if(item.value == val){
            setAbility(val)
        }
    }
}
function checkToggle(){
    let ability = document.getElementById("ability-used")
    let checked = ability.checked
    let show = document.getElementById("check")
    console.log("checked", checked)
    if(checked){
        show.style.display = 'block'
    }
    else{
        show.style.display = 'none'
    }
}
reportWindowSize()
window.addEventListener('resize', reportWindowSize);
function saveData(){
    let name = document.getElementById("name")
    if(name.value.length<1){
        console.log("name to short")
        return
    }
    let saving = document.getElementById("saving")
    let iconText = document.getElementById("saveHover")
    let iconText2 = document.getElementById("saveHover2")
    saving.className = "fa fa-spinner fa-spin"
    iconText.textContent = '\u00A0 Saving'
    iconText2.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving'
    // let pronouns = document.getElementById("pronouns")
    // let role = document.getElementById("role")
    // let heart = document.getElementById("heart")
    // let mind = document.getElementById("mind")
    // let soul = document.getElementById("soul")
    // let weird = document.getElementById("weird")
    // let ability = document.getElementById("ability")
    // let used = document.getElementById("used")
    // let mutations = document.getElementById("name")
    // let notes = document.getElementById("notes")
    var formData = $('#mainForm').serializeArray()
    // var formData = new FormData(document.querySelector('#mainForm'))
    var data = {}
    for(item of formData){
        data[item.name] = item.value;
    }
    if(data['ability-used']){
        data['ability-used'] = true
    }else{
        data['ability-used'] = false
    }
    console.log("DATA")
    console.log(data)
    if(loaded){
        var update = firebase.database().ref(`cultists/${loaded}`)
        update.set(data, onSave).then((snap) => {
            saving.className = ""
            iconText.textContent = 'Click To Save'
            iconText2.innerHTML = 'Save'
        })
    }else{
        ref.push(data, onSave).then((snap) => {
            const key = snap.key 
            console.log('New key ===', key)
            loaded = key
            saving.className = ""
            iconText.textContent = 'Click To Save'
            iconText2.innerHTML = 'Save'
        });
    }
}
function onSave(){
    console.log("SAVE Completed here")
}
var loaded = false
function loadPop(){
    console.log("load pop up")
    let overlay = document.getElementById("overlay");
    overlay.style.display = 'block';
}
function loadData(){
    let data = document.getElementById("loadInput").value;
    let id = cultistID[cultistName.indexOf(data)]
    loaded = id
    let cultist = cultists[id]
    console.log(cultist)
    document.getElementById("name").value = cultist['name']
    document.getElementById("pronouns").value = cultist['pronouns']
    document.getElementById("role").value = cultist['role']
    document.getElementById("heart").value = cultist['heart']
    document.getElementById("mind").value = cultist['mind']
    document.getElementById("soul").value = cultist['soul']
    document.getElementById("weird").value = cultist['weird']
    document.getElementById("ability").value = cultist['ability']
    document.getElementById("ability-used").value = cultist['ability-used']
    document.getElementById("notes").value = cultist['notes']
    document.getElementById("mutations").value = cultist['mutations']
    let overlay = document.getElementById("overlay");
    overlay.style.display = 'none';    
}
$('#overlay').click(function(e){
    if(e.target.id !== 'loading'&& e.target.id !== 'overlay' && e.target.id !== 'xbutton') return;
    let overlay = document.getElementById("overlay");
    overlay.style.display = 'none';
})