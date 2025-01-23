export const updateHealth = (health: number) => {
  const healthElement = document.getElementById("health");
  if (healthElement) {
    healthElement.innerText = health.toLocaleString("en-US");
  }
};
