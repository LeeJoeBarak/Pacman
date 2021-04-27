var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var up = 38;
var down = 40;
var left = 37;
var right = 39;
var food_remain = -1;
var monster_remain = -1;
var timeToPlay = -1;
var extra_food = 1;
var pacmanRight = true;
var pacmanLeft = false;
var pacmanUp = false;
var pacmanDown = false;
var num_of_25_pt;
var scoreOfTotalBoard = 0;
var lives = false;
var MonstersRHere;
var boardExtraScore;
var intervalMonster;
var playerName;
var extra_life = 1;
var clock = 1;
var gameSong;
var StopSoungEffects = false;
var intervalExtraScore;
var n;
var k;
var intervals = [];
var CellHeight;
var CellWidth;
var MonstersRHere;
var ExtraScoreMoves;
var color;
var pacmanRight = true;
var pacmanLeft = false;
var pacmanUp = false;
var pacmanDown = false;
var lives = 5;
var pacmanRemain;
var emptyCell;
var columns =15;
var lines = 15;
var CreepyMusic = new Audio('audio/creepy.mp3');

/* defult user */
$(document).ready(function () {
    let defUserName = {
        userName: "k",
        userPassword: "k",
        firstName: "k",
        lastName: "k",
        mail: "k@gmail.com",
        birthDay: Date.now()
    };
    let str = JSON.stringify(defUserName);
    localStorage.setItem("k", str);
});

/* form[name=settings Handler *//*todo: Validates the selected form  */
$(function() {
    $("form[name='settings']").validate({
        rules: { // Specify validation rules
            food: {
                required: true,
                min: 50,
                max: 90,
            },
            monsters: {
                required: true,
                min: 1,
                max: 4,
            },
            setTime: {
                required: true,
                min: 60,
            },
        },
        messages: { // Specify validation error messages
            food: {
                required: "you forgot to fill in the amount of food",
                min: "you forgot to choose a number between 50 and 90",
                max: "you forgot to choose a number between 50 and 90",
            },
            monsters: {
                required: "you forgot to fill in the amount of monsters",
                min: "you forgot to choose a number between 1 and 4",
                max: "you forgot to choose a number between 1 and 4",
            },
            setTime: {
                required: "you forgot to choose the duration of the game",
                min: "The minimum duration is at least 60 seconds",
            },
        },
        submitHandler: function(form) {
            submitSettingsHandler();
            initializeGameDesign();/*todo: relace some stuff in initializeGameDesign() */
        },
        invalidHandler: function(form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {
                var message = errors == 1
                    ? 'Please correct the following error:\n'
                    : 'Please correct the following ' + errors + ' errors.\n';
                var errors = "";
                if (validator.errorList.length > 0) {
                    for (x=0;x<validator.errorList.length;x++) {
                        errors += "\n\u25CF " + validator.errorList[x].message;
                    }
                }
                alert(message + errors);
            }
            validator.focusInvalid();
        }
    });
});

function submitSettingsHandler(){//Show score_time_life
    $("#settings").css("display", "none");
    $("#random_btn").css("display", "none");
    $("#menu").css("position", "fixed");
    $('#score_time_life').css('display', 'block');
    displaySettingDuringTheGame();
}

function initializeGameDesign() {
    context = canvas.getContext("2d");
    calculateCellSize();
    $("#bottomFooter").css("position","relative");
    displaySettingDuringTheGame();
    initGame(); /*todo: figure out how this is different from initializeGameDesign */
    //$("#newGame_btn").css("display","block");
}

function displaySettingDuringTheGame() {
    // initSetting();
    document.getElementById('pl_name').innerHTML = playerName;
    if($('#upId').val()){/*Input element in Settings Form with id="upId"*/
        document.getElementById('up').innerHTML = document.getElementById("upId").value;
    }
    else {
        document.getElementById('up').innerHTML;
    }
    if($('#downId').val()){
        document.getElementById('down').innerHTML = document.getElementById("downId").value;
    }
    else {
        document.getElementById('down').innerHTML;
    }
    if($('#rightId').val()){
        document.getElementById('right').innerHTML = document.getElementById("rightId").value;
    }
    else {
        document.getElementById('right').innerHTML;
    }
    if($('#leftId').val()){
        document.getElementById('left').innerHTML = document.getElementById("leftId").value;
    }
    else{
        document.getElementById('left').innerHTML;
    }
    document.getElementById('balls').innerHTML = document.settings.food.value;
    document.getElementById('timePlay').innerHTML = document.settings.setTime.value;
    document.getElementById('mons').innerHTML = document.settings.monsters.value;
}

function changeUserKeysValues(event) {
    //set key from event's id
    if (event.target.id === "upId") {
        up = event.keyCode;
        // upId.value = event.key;
        if(event.key.length > 1) {
            upId.value = event.key;
        }
    }else if (event.target.id === "downId") {
        down = event.keyCode;
        if(event.key.length > 1) {
            downId.value = event.key;
        }

    }else if (event.target.id === "leftId") {
        left = event.keyCode;
        if(event.key.length > 1) {
            leftId.value = event.key;
        }

    }else if (event.target.id === "rightId") {
        right = event.keyCode;
        if(event.key.length > 1) {
            rightId.value = event.key;
        }
    }
}

function randomSetting() {
    clearIntervals();
    left = 37;
    up = 38;
    right = 39;
    down = 40;
    document.getElementById("ball_5_points").value = getRandomColor();
    document.getElementById("ball_15_points").value = getRandomColor();
    document.getElementById("ball_25_points").value = getRandomColor();
    food.value = getRandomFoodAmount();
    monsters.value = getRandomMonstersAmount();
    setTime.value = getRandomTimeAmount();
}

function setDefaultValuesForSettingsBoxes() {//set the default keys to arrows
    document.getElementById("food").value = null;
    document.getElementById("monsters").value = null;
    document.getElementById("setTime").value = null;
    left = 37;
    up = 38;
    right = 39;
    down = 40;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    while(color === '#000000' || color === '#'){
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
    }
    return color;
}

function getRandomFoodAmount(){
    food_remain = -1;
    while (food_remain < 50 || food_remain > 90) {
        food_remain = parseInt(100 * Math.random());
    }
    return food_remain;
}

function getRandomMonstersAmount(){
    monster_remain = -1;
    while (monster_remain < 1 || monster_remain > 4) {
        monster_remain = parseInt(10 * Math.random());
    }
    return monster_remain;
}

function getRandomTimeAmount(){
    timeToPlay = -1;
    while (timeToPlay < 60) {
        timeToPlay = parseInt(100 * Math.random());
    }
    return timeToPlay;
}

function displaySettings() {
    $("#loading_img").css("display","none");
    setDefaultValuesForSettingsBoxes();
    $('#settings').css('display', 'block');
    $("#random_btn").css("display","block");
    $('#game').css('display', 'block');
    $('#score_time_life').css('display', 'none');
}


/* ################# LOGIN ##########################*/
function showLogin() {
    document.getElementById("name").value = null;
    document.getElementById("userPassword").value = null;
    $(document.getElementById("welcome")).hide();
    $(document.getElementById("about")).hide();
    $(document.getElementById("register")).hide();
    $(document.getElementById("settings")).hide();
    $(document.getElementById("login")).show();
    $("#random_btn").css("display", "none");
    $('#score_time_life').css('display', 'none');
    $("#footer").css("position","fixed");
    clearIntervals();
    if(!StopSoungEffects) {
        stopSong();
        stop_soundEffect();
        StopSoungEffects = false;
    }
}

/*################# registration ###################*/

/*############################## BARAKs CODE   ##########################################*/

$(document).ready(function() {
    context = canvas.getContext("2d");
    Start();
});

const wallCells = [
    "1,1", "1,2", "1,3", "1,4", "5,1", "4,1", "3,1", "2,1",
    "1,6", "2,6", "3,6", "1,7", "1,8", "1,9", "1,10", "2,10", "3,10", "3,9", "3,8", "3,7",
    "3,12", "4,12", "5,12", "6,12", "7,12", "8,12", "9,12", "3,13", "4,13", "5,13", "6,13", "7,13", "8,13", "9,13",
    "5,1", "5,2", "5,3", "5,4", "6,1", "6,2", "6,3", "6,4",
    "5,6", "6,6", "7,6", "8,6", "9,6", "5,7", "6,7", "7,7", "8,7", "9,7", "8,10", "8,8", "8,9", "9,10", "9,8", "9,9",
    "8,0", "8,1", "9,0", "9,1",
    "8,3", "9,3", "10,3", "11,3", "12,3", "8,4", "9,4", "10,4", "11,4", "12,4", "11,1", "11,2", "12,1", "12,2",
    "11,6", "12,6", "13,6", "14,6",
    "11,9", "11,10", "11,11", "11,13", "12,9", , "13,9", , "14,9",
];


function Start() {
    board = new Array();
    score = 0;
    pac_color = "yellow";
    var food_remain = parseInt($(document.getElementById("food")).val());
    pacmanRemain = 1;
    var monster_remain = parseInt($(document.getElementById("monsters")).val());;
    var remaining_15_pt = 0.3 *food_remain;
    var remaining_5_pt= 0.6 * food_remain;
    var remaining_25_pt = food_remain - remaining_5_pt - remaining_15_pt;


    MonstersRHere = new Array();
    for (var i = 0; i < lines; i++) {
        MonstersRHere[i] = new Array();
        for (var j= 0 ; j<columns ; j++){
            MonstersRHere[i][j] =0;
        }
    }

    start_time = new Date();
    for (var i = 0; i < lines; i++) {
        board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < columns; j++) {
            let cell= "" +i + "," +j;
            if (wallCells.includes(cell)) {
                board[i][j] = 4;
            }else if(monster_remain>0 && ((j===0 || j===lines-1) && ( i===0 || i===columns-1 ))){
                monster_remain--;
                if(monster_remain %2 === 0){
                    board[i][j] = 7;
                    MonstersRHere[i][j] = 7;
                }
                else{
                    board[i][j] = 9;
                    MonstersRHere[i][j] = 9;
                }

            }
            else {
                board[i][j] = 0;
            }

        }


    }
    if(pacmanRemain > 0 ){
        emptyCell = findRandomEmptyCell(board);
        shape.i = emptyCell[0];
        shape.j = emptyCell[1];
        board[shape.i][shape.j] = 2;
        pacmanRemain--;
    }
    while (remaining_5_pt > 0) {
        emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = 5;
        remaining_5_pt--;
        food_remain--;
    }
    while (remaining_15_pt > 0) {
        emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = 6;
        remaining_15_pt--;
        food_remain--;
    }
    while (remaining_25_pt > 0) {
        emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = 3;
        remaining_25_pt--;
        food_remain--;
    }
    keysDown = {};
    addEventListener(
        "keydown",
        function(e) {
            keysDown[e.keyCode] = true;
            /*
                        if([32,37,38,39,40].indexOf(e.keyCode) > -1){
                            e.preventDefault();
                        }
            */
        },
        false
    );
    addEventListener(
        "keyup",
        function(e) {
            keysDown[e.keyCode] = false;
        },
        false
    );
    interval = setInterval(UpdatePacmanPosition, 350);
    interval = setInterval(UpdateMonsterPosition, 1000);
    CreepyMusic.play();
}

function findRandomEmptyCell(board) {
    var i = Math.floor(Math.random() * columns);
    var j = Math.floor(Math.random() * lines);

    while (board[i][j] !== 0) {
        i = Math.floor(Math.random() * columns);
        j = Math.floor(Math.random() * lines);
    }
    return [i, j];
}

function GetKeyPressed() {
    if (keysDown[38]) {
        return 1;
    }
    if (keysDown[40]) {
        return 2;
    }
    if (keysDown[37]) {
        return 3;
    }
    if (keysDown[39]) {
        return 4;
    }
}

function calculateCellSize(){
    CellHeight = canvas.height/columns;
    CellWidth = canvas.width/lines;
}

function Draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context = canvas.getContext("2d");
    canvas.width = canvas.width; //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed;
    calculateCellSize();
    var KnifeMonster = new Image();
    KnifeMonster.src = "image/knife.jpeg";
    var ghostMonster = new Image();
    ghostMonster.src = "image/ghost.jpeg";
    var TumbLife = new Image();
    TumbLife.src = "image/tumb.jpeg";
    var wallPic = new Image();
    wallPic.src = "image/pumpkinWall.jpg";
    color = getRandomColor();
    for (var i = 0; i < lines; i++) {
        for (var j = 0; j < columns; j++) {
            let bordVal = board[i][j];
            let MonsVal = MonstersRHere[i][j];
            console.log(MonsVal);
            var center = new Object();
            center.x = i * CellWidth + CellWidth/2;
            center.y = j * CellHeight + CellHeight/2;
            if (MonsVal === 7) {
                context.drawImage(KnifeMonster, center.x - CellWidth/2, center.y - CellHeight/2);
            }
            else if (MonsVal === 9) {
                context.drawImage(ghostMonster, center.x - CellWidth/2, center.y - CellHeight/2);
            }
            else if (bordVal === 2 && pacmanLeft && lives > 0) {
                context.beginPath();
                context.arc(center.x, center.y, 20, -0.85 * Math.PI, 0.85 * Math.PI); // half circle
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color
                context.fill();
                context.beginPath();
                context.arc(center.x + 5, center.y - 10, 5, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color
                context.fill();
            } else if (bordVal === 2 && pacmanUp && lives > 0) {
                context.beginPath();
                context.arc(center.x, center.y, 20, 1.7 * Math.PI, 1.35 * Math.PI); // half circle
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color
                context.fill();
                context.beginPath();
                context.arc(center.x + 10, center.y + 5, 5, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color
                context.fill();
            } else if (bordVal === 2 && pacmanRight && lives > 0) {
                context.beginPath();
                context.arc(center.x, center.y, 20, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color
                context.fill();
                context.beginPath();
                context.arc(center.x + 5, center.y - 10, 5, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color
                context.fill();
            } else if (bordVal === 2 && pacmanDown && lives > 0) {
                context.beginPath();
                context.arc(center.x, center.y, 20, 0.75 * Math.PI, 0.35 * Math.PI); // half circle
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color
                context.fill();
                context.beginPath();
                context.arc(center.x + 8   , center.y - 8, 5, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color
                context.fill();
                /*5 point ball*/
            } else if (bordVal === 5) {
                context.beginPath();
                context.arc(center.x, center.y, 8, 0, 2 * Math.PI); // circle
                context.fillStyle = "#3c84ef"; //color
                context.fill();
                context.fillStyle = document.getElementById("ball_5_points").value; //color
                context.font = "bold 10px Arial";
                context.fillText("5", center.x - 3, center.y + 4);
                /*15 point ball*/
            } else if (bordVal === 6) {
                context.beginPath();
                context.arc(center.x, center.y, 9, 0, 2 * Math.PI); // circle
                context.fillStyle = document.getElementById("ball_15_points").value; //color
                context.fill();
                context.fillStyle = "white"; //color
                context.font = "bold 10px Arial";
                context.fillText("15", center.x - 6, center.y + 4);
            } else if (bordVal === 3) {
                context.beginPath();
                context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
                context.fillStyle = color; //random color
                context.fill();
                context.fillStyle = "black"; //color
                context.font = document.getElementById("ball_25_points").value;
                context.fillText("25", center.x - 5, center.y + 3);
            } else if (bordVal === 4) {
                context.beginPath();
                context.strokeStyle = "#3c3cef";
                //context.drawImage(wallPic,center.x - 18,center.y - 17);
                context.drawImage(wallPic,center.x - CellWidth/2, center.y - CellHeight/2,CellWidth,CellHeight);
            }
        }
    }}

function clearIntervals() {
    while(intervals.length > 0) {
        clearInterval(intervals.pop());
    }
}

function UpdatePacmanPosition() {
    board[shape.i][shape.j] = 0;
    var x = GetKeyPressed();
    if (x == 1) {
        if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
            shape.j--;
            pacmanDown, pacmanLeft, pacmanRight = false, false, false;
            pacmanUp =true;
        }
    }
    if (x == 2) {
        if (shape.j < 14 && board[shape.i][shape.j + 1] != 4) {
            shape.j++;
            pacmanUp, pacmanLeft, pacmanRight = false, false, false;
            pacmanDown =true;
        }
    }
    if (x == 3) {
        if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
            shape.i--;
            pacmanDown, pacmanUp, pacmanRight = false, false, false;
            pacmanLeft =true;
        }
    }
    if (x == 4) {
        if (shape.i < 14 && board[shape.i + 1][shape.j] != 4) {
            shape.i++;
            pacmanDown, pacmanUp, pacmanLeft = false, false, false;
            pacmanRight = true;
        }
    }
    x=-1;
    let BoardVal = board[shape.i][shape.j];
    if(BoardVal === 5 || BoardVal===6 || BoardVal===7){
        if(board[shape.i][shape.j] ==5 ){
            score = score+5;
            document.getElementById("alertString").innerHTML = "You Got 5 points!!";
        }
        if (board[shape.i][shape.j] == 6){
            score = score+15;
            document.getElementById("alertString").innerHTML = "You Got 15 points!!";
        }
        if(board[shape.i][shape.j] ==3){
            score = score+25;
            document.getElementById("alertString").innerHTML = "You Got 25 points!!";
        }
        if(!StopSoungEffects){
            var FruitAudio = new Audio('audio/pacman_eatfruit.wav');
            FruitAudio.play();
        }
    }
    let MonsPacVal = MonstersRHere[shape.i][shape.j];
    if (MonsPacVal===7){
        MeetMonster(7);
    }
    if (MonsPacVal===9){
        MeetMonster(9);
    }
    if(!StopSoungEffects && (MonsPacVal===7 || MonsPacVal === 9)){
        var audioGhost = new Audio('audio/pacman_eatghost.wav');
        audioGhost.play();
    }
    board[shape.i][shape.j] = 2;
    var currentTime = new Date();
    time_elapsed = (currentTime - start_time) / 1000;
    if (score >= 75 && time_elapsed <= 10 && pac_color!= "green") {
        pac_color = "green";
    }
    if (score == 200) {
        window.clearInterval(interval);
        window.alert("Game completed");
        var audioDeath = new Audio('audio/pacman_death.wav');
        audioDeath.play();
    } else {
        Draw();
    }
}

function UpdateMonsterPosition(){

    for (var i = 0; i < lines; i++) {
        for (var j = 0; j < columns; j++) {
            let CellVal= MonstersRHere[i][j];
            if (CellVal === 7 || CellVal === 9 ) {
                var randomNum = Math.floor(Math.random() * 2);/*0,1*/
                var notMove = true;

                //monster get down
                if (randomNum === 0 && Math.abs(((i + 1) - shape.i) < Math.abs((i - 1) - shape.i)) && board[i + 1][j] !== 4 && MonstersRHere[i + 1][j] !== 7) {
                    MonstersRHere[i][j] = 0;
                    MonstersRHere[i + 1][j] = CellVal;
                    notMove = false;
                }
                //monster get up
                else if (randomNum === 0 && Math.abs(((i + 1) - shape.i) > Math.abs((i - 1) - shape.i)) && board[i - 1][j] !== 4 && MonstersRHere[i - 1][j] !== 7) {
                    MonstersRHere[i][j] = 0;
                    MonstersRHere[i - 1][j] = CellVal;
                    notMove = false;
                }
                //monster get right
                else if (randomNum === 1 && Math.abs(((j + 1) - shape.j) < Math.abs((j - 1) - shape.j)) && board[i][j + 1] !== 4 && MonstersRHere[i][j + 1] !== 7 && MonstersRHere[i][j + 1] !== 9) {
                    MonstersRHere[i][j] = 0;
                    MonstersRHere[i][j + 1] = CellVal;
                    notMove = false;
                }
                //monster get left
                else if (randomNum === 1 && Math.abs(((j + 1) - shape.j) > Math.abs((j - 1) - shape.j)) && board[i][j - 1] !== 4 && MonstersRHere[i][j - 1] !==7 && MonstersRHere[i][j - 1] !== 9) {
                    MonstersRHere[i][j] = 0;
                    MonstersRHere[i][j - 1] = CellVal;
                    notMove = false;
                } else if (notMove || shape.i == i || shape.j == j) {
                    while (notMove) {
                        var randomMoveIfStack = Math.floor(Math.random() * 4);/*0,1*/
                        if (randomMoveIfStack === 0 && i-1 >= 0 && i-1 <= 14 && board[i - 1][j] !== 4 && MonstersRHere[i - 1][j] !== 7 && MonstersRHere[i-1][j] !== 9) {
                            MonstersRHere[i][j] = 0;
                            MonstersRHere[i - 1][j] = CellVal;
                            notMove = false;
                        } else if (randomMoveIfStack === 1  && i+1 >= 0 && i+1 <= 14 && board[i + 1][j] !== 4 && MonstersRHere[i + 1][j] !== 7 && MonstersRHere[i+1][j] !== 9) {
                            MonstersRHere[i][j] = 0;
                            MonstersRHere[i + 1][j] = CellVal;
                            notMove = false;
                        }
                        //get right
                        else if (randomMoveIfStack === 2  && (j+1 >= 0) && (j+1 <= 14) && board[i][j + 1] !== 4 && MonstersRHere[i][j + 1] !== 7&& MonstersRHere[i+1][j] !== 9) {
                            MonstersRHere[i][j] = 0;
                            MonstersRHere[i][j + 1] = CellVal;
                            notMove = false;
                        }
                        //get left
                        else if (randomMoveIfStack === 3 && j >0 && board[i][j - 1] !== 4 && MonstersRHere[i][j - 1] !== 7 && MonstersRHere[i][j - 1] !== 9) {
                            MonstersRHere[i][j] = 0;
                            MonstersRHere[i][j - 1] = CellVal;
                            notMove = false;
                        }
                    }
                }
            }
        }
    }
    let CellVal= MonstersRHere[shape.i][shape.j];
    if(CellVal === 7 || CellVal===9){
        MeetMonster(CellVal);
        if(!StopSoungEffects){
            var audio = new Audio('audio/pacman_eatghost.wav');
            audio.play();
        }
    }
}

function MeetMonster(MonsVal){
    removeLifeIcon(lives);
    lives--;
    board[shape.i][shape.j] = 0;
    score = score - 10;
    monster_remain = parseInt($(document.getElementById("monsters")).val());

    pacmanRemain=0;
    //setTimeout(continueGameLifeDown, 500);
    if(MonsVal===9){
        score= score-10;
    }
    else if (MonsVal ===7) { //7
        score = score- 20;
    }


    if(lives==0){
        window.clearInterval(interval);
        window.alert("Game completed");
        displaySettings();
    }
    else{
        pacmanRemain=1;
        for (var i = 0; i < lines; i++) {
            for (var j = 0; j < columns; j++) {
                if(board[i][j] === 2){
                    board[i][j] = 0;
                }
                MonstersRHere[i][j] = 0;
                if(monster_remain > 0 && ((i === 0 || i === 14) && (j === 0 || j === 14))){
                    if(monster_remain % 2 === 0){
                        board[i][j] = 7;
                        MonstersRHere[i][j] = 7;
                    }
                    else{
                        board[i][j] = 9;
                        MonstersRHere[i][j] = 9;
                    }
                    monster_remain--;
                }
            }
        }
        if(pacmanRemain > 0 ){
            emptyCell = findRandomEmptyCell(board);
            shape.i = emptyCell[0];
            shape.j = emptyCell[1];
            board[shape.i][shape.j] = 2;
            pacmanRemain--;
        }
        clearIntervals();

        intervals.push(setInterval(UpdatePacmanPosition, 150));
        intervals.push(setInterval(UpdateMonsterPosition, 750));
    }

}

function displayLifeIcons() {
    for (var i = 1; i <= lives; i++) {
        imageName = "#image" + i;
        $(imageName).css("display", "block");
    }
}

function removeLifeIcon(i) {
    if(i > 0) {
        let imageName = "#image" + i;
        $(imageName).css("display", "none");
    }
}


/*###################################################################################*/

/*
 #aboutBtn.Click -->
 HIDE: #register, #login, #welcome, #setting, #random_btn, #score_time_life */
$(document).ready(function () {
    $("#aboutBtn").click(function () {
        $('#welcome').css("display", "none");
        $(document.getElementById("register")).hide();
        $(document.getElementById("login")).hide();
        $(document.getElementById("settings")).hide();

        $("#about").show(300);

        $("#random_btn").css("display", "none");
        $('#score_time_life').css('display', 'none');
        $("#footer").css("position","fixed")
        stopSong();
        stop_soundEffect()
        StopSoungEffects = false;
    });
});

$(document).ready(function () {
    $("#welcomeBtn").click(function () {
        clearIntervals();
        $(document.getElementById("about")).hide();
        $(document.getElementById("register")).hide();
        $(document.getElementById("login")).hide();
        $('#welcome').css("display", "block");
        $(document.getElementById("settings")).hide();
        $("#random_btn").css("display", "none");
        $('#score_time_life').css('display', 'none');
        $("#footer").css("position","fixed");
        stopSong();
    });
});

$(document).ready(function () {
    $("#loginBtn").click(function () {
        showLogin();
    });
});

$(document).ready(function () {
    $("#registerBtn").click(function () {
        clearIntervals();
        $('#welcome').css("display", "none");
        $(document.getElementById("about")).hide();
        $(document.getElementById("login")).hide();
        $("#register").show(300);
        $(document.getElementById("settings")).hide();
        $("#random_btn").css("display", "none");
        $('#score_time_life').css('display', 'none');
        $("#footer").css("position","fixed");
        stopSong();
    });
});


/* form[name=Registration Handler */
$(function() {
    $.validator.addMethod("lettersonly", function(value, element) {
        return this.optional(element) || /^[a-z]+$/i.test(value);
    }, "Letters only please");

    $.validator.addMethod("alphanumeric", function(value, element) {
        return this.optional(element) || /^.*(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/i.test(value);
    }, "Please use with letters and numbers");

    // Initialize form validation on the registration form.
    // It has the name attribute "registration"
    $("form[name='registration']").validate({
        // Specify validation rules
        rules: {
            user_name: "required",
            user_password: {
                required: true,
                minlength: 6,
                alphanumeric: true,
            },
            userFirstName: {
                required: true,
                lettersonly: true
            },
            userLastName: {
                required: true,
                lettersonly: true
            },
            userMail: {
                required: true,
                email: true
            },
            birthday: "required",
        },
        // Specify validation error messages
        messages: {
            user_name: "Username is required",
            user_password: {
                required: "Password is required",
                minlength: "Password length should be 6",
                maxlength: "Password length should be 6"
            },
            userFirstName: {
                required: "First name is required",
                lettersonly: "First name should contains only letters"
            },
            userLastName: {
                required: "Last name is required",
                lettersonly: "Last name should contains only letters"
            },
            userMail: {
                required: "Email is required",
                email: "Please enter a valid email address"
            },
            birthday: "Birthday is required",
        },
        submitHandler: function(form) {
            // alert("Hi");
            insertUserToDB();
            // form.submit();
        },
        invalidHandler: function(event, validator) {
            alert("Please check your registration values!")
        }
    });
});


function insertUserToDB() {
    var user_name = document.getElementById("user_name").value;
    var password =  document.getElementById("user_password").value;
    var firstName = document.getElementById("userFirstName").value;
    var lastName = document.getElementById("userLastName").value;
    var userMail = document.getElementById("userMail").value;
    var date = document.getElementById("birthday").value;
    if (localStorage.getItem(user_name) === null) {
        let data = {
            userName: user_name,
            userPassword: password,
            firstName: firstName,
            lastName: lastName,
            mail: userMail,
            birthDay: date
        };
        document.forms[0].reset();
        let str = JSON.stringify(data);
        localStorage.setItem(user_name, str);
        $('#register').css('display', 'none');
        $("#loading_img").css("display","block");
        setTimeout(displaySettings,2000);
        playerName = userMail;
    }
    else {
        alert("this user already exist");
    }
}


function validateUserPassword() {
    let userName = document.getElementById("name").value;
    let userPassword = document.getElementById("userPassword").value;
    let originalData = localStorage.getItem(userName);
    console.info(originalData);
    if (originalData === null || userName === "" || userPassword ==="") {
        alert("You must fill all the labels before you enter the game");
    }
    else {
        let dataObj = JSON.parse(originalData);
        let psd = dataObj.userPassword;
        let name = dataObj.userName;
        if (userName === name && userPassword === psd) {
            $('#login').css('display', 'none');
            $("#loading_img").css("display","block");
            setTimeout(displaySettings,2000);
            playerName = userName;
        }
    }
}


function aboutModalHandler() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";  // display "about" modal
    /*close modal by:
    * 1. clicking the "x" button
    * 2. clicking anywhere outside the modal
    * 3. clicking the Esc button */
    window.onclick = function (event) { //clicks anywhere -> close modal
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
    var span = document.getElementById("closeAbout") // clicking the "x" button -> close modal
    span.onclick = function () {
        modal.style.display = "none";
    }
    document.onkeydown = function (event) { // clicking the Esc button -> close modal
        var x = event.keyCode;
        if (x === 27) {
            modal.style.display = "none";
        }
    };
}

function showRegistration() {
    clearIntervals();
    $('#welcome').css("display", "none");
    $(document.getElementById("about")).hide();
    $(document.getElementById("login")).hide();
    $(document.getElementById("register")).show();
    $("#register").show(300);
}

/*###################################################################################*/


function playSong() {
    /*
        gameSong.play();
    */
}

function stopSong() {
    /*
        gameSong.pause();
    */
}

function initGame() {
    clearIntervals();
    $("#timeAlert").css("display", "none");
    calculateCellSize();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context = canvas.getContext("2d");
    food_remain = parseInt($(document.getElementById("food")).val());
    monster_remain = parseInt($(document.getElementById("monsters")).val());
    timeToPlay = parseInt($(document.getElementById("setTime")).val());
    pacmanRight = true;
    pacmanLeft = false;
    pacmanUp = false;
    pacmanDown = false;
    extra_food = 1;
    clock = 1;
    if(lives === 6){
        removeLifeIcon(6);
    }
    lives = 5;
    extra_life = 1;
    displayLifeIcons();
    clearIntervals();
    Start();
    Draw();
    playSong();
    return false;
}

function UpdateExtraScorePosition() {
    let currScorePositions = new Array();
    for (var i = 0; i < 15; i++) {
        currScorePositions[i] = new Array();
        for (var j = 0; j < 15; j++) {
            currScorePositions[i][j] = 0;
            if(boardExtraScore[i][j] === 8){
                currScorePositions[i][j] = 8;
            }
        }
    }
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            if(currScorePositions[i][j] === 8) {
                notMove = true;
                //monster get down
                while(notMove) {
                    var randomNum = Math.floor(Math.random() * 4);/*0,1*/
                    if (randomNum === 0  && i+1 >= 0 && i+1 <= 14 && board[i + 1][j] !== 4 && MonstersRHere[i + 1][j] !== 9) {
                        boardExtraScore[i][j] = 0;
                        boardExtraScore[i + 1][j] = 8;
                        notMove = false;
                    }
                    else if (randomNum === 1 && i-1 >= 0 && i-1 <= 14 && board[i - 1][j] !== 4 && MonstersRHere[i - 1][j] !== 9) {
                        boardExtraScore[i][j] = 0;
                        boardExtraScore[i - 1][j] = 8;
                        notMove = false;
                    } else if (randomNum === 2 && j+1 >= 0 && j+1 <= 14 && board[i][j + 1] !== 4 && MonstersRHere[i][j + 1] !== 9) {
                        boardExtraScore[i][j] = 0;
                        boardExtraScore[i][j + 1] = 8;
                        notMove = false;
                    } else if (randomNum === 3 && j-1 >= 0 && j-1 <= 14 && board[i][j - 1] !== 4 && MonstersRHere[i][j - 1] !== 9) {
                        boardExtraScore[i][j] = 0;
                        boardExtraScore[i][j - 1] = 8;
                        notMove = false;
                    }
                }
            }
        }
    }
}


function alertNote(note,timeToAlert) {
    setTimeout(function () {
        alert(note);
    }, timeToAlert);
}

function continueGameLifeDown() {
    $("#timeAlert").css("display", "none");
    removeLifeIcon(lives);
    lives--;
    monster_remain = parseInt($(document.getElementById("monsters")).val());
    lives = false;
    pacman_remain = 1;
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            if(board[i][j] === 2){
                board[i][j] = 0;
            }
            MonstersRHere[i][j] = 0;
            if(monster_remain > 0 && ((i === 0 && j === 0) || (i === 14 && j === 0) || (i === 14 && j === 14) || (i === 0 && j === 14))){
                MonstersRHere[i][j] = 9;
                monster_remain--;
            }
        }
    }
    if(pacman_remain > 0 ){
        var emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = 5;
        shape.i = emptyCell[0];
        shape.j = emptyCell[1];
        pacman_remain--;
    }

    clearIntervals();

    intervals.push(setInterval(UpdatePacmanPosition, 150));
    intervals.push(setInterval(UpdateMonsterPosition, 500));
    intervals.push(setInterval(UpdateExtraScorePosition, 500));
}

function stop_soundEffect() {
    StopSoungEffects = true;
}


function gameOver() {
    for (var i = 0; i < lines; i++) {
        for(var j = 0; j < columns; j++){
            if(board[i][j] === 1 || board[i][j] === 6 || board[i][j] === 7){
                return false;
            }
        }
    }
    return true;
}