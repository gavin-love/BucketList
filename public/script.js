const retrieveAllBucketLists = () => {
  $('.display_card').empty();

  const url = '/api/v1/items';

  fetch(url)
    .then(resp => {
      return resp.json()
    })
    .then(bucketList => {
      bucketList.map(card => {
        $('.display_card').prepend(`
          <article id="${card.id}" class="card">
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

  if (!title || !description) {
    return;
  }

  fetch('/api/v1/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      description
    })
  }).then(response => {
    return response.json();
  })
    .then(result => {
      $('.display_card').prepend(`
      <article id="${result.id}"class="card">
        <div class="title_button">
          <h3 class="display_title">${title}</h3>
          <button class="delete">Delete</button>
        </div>
        <p class="display_description">${description}</p>
      </article>
        `)
    });
  $('.title').val('');
  $('.description').val('');
}

const deleteCardFromBucketList = (event) => {
  event.preventDefault();
  const id = $(event.target).parent().parent().attr('id');

  fetch(`/api/v1/items/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(resp => {
      return resp.json();
    });
  event.target.closest('.card').remove();
}

$('.display_card').on('click', 'article .delete', deleteCardFromBucketList);
$('.save').on('click', saveBucketList);
$(window).ready(retrieveAllBucketLists());