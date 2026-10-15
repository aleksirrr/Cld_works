export const notify = (function() {
  const template = document.createElement("div");
  template.classList.add("o-notification");
  const bigtext = "o-notification--big";
  const enterAnimation = "a-notification--enter";
  const leaveAnimation = "a-notification--leave";
  function showNotification(text, elClass, duration = 3500, sound = "") {
    if (!GameUI.initialized) {
      setTimeout(showNotification, 500, text, elClass, duration);
      return;
    }
    const el = template.cloneNode();
    el.innerHTML = Array.isArray(text)?`<div class="o-notification--header">${text[0]}</div>${text[1]}`:text;
    el.classList.add(elClass, enterAnimation);
    if (Array.isArray(text)) el.classList.add(bigtext);
    if (sound!=="")AudioManagement.notifyNoise(sound);
    const container = document.getElementById("notification-container");
    container.appendChild(el);
    let entered = false;
    function stopEnter() {
      if (entered) return;
      entered = true;
      el.classList.remove(enterAnimation);
    }
    setTimeout(() => stopEnter(), 500);
    let leaving = false;
    function leave() {
      if (leaving) return;
      leaving = true;
      stopEnter();
      el.classList.add(leaveAnimation);
      setTimeout(() => el.remove(), 500);
    }
    setTimeout(() => leave(), duration);
    el.onclick = () => leave();
  }
  return {
    success: (text, duration) => showNotification(text, "o-notification--success", duration),
    error: (text, duration) => showNotification(text, "o-notification--error", duration),
    info: (text, duration) => showNotification(text, "o-notification--info", duration),
    infinity: (text, duration) => showNotification(text, "o-notification--infinity", duration),
    eternity: (text, duration) => showNotification(text, "o-notification--eternity", duration),
    reality: (text, duration) => showNotification(text, "o-notification--reality", duration),
    endgame: (text, duration) => showNotification(text, "o-notification--endgame", duration),
    automator: (text, duration) => showNotification(text, "o-notification--automator", duration),
    blackHole: (text, duration) => showNotification(text, "o-notification--black-hole", duration),
    strike: (text, duration) => showNotification(text, "o-notification--strike", duration),
    showBlackHoles: true
  };
}());
