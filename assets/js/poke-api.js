const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;

    pokemon.types = types;
    pokemon.type = type;

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;
    pokemon.species = pokeDetail.species.name;
    pokemon.height = pokeDetail.height / 10;
    pokemon.weight = pokeDetail.weight / 10;
    pokemon.abilities = pokeDetail.abilities.map((ability) => ability.ability.name);

    return pokemon;
}

function getEvolutionChain(url) {
    return fetch(url)
        .then((response) => response.json())
        .then((evolutionData) => {
            const chain = [];
            let current = evolutionData.chain;

            while (current) {
                chain.push(current.species.name);
                current = current.evolves_to[0];
            }

            return chain;
        });
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then((pokeDetail) => {
            return fetch(pokeDetail.species.url)
                .then((response) => response.json())
                .then((speciesData) => {
                    return getEvolutionChain(speciesData.evolution_chain.url)
                        .then((evolutionChain) => {
                            const pokemon = convertPokeApiDetailToPokemon(pokeDetail);
                            pokemon.evolutionChain = evolutionChain;
                            return pokemon;
                        });
                });
        });
};

pokeApi.getPokemons = (offset = 0, limit = 12) => {
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails);
};

pokeApi.getPokemonByName = (name) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    return fetch(url)
        .then((response) => response.json())
        .then((pokeDetail) => {
            return fetch(pokeDetail.species.url)
                .then((response) => response.json())
                .then((speciesData) => {
                    return getEvolutionChain(speciesData.evolution_chain.url)
                        .then((evolutionChain) => {
                            const pokemon = convertPokeApiDetailToPokemon(pokeDetail);
                            pokemon.evolutionChain = evolutionChain;
                            return pokemon;
                        });
                });
        });
};