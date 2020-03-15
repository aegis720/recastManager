export default class IconElement {
  constructor(fileName) {
    this.element = this._createIcon(fileName);
  }
  _getIconSrc(fileName) {
    // "./res/actions/%jobName%/%fileName%.png"の形に
    const fullFileName = './res/actions/' + fileName;
    return fullFileName;
  }
  _createIcon(fileName) {
    let template = document.querySelector('#actionIcon');
    let clone = document.importNode(template.content, true);
    clone.querySelector('img').src = this._getIconSrc(fileName);
    return clone.children[0];
  }
  getElement() {
    return this.element;
  }
  setIndex(index) {
    this.getElement().style.gridColumn = (+index + 1) + '/' + (+index + 2);
    this.getElement().style.gridRow = "1/2";
  }
}
