/* Text to add to the move here button */
const MOVE_HERE_TEXT = "— Move here —";

export default class Mover {
  constructor() {
    //TODO
    self.active = false;
  }
  startMoving(card, cardElement) {
    //Helper Functions
    const moveCardEvent = (event) => {
      const targetElement = event.target.previousSibling;
      card.classList.remove("moving");
      targetElement.insertAdjacentElement("afterend", card);
      this.stopMoving();
      cardElement.saveState();
    };

    //TODO
    if (self.active) {
      return;
    }
    card.classList.add("moving");
    const nodeList = document.querySelectorAll(".columnTitle:not(.template), .card:not(.template)");
    for (const node of nodeList) {
      const button = document.createElement("button");
      button.innerText = MOVE_HERE_TEXT;
      button.classList.add("moveHere");
      button.addEventListener("click", moveCardEvent);
      node.insertAdjacentElement("afterend", button);
    }
    self.active = true;
  }

  stopMoving() {
    //TODO
    const buttonList = document.querySelectorAll(".moveHere");
    for (const button of buttonList) {
      button.remove();
    }
    const nodeList = document.querySelectorAll(".moving");
    for (const node of nodeList) {
      node.classList.remove("moving");
    }
    self.active = false;
  }
}
