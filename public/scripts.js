
$(document).ready(() => {
  fetch('api/v1/folders')
    .then(response => response.json())
    .then(data => displayFolders(data))
})

// Event Listeners

$('#folder-select').change(handleFolderChange);
$('#new-link-submit').click(createLink);
$('#folder-submit').click(handleFolderSubmit);
$('#sort-select').change(reverseCardOrder)

// Folder functions

function displayFolders(data) {
  data.forEach(folder => {
    $('#folder-select').append(`
      <option id=${folder.id} value=${folder.id}>
        ${folder.name}
      </option>
    `)
  })
}

function handleFolderSubmit(event) {
  event.preventDefault();
  const name = getNewFolderName()

  fetch('/api/v1/folders', {
    method: 'POST',
    body: JSON.stringify(name),
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
    $('#folder-select').val(`${data.id}`)
  })
  .catch(error => console.log(error))
}

function handleFolderChange() {
  const folderId = getFolderVal()

  removeDomNode($('.card'))

  if (folderId === 0) {
    return
  }

  fetch(`/api/v1/folders/${folderId}/links`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((link) => {
        $('#user-links').prepend(`
          <div class="card">
            <p>${link.description}</p>
            <a href="/${link.short_URL}" class="short-link">
              ${link.short_URL}
            </a>
            <p>${formatDate(link.created_at)}</p>
          </div>
        `);
      });
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
      $('#user-links').prepend(`
          <div class="card">
            <p>${link.description}</p>
            <a href="/${link.short_URL}" class="short-link">
              ${link.short_URL}
            </a>
            <p>${formatDate(link.created_at)}</p>
          </div>
        `);
      clearInputs($('#new-link-link'));
      clearInputs($('#new-link-name'));
      $('.url-error').hide();
    })
    .catch(error => console.log(error))
}

function shortLinkClick(event) {
  event.preventDefault()
  console.log('click event handler')
}

// Get input values

function getNewLinkInputs() {
  const name = $('#new-link-name').val();
  const link = $('#new-link-link').val();

  return {
    name,
    link
  }
}

function getNewFolderName() {
  const nameValue = $('#folder-name').val();

  return { name: nameValue }
}


function getFolderVal(){
  const folderId = $('#folder-select').val()

  return folderId
}

// Helper functions

function clearInputs(input) {
  input.val('');
}

function removeDomNode(input) {
  input.remove();
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
