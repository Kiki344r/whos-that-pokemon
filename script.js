const audio = new Audio("./whos-that-pokemon.mp3")

const modal_1 = document.getElementById("modal-1")

const Start_Game_Button = document.getElementById("start_game");
const submit_button = modal_1.querySelector(".guess-submit");

const input_name = modal_1.querySelector(".guess-value");

const pokemon_image_dom = document.querySelector(".pokemon-image")

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 5;

let pokemon_name;
let pokemon_cries;

function Start_Game() {
    pokemon_image_dom.classList.add('hidden');
    pokemon_image_dom.style.filter = 'brightness(0)';

    const randomIndex = Math.floor(Math.random() * 151);
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${randomIndex}`;

    fetch(pokemonUrl)
        .then(response => response.json())
        .then(data => {
            const name = data.name;
            const imageUrl = data.sprites.other['official-artwork'].front_default;

            pokemon_name = name.toLowerCase();
            pokemon_image_dom.src = imageUrl;
            pokemon_cries = data.cries.latest;

            console.log("Pokemon Name: ", pokemon_name);

            audio.play()
            modal_1.classList.add("hidden")

            setTimeout(() => {
                modal_1.classList.remove("hidden");
            }, 3000);

        })
        .catch(error => console.error("Error fetching Pokemon:", error));
}

function verifyPokemon(guess_name) {

    if (guess_name.includes(pokemon_name)) {

        console.log("Correct!");
        const cries = new Audio(pokemon_cries);
        cries.volume = 0.5;
        cries.play().then(() => {
            setTimeout(() => {
                Start_Game()
            }, 2000);
        }).catch((error) => {
            console.error("Error playing cries:", error);
        });

        pokemon_image_dom.style.filter = 'brightness(1)';

        modal_1.classList.add("hidden");

        return true

    } else {
        console.log("Wrong!");
        pokemon_image_dom.classList.add('shake');
        setTimeout(() => {
            pokemon_image_dom.classList.remove('shake');
        }, 300);
        return false
    }

}

pokemon_image_dom.onload = function () {
    pokemon_image_dom.classList.remove('hidden');
};

document.addEventListener("DOMContentLoaded", async function () {

    Start_Game_Button.addEventListener("click", function () {
        console.log("Start Game Button Clicked");
        Start_Game_Button.classList.add("hidden");
        document.getElementById("game").classList.remove("hidden");
        Start_Game();
        recognition.start()
    });

    submit_button.addEventListener("click", function () {

        verifyPokemon(input_name.value.toLowerCase());

    });

});

recognition.onstart = () => {
    console.log("Speech recognition started");
};

recognition.onresult = (event) => {
    const alternatives = event.results[0];
    for (let i = 0; i < alternatives.length; i++) {
        console.log("Tu as dit :", alternatives[i].transcript);
        if (verifyPokemon(alternatives[i].transcript.toLowerCase()) === true) {
            break
        } else {
            continue
        }
    }
};

recognition.onend = () => {
    console.log("Speech recognition ended");
    recognition.start()
}