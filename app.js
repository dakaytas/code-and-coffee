const URL = 'https://jsonplaceholder.typicode.com/posts';
const postsContainer = document.getElementById('posts-container');

document.getElementById('fetch-posts').addEventListener('click', getPosts);

document.addEventListener("DOMContentLoaded", function () {
  const createPostButton = document.getElementById("create-post");

  if (createPostButton) {
    createPostButton.addEventListener("click", function () {
      window.location.href = "create-post.html";
    });
  }
});

function generateUniqueId() {
  return 'local-' + Date.now();
}

function getPosts() {
  const localPosts = JSON.parse(localStorage.getItem('posts')) || [];

  fetch(URL)
    .then((response) => response.json())
    .then((posts) => {
      const allPosts = [...localPosts, ...posts];

      allPosts.sort((a, b) => {
        const aId = String(a.id);
        const bId = String(b.id);

        if (aId.startsWith('local-') && bId.startsWith('local-')) {
          return bId.localeCompare(aId);
        } else if (aId.startsWith('local-')) {
          return -1;
        } else if (bId.startsWith('local-')) {
          return 1;
        } else {
          return b.id - a.id;
        }
      });

      postsContainer.replaceChildren();

      allPosts.forEach((post) => {
        addPostToDOM(post);
      });
    })
    .catch((error) => console.error('Error fetching posts:', error));
}

function addPostToDOM(post, prepend = false) {
  if (document.querySelector(`[data-id='${post.id}']`)) {
    return;
  }

  const liItem = document.createElement('li');
  liItem.classList.add('post');
  liItem.setAttribute('data-id', post.id);

  const postId = document.createElement('p');
  postId.classList.add('post-id');
  postId.textContent = `ID: ${post.id}`;

  const postTitle = document.createElement('h2');
  postTitle.classList.add('post-title');
  postTitle.textContent = post.title;

  const pItem = document.createElement('p');
  pItem.classList.add('post-body');
  pItem.textContent = post.body;

  const updatePostButton = document.createElement('a');
  updatePostButton.href = `./update-post.html?id=${post.id}`;
  updatePostButton.textContent = 'Update';
  updatePostButton.classList.add('button', 'button--success');

  const deletePostButton = document.createElement('button');
  deletePostButton.textContent = 'Delete';
  deletePostButton.addEventListener('click', () => deletePost(post.id));
  deletePostButton.classList.add('button', 'button--danger');

  liItem.appendChild(postId);
  liItem.appendChild(postTitle);
  liItem.appendChild(pItem);
  liItem.appendChild(updatePostButton);
  liItem.appendChild(deletePostButton);

  if (prepend) {
    postsContainer.prepend(liItem);
  } else {
    postsContainer.appendChild(liItem);
  }
}

function getPostById(postId) {
  const localPosts = JSON.parse(localStorage.getItem('posts')) || [];
  const foundPost = localPosts.find(post => post.id === postId);

  if (foundPost) {
    return Promise.resolve(foundPost);
  }

  return fetch(`${URL}/${postId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Post not found');
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error fetching post:', error);
      showErrorMessage('Post not found');
      throw error;
    });
}

function displayPost(post) {
  const postContainer = document.getElementById('post-container');
  if (!postContainer) {
    console.error('Post container not found!');
    return;
  }

  postContainer.replaceChildren();

  const titleElement = document.createElement('h2');
  titleElement.textContent = post.title;
  postContainer.appendChild(titleElement);

  const bodyElement = document.createElement('p');
  bodyElement.textContent = post.body;
  postContainer.appendChild(bodyElement);
}

function deletePost(postId) {
  const localPosts = JSON.parse(localStorage.getItem("posts")) || [];
  const updatedPosts = localPosts.filter((post) => post.id !== postId);
  localStorage.setItem("posts", JSON.stringify(updatedPosts));

  const postElement = document.querySelector(`[data-id='${postId}']`);
  if (postElement) {
    postElement.remove();
  } else {
    console.warn(`Post with ID ${postId} not found.`);
  }

  if (!postId.startsWith('local-')) {
    fetch(`${URL}/${postId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          console.log(`Post ${postId} deleted successfully from API!`);
        } else {
          console.error("Failed to delete post from API:");
          showErrorMessage("Failed to delete post from API.");
        }
      })
      .catch(error => {
        console.error("Error deleting post from API:", error);
        showErrorMessage("Error deleting post from API.");
      });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const postId = new URLSearchParams(window.location.search).get('id'); 

  if (postId) {
    getPostById(postId)
      .then((post) => {
        displayPost(post);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
});