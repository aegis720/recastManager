// 定数を読み込み
import CONSTANT from './constant/CONSTANT.js';

// データ読み込み
import BATTLE_TIMELINE_DATA from './data/ENEMYS_DATA.js';
import ACTIONS_DATA from './data/ACTIONS_DATA.js';

import ActionList from './action/ActionList.js';

// 読み込んでいる情報を格納する変数
var globalActionList,
  globalEnemy,
  globalTimeScale;

const getActions = function (name) {
  return ACTIONS_DATA.get(name);
}
const parseActions = function (actions, name) {
  if (!actions) return false;
  const actionList = new ActionList(name);
  for (let i in actions) {

    //    let action = new Action(actions[i].name, actions[i].effectTime, actions[i].recastTime, i, actions[i].fileName);
    //    actionList.pushList(action);
    let action = ActionList.buildAction(actions[i].name, actions[i].effectTime, actions[i].recastTime, i, actions[i].fileName)
    actionList.pushAction(action);
  }
  return actionList;
}
const loadActions = function (e) {
  // 読み込んでいる名前と選択された名前が一致していたら終了
  if (globalActionList && globalActionList.getName() == document.querySelector("#input").value) {
    return false;
  }
  let jobName = document.querySelector("#input").value;
  let actions = getActions(jobName);
  let actionList = parseActions(actions, jobName);
  // 入力された名前が存在しなかったら終了
  if (!actionList) return false;
  // 存在したら
  for (let action of actionList.getList()) {
    // 要素を追加
    action.getActionElements().appendAllElements();
  }
  // グローバル変数に格納
  globalActionList = actionList;
}
const loadEnemy = function (e) {

}


document.querySelector('#btn').addEventListener('click', loadActions, false);
/*==
  アイコン表示用
==*/
const getIconSrc = function (fileName) {
  const fullFileName = './res/actions/' + fileName;
  return fullFileName;
}
const createIcon = function (action) {
  let template = document.querySelector('#actionIcon');
  let clone = document.importNode(template.content, true);
  clone.querySelector('img').src = getIconSrc(action.getFileName());
  return clone.children[0];
}
const setIndex = function (iconElement, index) {
  iconElement.style.gridColumn = (+index + 1) + '/' + (+index + 2);
  iconElement.style.gridRow = "1/2";
}
/*==
  敵用プログラム
==*/
class Enemy {
  constructor(name, battleTime) {
    this.name = name;
    this.battleTime = battleTime;
    this.enemyActionList = new EnemyActionList();
  }
  pushAction(enemyAction) {
    this.enemyActionList.pushAction(enemyAction);
  }
  getTimeline() {
    return this.enemyActionList.getList();
  }
  getBattleTime() {
    return this.battleTime;
  }
  getName() {
    return this.name;
  }
}
class EnemyActionList {
  constructor() {
    this.list = [];
  }
  pushAction(enemyAction) {
    this.getList().push(enemyAction);
  }
  getList() {
    return this.list;
  }
}
class EnemyAction {
  constructor(description, time, type) {
    this.description = description;
    this.time = time;
    this.type = type;
  }
  getDescription() {
    return this.description;
  }
  getTime() {
    return this.time;
  }
  getType() {
    return this.type;
  }
}

const getEnemyData = function (name) {
  return BATTLE_TIMELINE_DATA.get(name);
}

const parseEnemyData = function (enemyData) {
  if (!enemyData) return false;
  const enemy = new Enemy(enemyData.name, enemyData.battleTime);
  for (let enemyAction of enemyData.timeline) {
    enemy.pushAction(new EnemyAction(enemyAction.description, enemyAction.time, enemyAction.type))
  }
  return enemy;
}


const createEnemyActionElement = function (enemyAction) {
  const element = document.createElement('span');
  element.classList.add('enemyAction');
  element.classList.add(enemyAction.getType());
  element.textContent = enemyAction.getDescription();
  element.style.top = (CONSTANT.PIXELS_PER_SECONDS * enemyAction.getTime()) + 'px';

  return element;

}
const applyInput2 = function (e) {
  // 読み込んでいる敵の名前と選択されている敵の名前が一致していたら終了
  if (globalEnemy && globalEnemy.getName() == document.querySelector('#input2').value) {
    return false;
  }
  const enemy = parseEnemyData(getEnemyData(document.querySelector('#input2').value));
  if (!enemy) return false;
  document.querySelector('#enemyActionContainer').textContent = '';
  globalEnemy = enemy;
  for (let enemyAction of globalEnemy.getTimeline()) {
    const element = createEnemyActionElement(enemyAction);
    document.querySelector('#enemyActionContainer').appendChild(element);
  }
  globalTimeScale.setBattleTime(enemy.getBattleTime());
  container.setHeight((64 + CONSTANT.PIXELS_PER_SECONDS * enemy.getBattleTime()));
}
document.querySelector('#btn2').addEventListener('click', applyInput2, false);

/*==
時間の目盛り用
==*/

const zeroPadding = function (number, length) {
  return (Array(length).join('0') + number).slice(-length);
}

class TimeScales {
  constructor(maxTimeLength) {
    this.maxTimeLength = maxTimeLength;
    this.list = [];
  }
  // 指定された秒までの目盛りを非表示にする
  setBattleTime(battleTime) {
    for (let i = 0, j = this.list.length; i < j; ++i) {
      if (battleTime / 10 >= i) {
        this.list[i].classList.remove('hidden');
      } else {
        this.list[i].classList.add('hidden');
      }
    }
  }
  init() {
    this.list = [];
    for (let i = 0, j = this.getMaxTimeLength() / 10; i <= j; ++i) {
      this._pushTimeScale(this.createScale(i * 10));
    }
    this._appendScales();
  }
  _appendScales() {
    const container = document.querySelector('#timeScaleContainer');
    for (let scale of this.list) {
      container.appendChild(scale);
    }
  }
  createScale(seconds) {
    const template = document.querySelector('#timeScale'),
      clone = document.importNode(template.content, true),
      scale = clone.children[0];
    // 0なら文字を追加しない
    if (seconds != 0) {
      scale.querySelector('.time').textContent = this.secondsToString(seconds);
    }
    scale.classList.add('hidden');
    scale.style.top = (CONSTANT.PIXELS_PER_SECONDS * seconds - 1) + 'px';
    return scale;
  }
  secondsToString(time) {
    let minutes = Math.floor(time / 60),
      seconds = time % 60,
      string = "";
    string = zeroPadding(minutes, 2) + ':' + zeroPadding(seconds, 2);
    return string;
  }
  getMaxTimeLength() {
    return this.maxTimeLength;
  }
  _pushTimeScale(timeScale) {
    this.list.push(timeScale);
  }
}

globalTimeScale = new TimeScales(CONSTANT.MAX_TIME_LENGTH);
globalTimeScale.init();

/*==
  コンテナ
==*/
const container = {
  element: document.querySelector('#container'),
  setHeight: function (px) {
    this.element.style.height = px + 'px';
  }
}

/*==
  なんか
==*/
