$(document).ready(() => {
  fetch('api/v1/folders')
    .then(response => response.json())
    .then(data => displayFolders(data))
})

const displayFolders = (data) => {
  data.forEach(folder => {
    $('#folder-select').append(`
      <option id=${folder.id} value=${folder.id}>
        ${folder.name}
      </option>
    `)
  })
}


const getNewLinkInputs = () => {
  const name = $('#new-link-name').val();
  const link = $('#new-link-link').val();

  return {
    name,
    link
  }
}

const prependNewLink = (event) => {
  event.preventDefault();
  const userInputs = getNewLinkInputs()
  console.log('working', userInputs.name);

  $('#user-links').prepend(`<a href="#">${userInputs.name}</a>`)
}

// $('#new-link-submit').click(prependNewLink);

const getNewFolderName = () => {
  const nameValue = $('#folder-name').val();

  return { name: nameValue }
}

const handleFolderSubmit = (event) => {
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

$('#folder-submit').click(handleFolderSubmit)

const getFolderVal = () => {
  const folderId = $('#folder-select').val()

  return folderId
}

const handleFolderChange = () => {
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


$('#folder-select').change(handleFolderChange)
$('#new-link-submit').click(createLink)

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
