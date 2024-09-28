import { Pokemon } from "./Pokemon.ts";

export default class PokemonCard extends HTMLElement {
  private pokemon: Pokemon;

  constructor(pokemon: Pokemon) {
    super();
    this.pokemon = pokemon;
    this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        .card {
          border: 1px solid #ddd;
          padding: 16px;
          text-align: center;
          cursor: pointer;
          width: 150px;
          background-color: #f8f8f8;
        }
        img {
          max-width: 100px;
        }
        h2 {
          font-size: 18px;
          margin: 8px 0;
        }
        p {
          font-size: 14px;
        }
      </style>
      <div class="card">
        <h2>${this.pokemon.name}</h2>
        <p>${this.pokemon.types
          .map((type) => `<span>${type.type.name}</span>`)
          .join(", ")}</p>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${
          this.pokemon.id
        }.png" />
      </div>
    `;
  }

  getPokemon() {
    return this.pokemon;
  }
}

customElements.define("pokemon-card", PokemonCard);
