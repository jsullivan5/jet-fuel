$(document).ready(() => {
  fetch('api/v1/folders')
    .then(response => response.json())
    .then(data => displayFolders(data))
})

const displayFolders = (data) => {
  data.forEach(folder => {
    console.log(folder)
    $('#folders-display').append(`<p id=${folder.id}>${folder.name}</p>`)
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
    console.log(data);
    $('#folders-display').prepend(`<p>${data.name}</p>`)
  })
  .catch(error => console.log(error))
}

$('#folder-submit').click(handleFolderSubmit)
