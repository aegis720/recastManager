import IconElement from './IconElement.js';
import GaugeContainerElement from './GaugeContainerElement.js';
// 定数を読み込み
import CONSTANT from '../constant/CONSTANT.js';

// アクションに付随する要素を管理するクラス
export default class ActionElements {
  constructor(effectTime, recastTime, gaugeList, fileName, index) {
    this.effectTime = effectTime;
    this.recastTime = recastTime;
    this.index = index;

    this.container = new GaugeContainerElement(gaugeList, index);

    this.icon = new IconElement(fileName);
    this.icon.setIndex(index);
  }
  appendAllElements() {
    document.querySelector('#gaugeWrapper').appendChild(this.container.element);
    document.querySelector("#actionIconContainer").appendChild(this.icon.element);
  }
  appendAllGauge() {
    for (let gaugeElement of this.gaugeElements) {
      console.log(gauge);
    }
  }
}
