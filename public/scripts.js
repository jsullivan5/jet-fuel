
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
  const name = $('#folder-name').val();

  return name
}

const handleFolderSubmit = (event) => {
  event.preventDefault();
  const name = getNewFolderName()

  console.log('working')
  fetch('./api/v1/folders', { method: 'POST', body: name})
}



$('#folder-submit').click(handleFolderSubmit)
