function selectTheme(theme) {
  localStorage.setItem('selectedTheme', theme);
  const folderPath = `questions_easy_${theme}/`;
  const fileName = `${theme}_quiz_1_easy.html`;
  window.location.href = folderPath + fileName;
}

function navigateTo(page) {
  window.location.href = page;
}
