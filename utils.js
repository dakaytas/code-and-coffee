function showSuccessMessage(message) {
  const successMessage = document.createElement('div');
  successMessage.style.color = 'green';
  successMessage.textContent = message;
  successMessage.setAttribute('aria-live', 'polite');
  document.querySelector('.container').appendChild(successMessage);

  setTimeout(() => {
    successMessage.remove();
  }, 3000);
}

function showErrorMessage(message) {
  const errorMessage = document.createElement('div');
  errorMessage.style.color = 'red';
  errorMessage.textContent = message;
  errorMessage.setAttribute('aria-live', 'assertive');
  document.querySelector('.container').appendChild(errorMessage);

  setTimeout(() => {
    errorMessage.remove();
  }, 3000);
}