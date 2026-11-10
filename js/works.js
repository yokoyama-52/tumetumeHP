const works = document.querySelector('#works');

for (const trigger of works.querySelectorAll('[data-work]')) {
  const dialog = document.getElementById(trigger.getAttribute('aria-controls'));

  trigger.addEventListener('click', () => dialog.showModal());

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}
