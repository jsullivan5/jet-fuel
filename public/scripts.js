
$(document).ready(() => {
  fetch('api/v1/folders')
    .then(response => response.json())
    .then(data => displayFolders(data))
});

// Event Listeners

$('#folder-select').change(handleFolderChange);
$('#new-link-submit').click(createLink);
$('#folder-submit').click(handleFolderSubmit);
$('#sort-select').change(reverseCardOrder);
$('#new-link-link, #new-link-name').on('input', enableLinkButton);
$('#folder-name').on('input', enableFolderSubmit);

// Folder functions

function displayFolders(data) {
  data.forEach(folder => {
    $('#folder-select').append(`
      <option id=${folder.id} value=${folder.id}>
        ${folder.name}
      </option>
    `);
  });
}

function handleFolderSubmit(event) {
  event.preventDefault();
  const $name = getNewFolderName();

  fetch('/api/v1/folders', {
    method: 'POST',
    body: JSON.stringify($name),
    headers: { "Content-Type": "application/json" }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.name);
    $('#folder-select').append(`
      <option id=${data.id} value=${data.id}>
        ${data.name}
      </option>
    `);
    clearInputs($('#folder-name'));
    $('#folder-select').val(`${data.id}`);
    $('#folder-submit').prop('disabled', true);
  })
  .catch(error => console.log(error))
}

function handleFolderChange() {
  const $folderId = getFolderVal()

  removeDomNode($('.card'))

  if ($folderId === 0) {
    return
  }

  $('#sort-select').val('descending');


  fetch(`/api/v1/folders/${$folderId}/links`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((link) => {
        $('#user-links').prepend(generateCard(link.description, link.short_URL, link.created_at))
      });
    })
    .then(() => {
      $('#user-links').focus().addClass('transition');
    })
    .catch(error => console.log(error))
}

function createLink() {
  event.preventDefault();
  const folderId = getFolderVal();
  const linkInputs = getNewLinkInputs();

  if (!validateURL(linkInputs.link)) {
    clearInputs($('#new-link-link'))
    $('.url-error').show()
    $('#new-link-link').focus()
    return
  }

  fetch('/api/v1/links', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      long_URL: linkInputs.link,
      description: linkInputs.name,
      folder_id: folderId
      })
    })
    .then(response => response.json())
    .then(link => {
      $('#user-links').prepend(generateCard(link.description, link.short_URL, link.created_at))
      clearInputs($('#new-link-link'));
      clearInputs($('#new-link-name'));
      $('#new-link-submit').prop('disabled', true)
      $('.url-error').hide();
    })
    .catch(error => console.log(error))
}

// Get input values

function getNewLinkInputs() {
  const $name = $('#new-link-name').val();
  const $link = $('#new-link-link').val();

  return {
    name: $name,
    link: $link
  }
}

function getNewFolderName() {
  const $nameValue = $('#folder-name').val();

  return { name: $nameValue }
}


function getFolderVal(){
  const $folderId = $('#folder-select').val()

  return $folderId
}

// Helper functions

function clearInputs($input) {
  $input.val('');
}

function removeDomNode($input) {
  $input.remove();
}

function validateURL(url) {
  const regEx = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;

  if (!regEx.test(url)) {
    return false;
  } else {
    return true
  }
}

function formatDate(date) {
  return moment(date).format('MMMM Do YYYY, h:mm a');
}

function reverseCardOrder() {
    const $container = $('#user-links');
    const $cards = $container.children('.card');
    $container.append($cards.get().reverse());
}

function enableLinkButton() {
  $('#new-link-link').val() !== '' && $('#new-link-name').val() !== '' ? $('#new-link-submit').prop('disabled', false) : $('#new-link-submit').prop('disabled', true);
}

function enableFolderSubmit() {
  console.log('working');
  $('#folder-submit').val() !== '' ? $('#folder-submit').prop('disabled', false) : $('#folder-submit').prop('disabled', true);
}

function generateCard(description, shortUrl, date) {
  return `<div class="card">
        <div class="card-divider-description">
          <p>${description}</p>
        </div>
        <div class="card-divider">
          <a href="/${shortUrl}" class="short-link">
            ${shortUrl}
          </a>
        </div>
        <div class="card-divider">
          <p>${formatDate(date)}</p>
        </div>
      </div>`
}
