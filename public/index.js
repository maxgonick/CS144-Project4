import App from "./app.js";
let app = new App();
const formSubmit = (event) => {
  event.preventDefault();
  event.stopPropagation();
  app.mover.stopMoving();
  const formData = new FormData(event.target);
  const title = formData.get("title");
  const color = formData.get("color");
  app.addCard("todo", title, color);
  document.querySelector("#addCard").reset();
};


function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
  if (localStorageTheme !== null) {
    return localStorageTheme;
  }

  if (systemSettingDark.matches) {
    return "dark";
  }

  return "light";
}
function rgbToHex(rgbString) {
  const rgbValues = rgbString.match(/\d+/g).map(Number);
  const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return (
    "#" +
    componentToHex(rgbValues[0]) +
    componentToHex(rgbValues[1]) +
    componentToHex(rgbValues[2])
  );
}

const main = () => {
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");
const localStorageTheme = localStorage.getItem("theme");

let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });


const button = document.querySelector("[data-theme-toggle]");
button.addEventListener("click", () => {
  const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

  // update the button text
  const svgSource = newTheme === "dark" ? "./icons/moon-fill.svg" : "./icons/sun-fill.svg";
  const ctaLabel = newTheme === "dark" ? "Change to Light" : "Change to Dark"
  document.querySelector("#svg-src").src = svgSource;

  button.setAttribute("aria-label", ctaLabel);

  // update theme attribute on HTML to switch theme in CSS
  document.querySelector("html").setAttribute("data-theme", newTheme);

  // update in local storage
  localStorage.setItem("theme", newTheme);

  // update the currentThemeSetting in memory
  currentThemeSetting = newTheme;
})

  const svg = document.querySelector("#svg-src");
  if (currentThemeSetting == "light") {
    svg.src = "./icons/sun-fill.svg";
    svg.alt = "Sun Icon";
    document.querySelector("html").setAttribute("data-theme", currentThemeSetting);
  } else {
    svg.src = "./icons/moon-fill.svg";
    svg.alt = "Moon Icon";
    document.querySelector("html").setAttribute("data-theme", currentThemeSetting);
  }
  const addForm = document.querySelector("#addCard");
  addForm.addEventListener("submit", formSubmit);


  //Retrieve Local Storage 
  let tasks = JSON.parse(localStorage.getItem("state")) || [];
  for (let key in tasks) {
    tasks[key].forEach(element => {
      app.addCard(key, (element.text || ""), rgbToHex(element.color));
    });
  }

};
main();
