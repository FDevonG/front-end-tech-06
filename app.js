const keyboard = document.querySelector('#qwerty');
const phrase = document.querySelector('#phrase');

const overlay = document.querySelector('#overlay');

const tries = document.querySelectorAll('.tries img');

let missed = 0;

const phrases = [
    'Take it easy',
    'When pigs fly',
    'Needle in a haystack',
    'Get the upper hand',
    'Make no bones about',
];

document.querySelector('.btn__reset').addEventListener('click', () => {
    setGameUp();
});

keyboard.addEventListener('click', (event) => {
    if(event.target.tagName === 'BUTTON'){
        event.target.classList.add('chosen');
        handleInteraction(event.key.toUpperCase());
    }
});

window.addEventListener('keyup', e => {
	if(overlay.style.display !== 'none'){
		return;
	}
	const regex = /[a-z]/i;
	if(regex.test(e.key)){
		document.querySelectorAll('#qwerty button').forEach(button => {
			if(button.textContent.toUpperCase() === e.key.toUpperCase()){
				button.classList.add('chosen');
			}
		});
		
		handleInteraction(e.key.toUpperCase());
	}
});

/**
 * Retrieves a user by email.
 * @function
 * @param {String} letter- the letter to check the phrase for
 */
function handleInteraction(letter){
	const letterFound = checkLetter(letter);
	if(letterFound === null){
		tries[missed].src = 'images/lostHeart.png';
		missed++;
	}
	checkWin();
}

/**
 * Sets the game up for play by hiding the overlay, and setting the phrase up
 *
 */
function setGameUp(){
    removeClass('chosen');
    resetPhrase();
    addPhraseToDisplay(getRandomPhraseAsArray(phrases));
    resetHearts();
    missed = 0;
    overlay.style.display = 'none';
}

/**
 * This removes a class from every item that has it applied
 *
 */
function removeClass(className){
    const chosenKeys = document.querySelectorAll(`.${className}`);
    for (let i = 0; i < chosenKeys.length; i++) {
        chosenKeys[i].classList.remove(`${className}`);
    }
}

/**
 * This removes the phrase items from the ul element so we can spawn a fresh one
 *
 */
function resetPhrase(){
    const letters = document.querySelectorAll('#phrase ul li');
    for (let i = 0; i < letters.length; i++) {
        letters[i].remove();
    }
}

/**
 * This makes all the heart images live again
 *
 */
function resetHearts(){
    for (let i = 0; i < tries.length; i++){
        tries[i].src = 'images/liveheart.png';
    }
}

/**
 * This selects an element out of an array and returns it split up into an array of characters
 *
 * @param {array} arr - the array to find the phrase in
 * @returns {array} -The selected phrase split into an array of characters
 */
function getRandomPhraseAsArray(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex].split("");
}

/**
 * Takes an array of characters and creates an html string to display on screen
 *
 * @param {array} arr - the array of characters to display
 */
function addPhraseToDisplay(arr){
    let html;
    for (let i = 0;i < arr.length; i++) {
        html = document.createElement('li');
        html.textContent = arr[i];
        if (arr[i] !== " "){
            html.className = 'letter';
        } else {
            html.className = 'space';
        }
        phrase.firstElementChild.append(html);
    }
}

/**
 * When the keyboard buttons are clicked this checks the corresponding letter to see if that letter is in the phrase. if it is they all get revealed, if not, the player loses a heart
 *
 * @param {String} - the letter to check for
 */
function checkLetter(letter){
    const letters = document.querySelectorAll('.letter');
    let letterFound;
    for (let i = 0; i < letters.length; i++){
        if(letters[i].textContent.toUpperCase() === letter){
            letterFound = letters[i].textContent;
            letters[i].classList.add('show');
        } 
    }
    if (letterFound === undefined)
        return null;
    else 
        return letterFound;

}

/**
 * this compares the elements with the class letter and the class show, if they are the same then the player wins, if then number of misses is 5 or greater then the player loses
 *
 */
function checkWin(){
    const letters = document.querySelectorAll('.letter');
    const shown = document.querySelectorAll('.show');

    if(letters.length === shown.length) {
        overlay.className = 'win';
        turnOnOverlay(`<p class="message">Congratulations, you have won!</p>`);
    }
    else if (missed >= 5) {
        overlay.className = 'lose';
        turnOnOverlay(`<p class="message">you are out of tries!</p>`);
        
    }
}

/**
 * when the player has one or lost this takes a messaged oassed to it and inserts it into the overlay after checking for and deleting an existing one and then turns the display on
 *
 * @param {htmlString} - the message to be inserted into the dom
 */
function turnOnOverlay(htmlString){
    if (document.querySelector('.message')) {
        overlay.removeChild(document.querySelector('.message'));
    }
    document.querySelector('.title').insertAdjacentHTML('afterend', htmlString);
    overlay.removeAttribute('style');
}