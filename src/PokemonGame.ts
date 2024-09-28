import { Pokemon } from "./Pokemon.ts";
import PokemonCard from "./PokemonCard.ts";

class PokemonsGame extends HTMLElement {
  private playerA: Pokemon[] = [];
  private playerB: Pokemon[] = [];
  private gameArea: HTMLElement;
  private currentPlayer: "A" | "B" = "A";

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.gameArea = document.createElement("div");
    this.gameArea.classList.add("game-area");
    this.init();
  }

  async init() {
    await this.fetchPokemons();
    this.render();
  }

  async fetchPokemons() {
    const fetchPokemon = async (): Promise<Pokemon> => {
      const id = Math.floor(Math.random() * 150 + 1);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();
      return {
        id: data.id,
        name: data.name,
        types: data.types,
      };
    };

    const promises = Array.from({ length: 10 }, () => fetchPokemon());
    const pokemons = await Promise.all(promises);

    this.playerA = pokemons.slice(0, 5);
    this.playerB = pokemons.slice(5);
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        .game {
          display: grid;
          grid-template-rows: auto auto auto;
          gap: 16px;
        }
        .row {
          display: flex;
          justify-content: space-around;
        }
        .game-area {
          height: 210px;
          width:100%;
          border: 2px dashed #ccc;
          display: flex;
          justify-content: center;
          align-items: center;

        }
      </style>
      <div class="game">
        <div class="row player-a"></div>
        <div class="game-area"></div>
        <div class="row player-b"></div>
      </div>
    `;

    this.renderPokemons();
    this.shadowRoot!.querySelector(".game-area")!.appendChild(this.gameArea);
  }

  renderPokemons() {
    const playerARow = this.shadowRoot!.querySelector(".player-a")!;
    const playerBRow = this.shadowRoot!.querySelector(".player-b")!;

    playerARow.innerHTML = "";
    playerBRow.innerHTML = "";

    this.playerA.forEach((pokemon) => {
      const card = new PokemonCard(pokemon);
      card.addEventListener("click", () => this.playPokemon(card, "A"));
      playerARow.appendChild(card);
    });

    this.playerB.forEach((pokemon) => {
      const card = new PokemonCard(pokemon);
      card.addEventListener("click", () => this.playPokemon(card, "B"));
      playerBRow.appendChild(card);
    });
  }
  count: number = 0;
  playPokemon(card: PokemonCard, player: string) {
    if (player === this.currentPlayer) {
      if (this.gameArea.children.length < 2) {
        this.gameArea.appendChild(card);
        card.removeEventListener("click", () =>
          this.playPokemon(card, this.currentPlayer)
        );
        this.currentPlayer = this.currentPlayer === "A" ? "B" : "A";
      }
      if (this.gameArea.children.length === 2) {
        this.count += 1;
        setTimeout(() => {
          alert(`Fim da rodada ${this.count}!`);
          this.gameArea.innerHTML = "";
          if (this.count === 5) {
            alert("O jogo acabou!");
          }
        }, 1000);
      }
    } else {
      alert(`É a vez do jogador ${this.currentPlayer}`);
    }
  }
}

customElements.define("pokemons-game", PokemonsGame);
