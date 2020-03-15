import IconElement from './IconElement.js';
import GaugeElement from './GaugeElement.js';
// 定数を読み込み
import CONSTANT from '../constant/CONSTANT.js';

// アクションに付随する要素を管理するクラス
export default class ActionElements {
  constructor(parent, effectTime, recastTime, index) {
    this.parent = parent;
    this.effectTime = effectTime;
    this.recastTime = recastTime;
    this.index = index;
    this.container = this._createGaugeContainer(index);
    this.icon = new IconElement(this.parent.getFileName());
    this.icon.setIndex(index);
    this.gaugeElements = [];
  }
  _createGaugeContainer() {
    const container = document.createElement('div');
    container.classList.add('gaugeContainer');
    container.addEventListener('click', this._clickGaugeContainer.bind(this), false);
    return container;
  }
  _clickGaugeContainer(event) {
    console.log('CONSTANT', CONSTANT);
    let seconds = Math.floor(event.offsetY / CONSTANT.PIXELS_PER_SECONDS)
    let gauge = this.parent.getGaugeList().tryPushGauge(seconds);
    if (gauge) {
      console.log("せいこう");
      let gaugeElement = new GaugeElement(gauge, this.container);
      this.gaugeElements.push(gaugeElement);
      this.appendGauge(gaugeElement);
    } else {
      console.log("しっぱい");
    }
  }
  refreshGaugeElements() {
    console.log(parent.getGaugeList());
  }
  appendAllElements() {
    document.querySelector('#gaugeWrapper').appendChild(this.container);
    document.querySelector("#actionIconContainer").appendChild(this.icon.element);
  }
  appendAllGauge() {
    for (let gaugeElement of this.gaugeElements) {
      console.log(gauge);
    }
  }
  appendGauge(gaugeElement) {
    this.container.appendChild(gaugeElement.element);
  }
}
