const URL = 'https://jsonplaceholder.typicode.com/posts';
const params = new URLSearchParams(window.location.search);
const postId = params.get('id');

document.addEventListener('DOMContentLoaded', function () {
  const goBackButton = document.getElementById('back-button');
  if (goBackButton) {
    goBackButton.addEventListener('click', function () {
      window.location.href = 'index.html';
    });
  }

  fetchPost(postId);

  const updatePostForm = document.getElementById('update-post-form');
  if (updatePostForm) {
    updatePostForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const title = document.getElementById('post-title').value.trim();
      const body = document.getElementById('post-content').value.trim();

      if (!title || !body) {
        showErrorMessage('Please fill in all fields!');
        return;
      }

      if (postId.startsWith('local-')) {
        updateLocalPost(postId, title, body);
      } else {

        fetch(`${URL}/${postId}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: title,
            body: body,
            userId: 1,
          }),
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to update post');
            }
            return response.json();
          })
          .then((data) => {
            console.log('Post updated successfully:', data);
            showSuccessMessage('Post updated successfully!');

            setTimeout(() => {
              window.location.href = 'index.html';
            }, 2000);
          })
          .catch((error) => {
            console.error('Error updating post:', error);
            showErrorMessage('Error updating post.');
          });
      }
    });
  }
});

function fetchPost(postId) {

  const localPosts = JSON.parse(localStorage.getItem('posts')) || [];
  const localPost = localPosts.find((post) => post.id === postId);

  if (localPost) {

    console.log('Post found in localStorage:', localPost);
    document.getElementById('post-title').value = localPost.title;
    document.getElementById('post-content').value = localPost.body;
    return;
  }

  fetch(`${URL}/${postId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Post not found');
      }
      return response.json();
    })
    .then((post) => {
      console.log('Fetched post from API:', post);
      document.getElementById('post-title').value = post.title;
      document.getElementById('post-content').value = post.body;
    })
    .catch((error) => {
      console.error('Error fetching post:', error);
      showErrorMessage('Error fetching post.');
    });
}

function updateLocalPost(postId, title, body) {
  const localPosts = JSON.parse(localStorage.getItem('posts')) || [];
  const postIndex = localPosts.findIndex((post) => post.id === postId);

  if (postIndex !== -1) {
    
    localPosts[postIndex].title = title;
    localPosts[postIndex].body = body;

    localStorage.setItem('posts', JSON.stringify(localPosts));

    console.log('Local post updated successfully:', localPosts[postIndex]);
    showSuccessMessage('Post updated successfully!');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  } else {
    console.error('Post not found in localStorage');
    showErrorMessage('Post not found.');
  }
}
