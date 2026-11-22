const messages = ["09:00–09:02 UTC · Three failures for the same account and source.", "09:04 UTC · The same account and source record a successful sign-in.", "Keep the alert open for review. Check MFA, device identity, and post-login activity."];
const buttons = document.querySelectorAll("[data-step]");
const output = document.querySelector("#evidence");
buttons.forEach(button => button.addEventListener("click", () => {
  buttons.forEach(control => control.setAttribute("aria-pressed", String(control === button)));
  output.textContent = messages[Number(button.dataset.step)];
}));
