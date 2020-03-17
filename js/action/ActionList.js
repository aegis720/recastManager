import Action from './Action.js';
import ACTIONS_DATA from '../data/ACTIONS_DATA.js';

// アクションをまとめて管理するクラス
export default class ActionList {
  constructor(name) {
    this.name = name;
    this.currentIndex;
    this.list = [];
  }
  init() {
    this.index = 0;

    const preffixAction = ACTIONS_DATA.get("preffix");
    if (preffixAction) this._pushActions(preffixAction);

    const actions = ACTIONS_DATA.get(this.name);
    this._pushActions(actions);

    const suffixAction = ACTIONS_DATA.get("suffix");
    if (suffixAction) this._pushActions(suffixAction);
  }
  _pushActions(actions) {
    for (let actionData of actions) {
      let action = ActionList.buildAction(actionData.name, actionData.effectTime, actionData.recastTime, this.index, actionData.fileName)
      this.pushAction(action);
      ++this.index;
    }
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
