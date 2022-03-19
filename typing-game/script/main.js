const wordInput = document.querySelector(".word-input");
const wordDisplay = document.querySelector(".word-display");
const scoreDisplay = document.querySelector(".score");
const timeDisplay = document.querySelector(".time");
const button = document.querySelector(".button");

const GAME_TIME = 10;
let score = 0;
let time = GAME_TIME;
let isPlaying = false;
let timeInterval;
let checkInterval;
let words = [];

init();

function init() {
    buttonChange('게임 로딩중 ...');
    getWords();
    wordInput.addEventListener('input', checkMatch);
}

function checkStatus() {
    if(!isPlaying && time === 0) {
        buttonChange('게임시작');
        clearInterval(checkInterval);
    }
}

// 단어 불러오기
async function getWords () {
    await axios.get('https://random-word-api.herokuapp.com/word?number=100')
        .then(function (response) {
            // 성공 핸들링
            response.data.forEach(word => {
                if(word.length < 10){
                    words.push(word);
                }
            })

            buttonChange('게임시작');
        })
        .catch(function (error) {
            // 에러 핸들링
            console.log(error);
        });
}

// 단어일치 확인
function checkMatch() {
    const value = wordInput.value.toLowerCase();
    const displayValue = wordDisplay.innerText.toLowerCase();
    
    if(value === displayValue) {
        wordInput.value = "";

        if (!isPlaying) {
            return; 
        };

        score++;
        scoreDisplay.innerText = score;
        time = GAME_TIME;
        const randomIndex = Math.floor(Math.random() * words.length);
        wordDisplay.innerText = words[randomIndex];
    }
}

// 게임 실행
function run () {
    if (isPlaying) {
        return;
    }
    isPlaying = true;
    time = GAME_TIME;
    wordInput.focus();
    scoreDisplay.innerText = 0;
    timeInterval = setInterval(countDown, 1000);
    checkInterval = setInterval(checkStatus, 50);
    buttonChange('게임 중');
}

function countDown() {
    time > 0 ? time-- : isPlaying = false;
    if (!isPlaying) {
        clearInterval(timeInterval);
    }

    timeDisplay.innerText = time;
}

function buttonChange(text) {
    button.innerText = text;
    text === "게임시작" ? button.classList.remove('loading') : button.classList.add('loading');
};