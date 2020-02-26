const pokemonRepository = (function() {
  const repository = [];
  const $modalContainer = $('#modal-container');
  const $pokemonList = $("ul");
  const apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  function loadList() {
    return fetch(apiUrl)
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else {
          throw 'Something went wrong when loading the list.';
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
    var $listItem = $("<li>");
    var $button = $("<button>");
    $button.text(pokemon.name);
    $button.addClass("pokemon-name");
    $listItem.append($button);
    $pokemonList.append($listItem);
    $button.on('click', function() {
      showDetails(pokemon);
    });
  }

  function showDetails(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function () {
      showModal(pokemon);
    });
  };

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
          throw 'Something went wrong when loading details.';
        }
      })
      .then(function(details) {
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  // handler to close the modal when clicking outside of it
  const clickHandler = e => {
    if (!$(e.target).closest('#modal').length) hideModal();
  }

  // handler to close the modal on escape
  const keydownHandler = e => {
    if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')) hideModal();
  }

  function showModal(item) {
   $modalContainer.empty();
   var $modal = $('<div>');
   $modal.addClass('modal');
   $modal.attr("id", "modal");

   var $closeButtonElement = $('<button>');
   $closeButtonElement.addClass('modal-close');
   $closeButtonElement.text('Close');
   $closeButtonElement.on('click', hideModal);

   var $nameElement = $('<h1>').text(item.name.charAt(0).toUpperCase() + item.name.slice(1));

   var $imageElement = $('<img class="modal-img" src="'+item.imageUrl+'">');

   var $heightElement = $('<p>').text('Height: ' + item.height + 'm');

   $modal.append($closeButtonElement);
   $modal.append($nameElement);
   $modal.append($imageElement);
   $modal.append($heightElement);
   $modalContainer.append($modal);

    $modalContainer.addClass('is-visible');

    // Click outside of the modal to close it
    $(window).on('click', clickHandler)
    $(window).on('keydown', keydownHandler)
  };

  //close the modal
  function hideModal() {
    $modalContainer.removeClass('is-visible');
    $modalContainer.empty();
    $(window).off('click', clickHandler);
    $(window).off('keydown', keydownHandler)
  };


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
