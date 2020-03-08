const pokemonRepository = (function() {
  const repository = [];

  // hide initially. bootstrap only sets the opacity to 0 and then
  // still blocks the clicks on buttons behind it
  const $bsModal = $("#pokemon-modal").hide();
  const $pokemonList = $("ul");
  const apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  function loadList() {
    return fetch(apiUrl)
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else {
          throw "Something went wrong when loading the list.";
        }
      })
      .then(function(json) {
        json.results.forEach(function(item) {
          add({ name: item.name, detailsUrl: item.url });
        });
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  function addListItem(pokemon) {
    var $button = $(
      '<button type="button" class="list-group-item list-group-item-action" data-toggle="modal" data-target="#pokemon-modal">'
    )
      .text(pokemon.name)
      .appendTo("#pokemonList");

    $button.on("click", function() {
      showDetails(pokemon);
    });
  }

  function showDetails(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function() {
      showModal(pokemon);
    });
  }

  function add(item) {
    repository.push(item);
  }

  function getAll() {
    return repository;
  }

  function loadDetails(item) {
    const url = item.detailsUrl;
    return fetch(url)
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else {
          throw "Something went wrong when loading details.";
        }
      })
      .then(function(details) {
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.weight = details.weight;
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  // handler to close the modal when clicking outside of it
  const clickHandler = e => {
    if (!$(e.target).closest("#pokemon-modal").length) hideModal();
  };

  // handler to close the modal on escape
  const keydownHandler = e => {
    if (e.key === "Escape" && $bsModal.hasClass("in")) hideModal();
  };

  function showModal(item) {
    var $nameElement = $("#pokemon-name").text(
      item.name.charAt(0).toUpperCase() + item.name.slice(1)
    );

    var $imageElement = $("#pokemon-image").attr("src", item.imageUrl);
    var $heightElement = $("#pokemon-height").text(
      "Height: " + item.height + "m"
    );
    var $weightElement = $("#pokemon-weight").text(
      "Weight: " + item.weight + "kg"
    );

    // Click outside of the modal to close it
    $(window).on("click", clickHandler);
    $(window).on("keydown", keydownHandler);
  }

  //close the modal
  function hideModal() {
    $bsModal.modal("hide");
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    showDetails: showDetails,
    loadList: loadList,
    loadDetails: loadDetails,
    showModal: showModal,
    hideModal: hideModal
  };
})();

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
