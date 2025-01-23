export const updateMonsterCount = (numberOfMonsters: number) => {
  const monstersElement = document.getElementById("monsters");
  if (monstersElement) {
    monstersElement.innerText = numberOfMonsters.toLocaleString("en-US");
  }
};
