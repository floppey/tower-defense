export const updateMoney = (money: number) => {
  const moneyElement = document.getElementById("money");
  if (moneyElement) {
    moneyElement.innerText = money.toLocaleString("en-US");
  }
};
