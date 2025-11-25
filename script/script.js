import { Game } from "./Game.js";
import { Card } from "./Card.js"
import { Pair } from "./Pair.js"

let g = new Game();
g.createCards();

// lancement du jeu
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("startBtn").addEventListener("click", function () {
        // mélange les cartes
        g.randomizeCards();

        startGame()
    })
})

// affichage des cartes initial dans l'ihm
function displayCards(cards) {
    let html = ""
    for (let i in cards) {
        if (i % 4 == 0) {
            html += "<div class=\"row\">"
        }
        html += "<div class=\"carte col-3 mb-2\" data-rank=\"" + i + "\"><img src=\"resources/images/blank.png\"></div>"
        if (i % 4 == 3) {
            html += "</div>"
        }
    }
    return html;
}

function startGame() {
    let first_img;
    let sec_img;
    let compteur = 0
    // va stocker la paire de cartes selectionnées
    let p;
    // flag qui permet de désactiver les reactions du listener sur les cartes si deux cartes sont retournées, pour éviter de retourner une troisième carte
    let canClick = true;
    // réinitialisation du champ d'affichage des coups et d'alerte de fin de partie
    document.getElementById("win").innerText = ""
    updateCounts()
    document.getElementById("jeu").innerHTML = displayCards(g.cards)
    document.querySelectorAll(".carte").forEach(element => {
        element.addEventListener("click", function () {
            // ignore la reaction
            if (!canClick) return;
            // compteur verifie si la carte cliquée est la n°1 ou n°2
            compteur++;
            // recupère le numero de la carte 
            let id = element.getAttribute("data-rank");
            if (compteur == 1) {
                // "retourne" la carte
                first_img = element.querySelector("img");
                first_img.setAttribute("src", g.cards[id].real_image)
                p = new Pair();
                // ajoute carte a la paire temporaire
                p.firstCard = g.cards[id]
            } else if (compteur == 2) {
                // si deux cartes retournées, on désactive la reaction
                canClick = false
                sec_img = element.querySelector("img");
                sec_img.setAttribute("src", g.cards[id].real_image)
                // ajout de la deuxieme carte a la paire temporaire
                p.secondCard = g.cards[id]
                // réinitialise le compteur
                compteur = 0;

                // si les deux cartes de la paire son correctes, on l'ajout à la liste des paires faites par l'utilisateur
                if (p.isCorrect()) {
                    g.addCorrectPair(p)
                    canClick = true
                } else {
                    // sinon on retourne les cartes après 2sec et le jeu continue
                    setTimeout(() => {
                        first_img.setAttribute("src", "resources/images/blank.png")
                        sec_img.setAttribute("src", "resources/images/blank.png")
                        // reactivation des réactions
                        canClick = true
                    }, 2000);
                }
                g.incCount()
                if (g.pairsMade.length == 8) {
                    console.log("game ended with " + g.count + " tries")
                }
                // affichage du nombre d'essai
                updateCounts()

                if (g.pairsMade.length == 8) {
                    stopGame()
                }
            }

        })
    });
}

// fonction qui affiche le nombre d'essais et le score dans l'ihm
function updateCounts() {
    document.getElementById("count").innerText = g.count
    document.getElementById("score").innerText = g.pairsMade.length
}

function stopGame() {
    document.getElementById("win").innerText = "Bravo ! Vous avez gagné la partie avec " + g.count + " coups."
}