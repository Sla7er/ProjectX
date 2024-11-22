const gameContainer = document.getElementById("game-container");
const keyboardContainer = document.getElementById("keyboard");
const resetButton = document.getElementById("reset-button");
const messageElement = document.getElementById("message");

const wordToGuess = "APPLE"; // The target word
const maxAttempts = 6;
let currentRow = 0;

// Keyboard layout
const keyboardLayout = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
const keyStates = {}; // Tracks the state of each key (correct, present, absent)

// Initialize game grid
function createGrid() {
    for (let i = 0; i < maxAttempts; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        for (let j = 0; j < 5; j++) {
            const tile = document.createElement("input");
            tile.classList.add("tile");
            tile.type = "text";
            tile.maxLength = 1;
            tile.setAttribute("data-row", i);
            tile.setAttribute("data-col", j);
            row.appendChild(tile);
        }
        gameContainer.appendChild(row);
    }
}

// Initialize keyboard
function createKeyboard() {
    keyboardContainer.innerHTML = ""; // Clear existing keyboard
    keyboardLayout.forEach((key) => {
        const keyButton = document.createElement("div");
        keyButton.classList.add("key");
        keyButton.textContent = key;
        keyButton.setAttribute("data-key", key);
        keyboardContainer.appendChild(keyButton);
    });
}

// Update keyboard key states
function updateKeyboardState(key, state) {
    if (!keyStates[key] || state === "correct") {
        keyStates[key] = state;
    }
    const keyElement = document.querySelector(`.key[data-key="${key}"]`);
    if (keyElement) {
        keyElement.className = `key ${keyStates[key]}`;
    }
}

// Check guess and update tiles
function checkGuess(guess) {
    const tiles = document.querySelectorAll(`.tile[data-row="${currentRow}"]`);
    const wordArray = wordToGuess.split("");
    let tempWord = [...wordArray];

    // First pass: Check for correct positions
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === wordArray[i]) {
            tiles[i].classList.add("correct");
            tempWord[i] = null; // Mark as used
            updateKeyboardState(guess[i], "correct");
        }
    }

    // Second pass: Check for correct letters in wrong positions
    for (let i = 0; i < guess.length; i++) {
        if (!tiles[i].classList.contains("correct")) {
            if (tempWord.includes(guess[i])) {
                tiles[i].classList.add("present");
                tempWord[tempWord.indexOf(guess[i])] = null; // Mark as used
                updateKeyboardState(guess[i], "present");
            } else {
                tiles[i].classList.add("absent");
                updateKeyboardState(guess[i], "absent");
            }
        }
    }

    // Check win or lose condition
    if (guess === wordToGuess) {
        messageElement.textContent = "Congratulations! You guessed the word!";
        disableRow();
        return;
    }

    currentRow++;
    if (currentRow >= maxAttempts) {
        messageElement.textContent = `Game Over! The word was "${wordToGuess}".`;
        disableRow();
    } else {
        focusFirstTile(currentRow);
    }
}

// Reset game
resetButton.addEventListener("click", () => {
    // Clear the game state
    gameContainer.innerHTML = ""; // Clear the game grid
    keyboardContainer.innerHTML = ""; // Clear the keyboard
    Object.keys(keyStates).forEach(key => delete keyStates[key]); // Clear key states
    messageElement.textContent = ""; // Clear the message
    currentRow = 0; // Reset the current row

    // Recreate the game grid and keyboard
    createGrid();
    createKeyboard();
    focusFirstTile(0); // Focus on the first tile of the grid
});

function disableRow() {
    document.querySelectorAll(`.tile[data-row="${currentRow}"]`).forEach((tile) => {
        tile.disabled = true;
    });
}

function focusFirstTile(row) {
    const firstTile = document.querySelector(`.tile[data-row="${row}"][data-col="0"]`);
    firstTile.focus();
}

// Event listeners for typing
document.addEventListener("input", (event) => {
    const tile = event.target;
    if (tile.classList.contains("tile")) {
        const col = parseInt(tile.getAttribute("data-col"));
        const row = parseInt(tile.getAttribute("data-row"));
        if (col < 4) {
            const nextTile = document.querySelector(
                `.tile[data-row="${row}"][data-col="${col + 1}"]`
            );
            nextTile.focus();
        }
    }
});

document.addEventListener("keydown", (event) => {
    const activeTile = document.activeElement;
    if (!activeTile.classList.contains("tile")) return;

    const col = parseInt(activeTile.getAttribute("data-col"));
    const row = parseInt(activeTile.getAttribute("data-row"));

    // Handle backspace
    if (event.key === "Backspace" && activeTile.value === "") {
        if (col > 0) {
            const prevTile = document.querySelector(
                `.tile[data-row="${row}"][data-col="${col - 1}"]`
            );
            prevTile.focus();
            prevTile.value = "";
        }
    }

    // Handle Enter key
    if (event.key === "Enter") {
        const guess = Array.from(
            document.querySelectorAll(`.tile[data-row="${row}"]`)
        )
            .map((tile) => tile.value.toUpperCase())
            .join("");

        if (guess.length !== 5) {
            messageElement.textContent = "Please complete your guess.";
            return;
        }

        checkGuess(guess);
    }
});

// Initialize game
createGrid();
createKeyboard();
focusFirstTile(0);