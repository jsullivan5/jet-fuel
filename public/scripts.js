$(document).ready(() => {
  fetch('api/v1/folders')
    .then(response => response.json())
    .then(data => displayFolders(data))
})

const displayFolders = (data) => {
  data.forEach(folder => {
    $('#folder-select').append(`<option id=${folder.id} value=${folder.id}>${folder.name}</option>`)
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

$('#new-link-submit').click(prependNewLink);

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

  fetch(`/api/v1/folders/${folderId}/links`)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      data.forEach((link) => {
        // TODO: insert prepend for links here.
      });
    })
    .catch(error => console.log(error))

}


$('#folder-select').change(handleFolderChange)
