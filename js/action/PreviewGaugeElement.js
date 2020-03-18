// 定数を読み込み
import CONSTANT from '../constant/CONSTANT.js';

export default class PreviewGaugeElement {
  constructor(effectTime, recastTime) {
    this.element = this._createPreviewGauge(effectTime, recastTime);
  }
  _createPreviewGauge(effectTime, recastTime) {
    const template = document.querySelector('#gaugeTemplate '),
      clone = document.importNode(template.content, true);
    clone.querySelector('.effectTime').style.height = (CONSTANT.PIXELS_PER_SECONDS * effectTime) + 'px';
    clone.querySelector('.recastTime').style.height = (CONSTANT.PIXELS_PER_SECONDS * (recastTime - effectTime)) + 'px';
    clone.children[0].style.display = 'none';
    clone.children[0].classList.add('previewGauge');
    return clone.children[0];
  }
  setSeconds(seconds) {
    this.element.style.transform = 'translateY(' + (seconds * CONSTANT.PIXELS_PER_SECONDS) + 'px)';
  }
  visible() {
    this.element.style.display = 'block';
  }
  invisible() {
    this.element.style.display = 'none';
  }
}
