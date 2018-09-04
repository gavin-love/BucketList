const saveBucketList = () => {
  event.preventDefault();

  const title = document.querySelector('.title').value;
  const description = document.querySelector('.description').value;
  const displayTitle = document.querySelector('.display_title');
  const displayDescription = document.querySelector('.display_description');

  displayTitle.innerText = title;
  displayDescription.innerText = description;

  fetch('/api/v1/bucketlists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      description
    })
  })
    .then(resp => {
      return resp.json()
    })
}

document.querySelector('.save').addEventListener('click', saveBucketList);