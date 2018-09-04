const retrieveAllBucketLists = () => {
  $('.display_card').empty();

  const url = '/api/v1/bucketlists';

  fetch(url)
    .then(resp => {
      return resp.json()
    })
    .then(bucketList => {
      bucketList.map(card => {
        $('.display_card').prepend(`
          <article class="card">
            <div class="title_button">
              <h3 class="display_title">${card.title}</h3>
              <button class="delete">Delete</button>
            </div>
            <p class="display_description">${card.description}</p>
          </article>
        `)
      })
    })
}

const saveBucketList = () => {
  event.preventDefault();

  const title = $('.title').val();
  const description = $('.description').val();

  $('.display_card').prepend(`
      <article class="card">
        <div class="title_button">
          <h3 class="display_title">${title}</h3>
          <button class="delete">Delete</button>
        </div>
        <p class="display_description">${description}</p>
      </article>
        `)

  fetch('/api/v1/bucketlists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      description
    })
  })
    .then(resp => {
      return resp.json();
    });
  $('.title').val('');
  $('.description').val('');
}

const deleteCardFromBucketList = (event) => {
  event.preventDefault();
  const title = event.target.closest('.title_button').children[0].innerText;
  fetch(`/api/v1/bucketlists/${title}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title
    })
  })
    .then(resp => {
      return resp.json();
    });
  event.target.closest('.card').remove();
}

$('.display_card').on('click', 'article .delete', deleteCardFromBucketList);
$('.save').on('click', saveBucketList);
$(window).ready(retrieveAllBucketLists());