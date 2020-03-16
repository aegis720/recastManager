import GaugeElement from './GaugeElement.js';
import PreviewGaugeElement from './PreviewGaugeElement.js';
// 定数を読み込み
import CONSTANT from '../constant/CONSTANT.js';

// アクションに付随する要素を管理するクラス
export default class ActionElements {
  constructor(gaugeList, index) {
    this.gaugeList = gaugeList;
    this.element = this._createGaugeContainer(index);
    this.gaugeElements = [];

    this.previewGaugeElement = new PreviewGaugeElement();
  }
  _createGaugeContainer() {
    const container = document.createElement('div');
    container.classList.add('gaugeContainer');
    container.addEventListener('click', this._clickGaugeContainer.bind(this), false);
    return container;
  }
  _pushGaugeElement(gauge) {
    let gaugeElement = new GaugeElement(gauge, this.element);
    this.gaugeElements.push(gaugeElement);
    this.appendGauge(gaugeElement);
  }
  _addGauge(seconds) {
    const canPush = this.gaugeList.canPushGauge(seconds);
    if (canPush) {
      const gauge = this.gaugeList.tryPushGauge(seconds);
      this._pushGaugeElement(gauge);
      console.log("ゲージの追加に成功しました。");
    } else {
      console.log("ゲージの追加に失敗しました。");
    }
  }
  _clickGaugeContainer(event) {
    const seconds = Math.floor(event.offsetY / CONSTANT.PIXELS_PER_SECONDS);
    this._addGauge(seconds);
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
    this.element.appendChild(gaugeElement.element);
  }
}
