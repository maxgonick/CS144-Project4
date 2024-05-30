/* The text to use when description is empty */
const NO_DESCRIPTION_TEXT = "(No description)";
function hexToBrightness(hex) {
  // Remove the leading '#' if present
  hex = hex.replace('#', '');

  // Convert the hexadecimal string to RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate the brightness using the formula:
  // Brightness = (0.2126 * R + 0.7152 * G + 0.0722 * B) / 255
  const brightness = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  if (isNaN(brightness)) return 1;
  return brightness;
};

class Task {
  constructor(title, text, color) {
    this.title = title;
    this.text = text;
    this.color = color;
  };
};


export default class Card {
  constructor(title, color) {
    //TODO
    self.title = title;
    self.color = color;
    self.card = null;
  };
  saveState() {
    const state = {
      "todo": [],
      "doing": [],
      "done": [],
    };

    document.querySelectorAll("#todo > *:not(h2, .moveHere)").forEach(element => {
      const elementTitle = element.querySelector(".title").innerText || "";
      const elementColor = element.style.backgroundColor;
      const elementText = element.querySelector(".description").innerText || "";
      const task = new Task(elementTitle, elementText, elementColor);
      state.todo.push(task);
    });
    document.querySelectorAll("#doing > *:not(h2, .moveHere)").forEach(element => {
      const elementTitle = element.querySelector(".title").innerText || "";
      const elementColor = element.style.backgroundColor;
      const elementText = element.querySelector(".description").innerText || "";
      const task = new Task(elementTitle, elementText, elementColor);
      state.doing.push(task);
    });
    document.querySelectorAll("#done > *:not(h2, .moveHere)").forEach(element => {
      const elementTitle = element.querySelector(".title").innerText || "";
      const elementColor = element.style.backgroundColor;
      const elementText = element.querySelector(".description").innerText || "";
      const task = new Task(elementTitle, elementText, elementColor);
      state.done.push(task);
    });
    localStorage.setItem('state', JSON.stringify(state));
  };



  addToCol(colElem, mover) {
    let foo = new Set();
    //Helper Functions
    const deleteEvent = (event) => {
      mover.stopMoving();
      const cardNode = event.target.closest(".card");
      cardNode.remove();
      this.saveState();
    };
    const leaveEditEvent = (event) => {
      const cardNode = event.target.closest(".card");
      const editField = cardNode.querySelector(".editDescription");
      cardNode.querySelector(".description").innerHTML = editField.value;
      editField.classList.add("hidden");
      this.saveState();
    };
    const editEvent = (event) => {
      const cardNode = event.target.closest(".card");
      const editField = cardNode.querySelector(".editDescription");
      editField.classList.remove("hidden");
      editField.value = cardNode.querySelector(".description").innerText;
      editField.focus();
      editField.select();
      this.saveState();
    };
    const moveEvent = (event) => {
      mover.stopMoving();
      mover.startMoving(event.target.closest(".card"), this);
      this.saveState();
    };
    const dropEvent = (event) => {
      event.preventDefault();
      const eventCard = event.currentTarget;
      if (event.dataTransfer.items) {
        const reader = new FileReader();
        const file = event.dataTransfer.items[0].getAsFile();
        reader.onload = () => {
          eventCard.querySelector(".description").textContent = reader.result;
        };
        reader.readAsText(file);
      }
      event.currentTarget.classList.remove("dragoverZone");
      this.saveState();
    };
    const dragenterEvent = (event) => {
      event.preventDefault();
      foo.add(event.target);
      event.currentTarget.classList.add("dragoverZone");
    };
    const dragleaveEvent = (event) => {
      event.preventDefault();
      foo.delete(event.target);
      if (foo.size === 0) {
        event.currentTarget.classList.remove("dragoverZone");
      };
      this.saveState();
    };
    const newElement = document.querySelector(".template").cloneNode(true);
    newElement.classList.remove("template");
    newElement.style.backgroundColor = self.color;
    const brightness = hexToBrightness(self.color);
    if (brightness >= 0.5) {
      newElement.style.color = "black";
      const buttons = newElement.querySelectorAll(".buttons > *");
      newElement.querySelector(".editDescription").style.color = "black";
      buttons.forEach(element => {
        const svg = element.querySelector("img");
        const source = svg.src.split("/").pop();
        switch (source) {
          case "deletelight.svg":
            svg.src = "./icons/delete.svg";
            break;
          case "editlight.svg":
            svg.src = "./icons/edit.svg";
            break;
          case "movelight.svg":
            svg.src = "./icons/move.svg";
            break;
          default:
            break;
        };
      });
    }
    else if (brightness < 0.5) {
      newElement.style.color = "white";
      const buttons = newElement.querySelectorAll(".buttons > :not(img)");
      newElement.querySelector(".editDescription").style.color = "white";
      buttons.forEach(element => {
        const svg = element.querySelector("img");
        const source = svg.src.split("/").pop();
        switch (source) {
          case "delete.svg":
            svg.src = "./icons/deletelight.svg";
            break;
          case "edit.svg":
            svg.src = "./icons/editlight.svg";
            break;
          case "move.svg":
            svg.src = "./icons/movelight.svg";
            break;
          default:
            break;
        };
      });
    }
    else {
      ;
    }
    const title = newElement.querySelector(".title");
    title.innerText = self.title;
    newElement.querySelector(".delete").addEventListener("click", deleteEvent);
    newElement.querySelector(".edit").addEventListener("click", editEvent);
    newElement.querySelector(".editDescription").addEventListener("blur", leaveEditEvent);
    newElement.querySelector(".startMove").addEventListener("mousedown", moveEvent);
    newElement.querySelector(".description").innerText = NO_DESCRIPTION_TEXT;
    self.card = newElement;
    newElement.addEventListener("dragenter", dragenterEvent);
    newElement.addEventListener("dragleave", dragleaveEvent);
    newElement.addEventListener("drop", dropEvent);
    newElement.addEventListener("dragover", (event) => {
      event.preventDefault();
    });
    colElem.append(newElement);
    this.saveState();
  }
  setDescription(text) {
    self.card.querySelector(".description").innerText = text;
    this.saveState();
  }
}

