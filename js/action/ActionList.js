import Action from './Action.js';
// アクションをまとめて管理するクラス
export default class ActionList {
  constructor(name) {
    this.name = name;
    this.list = [];
  }
  static buildAction(name, effectTime, recastTime, index, fileName) {
    return new Action(name, effectTime, recastTime, index, fileName);
  }
  pushAction(action) {
    if (action.constructor.name == 'Action') {
      this.list.push(action);
    }
  }
  pushList(action) {
    this.list.push(action);
  }
  // 配列のままpushできるメソッド
  arrayPushList(array) {
    for (let action of array) {
      this.pushList(action);
    }
  }
  getList() {
    return this.list;
  }
  getAction(name) {
    for (let action of this.list) {
      if (action.name == name) {
        return action;
      }
    }
    return false;
  }
  pushGauge(name, usedTime) {
    const action = this.getAction(name);
    if (!action) return false;

    action.gaugeList.tryPushGauge(usedTime);
    return true;
  }
  getGaugeList(name) {
    let action = this.getAction(name);
    if (!action) return false;
    return action.gaugeList;
  }
  getName() {
    return this.name;
  }
}
