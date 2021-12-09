/*--- Global Variables ---*/
const cells = document.querySelectorAll("#myTable td");

//Log Variables
var topLog = " ";
var log = topLog;

//Dice Variables
var rollResult = 0;
var diceRolled = false;
var endTurn = false;

//Token Movement Variables
var startCell = null;
var endCell = null; 

//Token Movement Variables for Special Case Movement
var prevRollResult = 0;
var prevStartCell = null;
var prevEndCell = null;

//Token Movement Bool Check
var validMove = false;

//Bools for clicking
var firstClick = false; 
var secondClick = false; 

//Win Conditions 
var player1Wins = false;
var player2Wins = false;

//Player Text Variables
const player1TurnText = document.getElementById("player-1-turn-text");
const player2TurnText = document.getElementById("player-2-turn-text");

//Winning Number 
var winNum = null; 

//Tips Number
var tipNum = 0;

/*--- Click Handling ---*/
for(var cell of cells){
    cell.addEventListener('click', click)
}

function click() {
    if(firstClick == false && diceRolled == true){
        if(this.innerHTML >= rollResult){
            firstClick = true; 
            tipNum = tipNum + 1; 
            unhighlight();
            this.style.backgroundColor = "yellow";
            startCell = this; 
            adjacent(this); 
        }
    }
    else if(firstClick == true && secondClick == false && diceRolled == true){
        if(this.style.backgroundColor == "yellow"){
            firstClick = false;
            tipNum = tipNum - 1; 
            unhighlight();
            highlight(); 
            showTips();
            return
        }
        if(this.style.backgroundColor == "orange"){
            secondClick = true; 
            endCell = this;
            unhighlight();
            tokenMovement();
        }  
    }
    showTips();
}

/* --- Token Movement --- */
function tokenMovement(){
    startCell.innerHTML = parseInt(startCell.innerHTML) - parseInt(rollResult);
    endCell.innerHTML = parseInt(endCell.innerHTML) + parseInt(rollResult); 
    updateLog();
}


//console.log(cells);
//console.log(cellVal);
//console.log(cellVal[0].innerHTML); //This is how to get actual cell value
 

/*--- Cosmetic Functions ---*/
function highlight(){
    for(let i = 0; i < cells.length; i++){
        if(cells[i].innerHTML >= rollResult){
            cells[i].style.backgroundColor = "green";
        }
        else{
            cells[i].style.backgroundColor = "white";
        }
    }
}

function unhighlight(){
    for(let i = 0; i < cells.length; i++){
        cells[i].style.backgroundColor = "white";
    }
}

function adjacent(cell){
    let id = cell.id; 
    let adjID = [null, null, null, null]; 
    // console.log("a" + (parseInt(id.substring(1,2)) + Number(1)));
    if(id.substring(0,1) == "a"){
        adjID[0] = "a" + (parseInt(id.substring(1,2)) + Number(1));
        adjID[1] = "a" + (parseInt(id.substring(1,2)) - Number(1));
        adjID[2] = "b" + id.substring(1,2);
    } 
    if(id.substring(0,1) == "b"){
        adjID[0] = "b" + (parseInt(id.substring(1,2)) + Number(1));
        adjID[1] = "b" + (parseInt(id.substring(1,2)) - Number(1));
        adjID[2] = "a" + id.substring(1,2);
        adjID[3] = "c" + id.substring(1,2);
    } 
    if(id.substring(0,1) == "c"){
        adjID[0] = "c" + (parseInt(id.substring(1,2)) + Number(1));
        adjID[1] = "c" + (parseInt(id.substring(1,2)) - Number(1));
        adjID[2] = "b" + id.substring(1,2);
    }
    if(rollResult == prevRollResult){
        //Preventing Undoing Previous Players Move
        for(let i = 0; i < adjID.length; i++){
            let adjacentCell = document.getElementById(adjID[i]);
            if(adjacentCell != null && (adjacentCell.id != prevStartCell.id || id != prevEndCell.id)){
                adjacentCell.style.backgroundColor = "orange";
            }  
        }
    }
    else{
        for(let i = 0; i < adjID.length; i++){
            let adjacentCell = document.getElementById(adjID[i]);
            if(adjacentCell != null){
                adjacentCell.style.backgroundColor = "orange";
            }  
        }
    }
    
}

function changePlayer() {
    if(endTurn){
        endTurn = false;
        player1TurnText.style.color = "white";
        player1TurnText.style.opacity = "100%";
        player2TurnText.style.color = "lightgrey";
        player2TurnText.style.opacity = "30%";
        
    } 
    else {
        endTurn = true;
        player1TurnText.style.color = "lightgrey";
        player1TurnText.style.opacity = "30%";
        player2TurnText.style.color = "white";
        player2TurnText.style.opacity = "100%";
    }
}

function writeRoll(){
    let text = document.getElementById("lCol");
    if(!endTurn){
        text.innerHTML = "Player 1";
    }
    else{
        text.innerHTML = "Player 2";
    }
    text.innerHTML += " rolled a " + rollResult; 
}

function writeLog(){
    let text = document.getElementById("rCol");
    let topLogMod = insert(topLog, 29, "</br>") //29 since it will always be the 29th character to insert line break
    text.innerHTML = topLogMod;
}

function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

function clearRoll(){
    let text = document.getElementById("lCol");
    if(endTurn == true){
        text.innerHTML = "Player 1";
    }
    else{
        text.innerHTML = "Player 2";
    }
    text.innerHTML += ": Click the Blank Die to Roll!"; 
}

/*--- Dice Functions ---*/
function rollDice() {
    if(!diceRolled){
        diceRolled = true;  
        rollResult = Math.floor(Math.random() * 6) + 1; //Gives 1-6, instead of 0-5
        //rollResult = Math.floor(Math.random() * 0) + 1;
        displayDie();
        highlight();
        let colors = [];
        for(let i = 0; i<cells.length; i++){
            colors.push(cells[i].style.backgroundColor);
        }
        if(colors.includes("green")){
            validMove = true;
        }
        else{
            validMove = false;
            updateLog();
        }
        tipNum = tipNum + 1;
        showTips();
    }
}

function displayDie() {
    let die = document.getElementById("die");
    if(rollResult != 0){
        die.src= "dice" + rollResult.toString() + ".png";
        writeRoll();
    }
    else{
        die.src = "dice.png";
        clearRoll(); 
    }
}

function displayWin() {
    tipNum = tipNum + 1;
    showTips(); 
    if(player1Wins){
        var winRow = [document.getElementById("a1"), 
        document.getElementById("a2"),
        document.getElementById("a3"),
        document.getElementById("a4")
        ];
    } 
    else{
        var winRow = [document.getElementById("c1"), 
        document.getElementById("c2"),
        document.getElementById("c3"),
        document.getElementById("c4")
        ];
    }
    
    for(let i = 0; i<winRow.length; i++){
        if(winRow[i].innerHTML == winNum){
            winRow[i].style.backgroundColor = "red";
        }
    }
    
    let r = document.getElementById("restart");
    r.style.display = "inline";
    let lef = document.getElementById("lCol");
    lef.innerHTML = "Press the restart button to play again."
}

/*--- Log Functions ---*/
function updateLog() {
    if (endTurn) {
        var player = "Player 2";
    }
    else {
        var player = "Player 1";
    }

    var status = document.getElementById("logger");
    
    if(validMove){
        let start = startCell.id.toUpperCase();
        let end = endCell.id.toUpperCase();
        topLog = player + " moved " + rollResult;
        if(rollResult==1){
            topLog = topLog + " token from ";
        }
        else {
            topLog = topLog + " tokens from ";
        }
        topLog = topLog + start + " to " + end + ".";
    }
    else{
        topLog = player + " rolled a " + rollResult + " but had no legal moves to play."
    }
    log = topLog + "<br/>" + log;
    status.innerHTML = log;
    writeLog();
    checkWin();
    if(player1Wins){
        let winStatement = "Player 1 just Won!!!";
        log = winStatement + "<br/>" + log;
        status.innerHTML = log;
        topLog = winStatement;
        writeLog();
        displayWin();
    }
    if(player2Wins){
        let winStatement = "Player 2 just Won!!!";
        log = winStatement + "<br/>" + log;
        status.innerHTML = log;
        topLog = winStatement;
        writeLog();
        displayWin();
    }

    if(player1Wins == false && player2Wins == false){
        diceRolled = false;
        firstClick = false;
        secondClick = false;
        prevRollResult = rollResult;
        prevStartCell = startCell;
        prevEndCell = endCell;
        rollResult = 0;
        tipNum = 0;
        displayDie();
        changePlayer();
        showTips();
    }  
}



/*--- Win Functiosn ---*/
function checkWin(){
    //Player 1 Check
    let p1Row = [document.getElementById("a1"), 
                document.getElementById("a2"),
                document.getElementById("a3"),
                document.getElementById("a4")
                ];
    for(let i = 0; i<p1Row.length; i++){
        p1Row[i] = p1Row[i].innerHTML;
    }
    let counts = {};
    for(let i = 0; i < p1Row.length; i++){ 
        if(p1Row[i] != 0){ //Hopefully to prevent winning first turn with 0's
            if (counts[p1Row[i]]){
                counts[p1Row[i]] += 1;
            } 
            else{
                counts[p1Row[i]] = 1;
            }
        }
    }  
    for (let prop in counts){
        if (counts[prop] >= 3){
            player1Wins = true;
            winNum = prop;
            //console.log(prop + " counted: " + counts[prop] + " times.");
        }
    }

    //Player 2 Check
    let p2Row = [document.getElementById("c1"), 
                document.getElementById("c2"),
                document.getElementById("c3"),
                document.getElementById("c4")
                ];
    for(let i = 0; i<p2Row.length; i++){
        p2Row[i] = p2Row[i].innerHTML;
    }
    let counts2 = {};
    for(let i = 0; i < p2Row.length; i++){ 
        if(p2Row[i] != 0){ //Hopefully to prevent winning first turn with 0's
            if (counts2[p2Row[i]]){
                counts2[p2Row[i]] += 1;
            } 
            else{
                counts2[p2Row[i]] = 1;
            }
        }
    }  
    for (let prop in counts2){
        if (counts2[prop] >= 3){
            player2Wins = true;
            winNum = prop;
            //console.log(prop + " counted: " + counts[prop] + " times.");
        }
    }
}    

/*--- Restart Functions ---*/
function restartGame(){
    for(let i = 0; i < cells.length; i++){
        cells[i].innerHTML = 0;
    }
    cells[4].innerHTML = 10;
    cells[5].innerHTML = 10;
    cells[6].innerHTML = 10;
    cells[7].innerHTML = 10;
    
    let r = document.getElementById("restart");
    r.style.display = "none"; 
    
    //Remove highlight from win row
    unhighlight(); 

    //Making default values again
    topLog = " ";
    log = topLog;

    rollResult = 0;
    diceRolled = false;
    endTurn = false;

    startCell = null;
    endCell = null; 
    
    prevRollResult = 0;
    prevStartCell = null;
    prevEndCell = null;

    validMove = false;

    firstClick = false; 
    secondClick = false; 

    player1Wins = false;
    player2Wins = false;

    winNum = 0;
    tipNum = 0;
    //Clearing the Log
    let text = document.getElementById("logger");
    text.innerHTML = topLog;

    //Updating back to player 1 being highlighted
    player1TurnText.style.color = "white";
    player1TurnText.style.opacity = "100%";
    player2TurnText.style.color = "lightgrey";
    player2TurnText.style.opacity = "30%";

    //Clearing Dice
    displayDie();

    //Updating left side
    let leftc = document.getElementById("lCol");
    leftc.innerHTML = "Player 1: Click the Blank Die to Roll!";

    //Updating right side 
    let rightc = document.getElementById("rCol");
    rightc.innerHTML = "Latest move will appear here";

    //Updating Tips
    showTips(); 
}

/*--- Restart Functions ---*/
function showLog(){
    let T = document.getElementById("logger");
    let displayValue = "";
    if (T.style.display == ""){
        displayValue = "none";
    }
    
    T.style.display = displayValue;
}

/*--- Tips Functions---*/
function showTips(){
    let tip = document.getElementById("tips");
    switch(tipNum){
        case 0:
            tip.innerHTML = "Tips will appear here";
            break;
        case 1:
            tip.innerHTML = "Click a <span style='color:green; background-color:black'>green cell</span> that you'll move tokens from.";
            break;
        case 2:
            tip.innerHTML = "Click the <span style='color:orange; background-color:black'>orange cell</span> you'd like to move those tokens to.";
            tip.innerHTML = tip.innerHTML + "</br>";
            tip.innerHTML = tip.innerHTML + "Click the <span style='color:yellow; background-color:black'>yellow cell</span> to deselect.";
            break;
        case 3:
            tip.innerHTML = "The win condition was met, indicated by the <span style='color:red; background-color:black'>red cells</span>";
    }
}

// Modal Span
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


//Slideshow

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}