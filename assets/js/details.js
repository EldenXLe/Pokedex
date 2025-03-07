document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonName = urlParams.get('name');

    if (pokemonName) {
        pokeApi.getPokemonByName(pokemonName).then((pokemon) => {
            document.querySelector('.pokemon-details h1').textContent = pokemon.name;
            document.querySelector('.pokemon-details .types').textContent = pokemon.types.join(' / ');
            document.querySelector('.pokemon-details .number').textContent = `#${pokemon.number}`;
            
            const pokemonImage = document.querySelector('.pokemon-image img');
            if (pokemonImage) {
                pokemonImage.src = pokemon.photo;
                pokemonImage.alt = pokemon.name;
            }

            // Preencher outras informações
            document.querySelector('.pokemon-info .species').textContent = `${pokemon.species}`;
            document.querySelector('.pokemon-info .height').textContent = ` ${pokemon.height} m`;
            document.querySelector('.pokemon-info .weight').textContent = `${pokemon.weight} kg`;
            document.querySelector('.pokemon-info .abilities').textContent = `${pokemon.abilities.join(', ')}`;

            // Adicionar informações de evolução
            document.querySelector('.pokemon-info .evolution-chain').textContent = `${pokemon.evolutionChain.join(' -> ')}`;
        });
    }
});