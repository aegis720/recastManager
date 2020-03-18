import GaugeElement from './GaugeElement.js';
import PreviewGaugeElement from './PreviewGaugeElement.js';
// 定数を読み込み
import CONSTANT from '../constant/CONSTANT.js';


export default class GaugeContainerElement {
  constructor(gaugeList, index) {
    this.gaugeList = gaugeList;
    this.element = this._createGaugeContainer(index);
    this.oldPageY;

    this.gaugeElements = [];

    this.previewGauge = new PreviewGaugeElement(gaugeList.getEffectTime(), gaugeList.getRecastTime());
    this.element.appendChild(this.previewGauge.element);

    this.element.addEventListener('mousemove', this._mousemove.bind(this), false);
    this.element.addEventListener('mouseenter', this._mouseenter.bind(this), false);
    this.element.addEventListener('mouseleave', this._mouseleave.bind(this), false);
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
      return true;
    }
    return false;
  }
  _clickGaugeContainer(event) {
    const seconds = Math.floor(event.offsetY / CONSTANT.PIXELS_PER_SECONDS);
    const placeableSeconds = this.gaugeList.getPlaceableSeconds(seconds);

    if (placeableSeconds == false) {
      console.log("ゲージの追加に失敗しました。");
      return false;
    }

    const added = this._addGauge(placeableSeconds);
    if (added) {
      console.log("ゲージの追加に成功しました。");
    } else {
      console.log("ゲージの追加に失敗しました。");
    }
  }
  _mousemove(event) {
    if (this.oldPageY == event.pageY) return false;
    this.oldPageY = event.pageY;

    // コンテナ内におけるゲージの位置[seconds]
    let seconds = 0;
    // マウスのY座標分を足す
    seconds += event.pageY;
    // コンテナ上部の余白を引く
    seconds -= this.getContainerTop();

    seconds = Math.floor(seconds / CONSTANT.PIXELS_PER_SECONDS);

    const contains = this.gaugeList.containsGaugeByPoint(seconds);
    const placeableSeconds = this.gaugeList.getPlaceableSeconds(seconds);

    if (contains || !placeableSeconds) {
      this.previewGauge.invisible();
      return false;
    } else {
      this.previewGauge.visible();
    }

    if (placeableSeconds == false) {
      this.previewGauge.invisible();
      return false;
    };

    this.previewGauge.setSeconds(placeableSeconds);
  }
  _mouseenter(event) {
    this.previewGauge.visible();
  }
  _mouseleave(event) {
    this.previewGauge.invisible();
  }
  getContainerTop() {
    return this.element.getBoundingClientRect().top + window.pageYOffset;
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
