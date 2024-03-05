//Spiller trykker START
document.getElementById("startgame").addEventListener("click", ()=> {

    // GLOBALE VARIABLER
    /* FOR CONTAINEREN SPILLET ER I */
    var gameDisplay = document.getElementById("game-container");
    /* For Flappy Bird sprite */
    var bird = document.getElementById("bird");
    let birdLeft = 80;
    let birdBottom = 250;
    let velocityY = 35;
    let gravity = 1.5;
    var flySound = new Audio('flap.wav');
    var fail = new Audio('fail.wav');
    var succs = new Audio('succs.wav');

    /* START OG RESTART */
    var startButton = document.getElementById("startgame");
    var restart = document.getElementById("restart-container");
    
    /* SCORE OG GAME STATUS */
    var isGameOver = false;
    var score = 0;
    
    //Flappy bird starter fra en bestemt position og begynder at falde
    function startGame(){
        startButton.style.display = "none";
        
        bird.style.display = "block";
        birdBottom -= gravity;
        bird.style.bottom = birdBottom + "px"; 
        bird.style.left = birdLeft + "px";
        console.log(document.getElementById('bird').style.bottom);
            
    }  let gameTimerId = setInterval(startGame, 20);
    
    document.addEventListener("keyup", control);
    function control(e) {
        if (e.keyCode === 32) {
            fly();
        }
    }

    
    function fly() {
        if (birdBottom < 450) {
            flySound.play();
            birdBottom += velocityY;
            bird.style.bottom = birdBottom + "px";
            var direction = 0;
            bird.style.transform = "rotate(" + (direction - 45) + "deg)";
            setTimeout(() => {
                bird.style.transform = "rotate(" + (direction += 0.5) + "deg)";
            }, 200);
            
        } 

    }
    

    function generateObstacles() {
        let pipeLeft = 900;
        let randomHeight = Math.random() * 150;
        let pipeBottom = randomHeight;
        var gap = 400;
        var pipe = document.createElement('div');
        var topPipe = document.createElement('div');
        if (!isGameOver) {
            pipe.classList.add('pipe');
            topPipe.classList.add('topPipe');
        }
        gameDisplay.appendChild(topPipe);
        topPipe.style.bottom = pipeBottom + gap + "px";
        topPipe.style.left = pipeLeft + "px";
        gameDisplay.appendChild(pipe);
        pipe.style.bottom = pipeBottom + "px";
        pipe.style.left = pipeLeft + "px";

        function moveObstacle() {
            pipeLeft -= 2;
            pipe.style.left = pipeLeft + "px";
            topPipe.style.left = pipeLeft + "px";

            if (pipeLeft === -80) {
                gameDisplay.removeChild(pipe);
                gameDisplay.removeChild(topPipe);
            }

            /* VARIABLER FOR DYNAMISK COLLISION DETECTION */
            var pipeCollisionDetectLeft = parseInt(window.getComputedStyle(pipe).getPropertyValue("left"));
            var pipeCollisionDetectBottom = parseInt(window.getComputedStyle(pipe).getPropertyValue("bottom"));
            var topPipeCollisionDetectLeft = parseInt(window.getComputedStyle(topPipe).getPropertyValue("left"));
            var topPipeCollisionDetectBottom = parseInt(window.getComputedStyle(topPipe).getPropertyValue("bottom"));
            var birdBottomDetection = parseInt(window.getComputedStyle(bird).getPropertyValue("bottom"));
            
            if (pipeLeft < 115 && pipeLeft > 50 && birdLeft === 80 &&
                (birdBottom < pipeBottom + 138 || birdBottom > pipeBottom + gap - 200)||
                birdBottom === -12) {
                fail.play();
                clearInterval(gameTimerId);
                gameDisplay.removeChild(pipe);
                gameDisplay.removeChild(topPipe);
                pipe.style.display = "none";
                topPipe.style.display = "none";
                gameOver();
            }

            if (birdBottomDetection > pipeCollisionDetectBottom && birdBottom < topPipeCollisionDetectBottom && birdLeft == pipeCollisionDetectLeft && birdLeft == topPipeCollisionDetectLeft){
                score += 1;
                document.querySelector(".score").innerHTML = "Score: " + score;
                succs.play();
            }

        }
        let gameTimerId = setInterval(moveObstacle, 20); 
        if (!isGameOver) setTimeout(generateObstacles, 3000);

    }
    generateObstacles();

    function gameOver() {
        clearInterval(gameTimerId);
        isGameOver = true;
        document.removeEventListener('keyup', control);
        restart.style.display = "block";
        document.getElementById("endscore").innerHTML = "Score: " + score;
    }
    document.getElementById("restartgame").addEventListener("click", reset);

    function reset(){
        score = 0;
        location.reload();
    }
    
})
