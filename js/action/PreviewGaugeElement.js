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
    return clone.children[0];
  }
}
