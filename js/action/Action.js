import GaugeList from './GaugeList.js';
import ActionElements from './ActionElements.js';
// アクションを管理するクラス
export default class Action {
  constructor(name, effectTime, recastTime, index, fileName) {
    this.name = name;
    this.effectTime = effectTime;
    this.recastTime = recastTime;
    this.gaugeList = new GaugeList(effectTime, recastTime);
    this.fileName = fileName;
    this.actionElements = new ActionElements(effectTime, recastTime, this.gaugeList, fileName, index)
  }
  getEffectTime() {
    return this.effectTime;
  }
  getRecastTime() {
    return this.recastTime;
  }
  getTimeDifference() {
    return this.recastTime - this.effectTime;
  }
  getIndex() {
    return this.index;
  }
  setIndex(index) {
    this.index = index;
  }
  getFileName() {
    return this.fileName;
  }
  getGaugeList() {
    return this.gaugeList;
  }
  getActionElements() {
    return this.actionElements;
  }
}
