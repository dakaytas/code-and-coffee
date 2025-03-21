const URL = 'https://jsonplaceholder.typicode.com/posts';

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('create-post-form');
  const backButton = document.getElementById('back-button');

  if (backButton) {
    backButton.addEventListener('click', function () {
      window.location.href = 'index.html';
    });
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const title = document.getElementById('post-title').value.trim();
      const body = document.getElementById('post-content').value.trim();

      if (!title || !body) {
        showErrorMessage('Please fill in all fields!');
        return;
      }

      fetch(URL, {
        method: 'POST',
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
            throw new Error('Failed to create post');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Post created successfully:', data);

          const newPost = {
            id: 'local-' + Date.now(),
            title: title,
            body: body,
            userId: 1,
          };
          const localPosts = JSON.parse(localStorage.getItem('posts')) || [];
          localPosts.push(newPost);
          localStorage.setItem('posts', JSON.stringify(localPosts));

          showSuccessMessage('Post created successfully!');
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 2000);
        })
        .catch((error) => {
          console.error('Error creating post:', error);
          showErrorMessage('Error creating post.');
        });
    });
  }
});