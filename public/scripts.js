$(document).ready(() => {
  fetch('api/v1/folders')
    .then(response => response.json())
    .then(data => displayFolders(data))
})

// Event Listeners

$('#folder-select').change(handleFolderChange);
$('#new-link-submit').click(createLink);
$('#folder-submit').click(handleFolderSubmit);

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
    $('#folder-select').append(`<option id=${data.id} value=${data.id}>${data.name}</option>`)
  })
  .catch(error => console.log(error))
}

function handleFolderChange() {
  const folderId = getFolderVal()

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
              <p>${link.short_URL}</p>
              <p>${link.created_at}</p>
            </div>
          `);
      });
    })
    .catch(error => console.log(error))

}



function createLink() {
  const folderId = getFolderVal();
  const linkInputs = getNewLinkInputs();

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
            <p>${link.short_URL}</p>
            <p>${link.created_at}</p>
          </div>
        `);
    })
    .catch(error => console.log(error))
}
