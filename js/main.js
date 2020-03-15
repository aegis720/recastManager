const CONSTANT = {
  PIXELS_PER_SECONDS: 6,
  MAX_TIME_LENGTH: 900
};
// 読み込んでいる情報を格納する変数
var globalActionList,
  globalEnemy,
  globalTimeScale;

// アクションをまとめて管理するクラス
class ActionList {
  constructor(name) {
    this.name = name;
    this.list = [];
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

// アクションを管理するクラス
class Action {
  constructor(name, effectTime, recastTime, index, fileName) {
    this.name = name;
    this.effectTime = effectTime;
    this.recastTime = recastTime;
    this.gaugeList = new GaugeList(effectTime, recastTime);
    this.fileName = fileName;
    this.actionElements = new ActionElements(this, effectTime, recastTime, index)
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
// ゲージをまとめて管理するクラス
class GaugeList {
  constructor(effectTime, recastTime) {
    this.effectTime = effectTime;
    this.recastTime = recastTime;
    this.list = [];
  }
  tryPushGauge(usedTime) {
    if (!(this._isOverlapping(usedTime))) {
      const gauge = new Gauge(this, usedTime, this.getEffectTime(), this.getRecastTime());
      this.list.push(gauge);
      return gauge;
    }
    return false;
  }
  canMoveGauge(gauge, time) {
    if (!(this._isOverlapping(time, gauge))) {
      return true;
    }
    return false;
  }
  tryMoveGauge(gauge, time) {
    if (this.canMoveGauge(gauge, time)) {
      gauge.setUsedTime(time);
      return true;
    }
    return false;
  }
  removeGauge(gauge) {
    for (let i in this.list) {
      if (this.list[i] === gauge) {
        this.list.splice(i, 1);
        return true;
      }
    }
    return false;
  }
  _isOverlapping(time, excludeGauge) {
    if (!this.getGaugeByTime(time, excludeGauge)) {
      return false;
    }
    return true;
  }
  getGaugeByTime(time, excludeGauge) {
    const start = time,
      end = start + this.getRecastTime();
    for (let gauge of this.getList()) {
      if (gauge === excludeGauge) continue;
      // 使用した時間
      const targetStart = gauge.getUsedTime();
      // リキャが返ってくる時間
      const targetEnd = targetStart + gauge.getRecastTime();
      if (targetStart < end && start < targetEnd) {
        return gauge;
      }
    }
    return undefined;
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
  getList() {
    return this.list;
  }
}
// ゲージ単体のクラス
class Gauge {
  constructor(parent, usedTime, effectTime, recastTime) {
    this.parent = parent;
    this.usedTime = usedTime;
    this.effectTime = effectTime;
    this.recastTime = recastTime;
  }
  getUsedTime() {
    return this.usedTime;
  }
  setUsedTime(usedTime) {
    this.usedTime = usedTime;
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
}
// アクションに付随する要素を管理するクラス
class ActionElements {
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
class IconElement {
  constructor(fileName) {
    this.element = this._createIcon(fileName);
  }
  _getIconSrc(fileName) {
    // "./res/actions/%jobName%/%fileName%.png"の形に
    const fullFileName = './res/actions/' + fileName;
    return fullFileName;
  }
  _createIcon(fileName) {
    let template = document.querySelector('#actionIcon');
    let clone = document.importNode(template.content, true);
    clone.querySelector('img').src = this._getIconSrc(fileName);
    return clone.children[0];
  }
  getElement() {
    return this.element;
  }
  setIndex(index) {
    this.getElement().style.gridColumn = (+index + 1) + '/' + (+index + 2);
    this.getElement().style.gridRow = "1/2";
  }
}
class GaugeElement {
  constructor(gauge, gaugeContainer) {
    this.gauge = gauge;
    this.gaugeContainer = gaugeContainer;
    this.containerOffsetTop = gaugeContainer.getBoundingClientRect().top + window.pageYOffset;

    this.offsetX;
    this.offsetY;
    this.pageX;
    this.pageY;

    this.moved;
    this.movementAmount = false;

    this.floating = false;

    this._bindedMouseMove = this._mouseMove.bind(this);

    this.element = this._createGaugeElement(gauge.getUsedTime(), gauge.getEffectTime(), gauge.getRecastTime());
    this.element.addEventListener('mousedown', this._mouseDown.bind(this));

  }
  _usedTimeToPX(usedTime) {
    return (CONSTANT.PIXELS_PER_SECONDS * usedTime) + 'px';
  }
  _createGaugeElement(usedTime, effectTime, recastTime) {
    const template = document.querySelector('#gaugeTemplate'),
      clone = document.importNode(template.content, true);
    clone.querySelector('.effectTime').style.height = (CONSTANT.PIXELS_PER_SECONDS * effectTime) + 'px';
    clone.querySelector('.recastTime').style.height = (CONSTANT.PIXELS_PER_SECONDS * (recastTime - effectTime)) + 'px';
    clone.children[0].style.top = this._usedTimeToPX(usedTime);
    return clone.children[0];
  }
  setGaugeOffset(usedTime) {
    this.element.style.top = this._usedTimeToPX(usedTime);
  }
  _mouseDown(e) {
    e.stopPropagation();
    console.log('mousedown', e);
    // クリックした座標を記憶しておく
    console.log(e.offsetY);
    this.offsetX = e.offsetX;
    this.offsetY = e.offsetY;
    this.pageX = e.pageX;
    this.pageY = e.pageY;

    this._holding();

    document.addEventListener('mousemove', this._bindedMouseMove, false);
    document.addEventListener('mouseup', this._mouseUp.bind(this), {
      once: true
    });
  }
  _mouseUp() {
    console.log('mouseup');
    this._unholding();

    document.removeEventListener('mousemove', this._bindedMouseMove, false);
  }
  _mouseMove(e) {
    // クリック開始地点と現在のマウスの位置との距離を比較する
    // √{(width1 - width2)^2+(height1 - height2)^2}
    let distance = Math.floor(Math.sqrt((this.pageX - e.pageX) ** 2 + (this.pageY - e.pageY) ** 2));

    // 直線距離が一定を超えているかつ、水平距離が一定を超えていたら
    if (distance > 32 && Math.abs(this.pageX - e.pageX) > 44) {
      if (!this.floating) {
        // 削除準備状態にする
        this.floating = true;
        this.element.classList.add('floatingGauge');
      }
      // マウスに追従させる
      this.element.style.top = 0;
      this.element.style.transform = 'translate(' + (e.clientX - this.offsetX) + 'px, ' + (e.clientY - this.offsetY) + 'px)';

    } else {
      if (this.floating) {
        // 削除準備状態を解除
        this.floating = false;
        this.element.classList.remove('floatingGauge');
        this.element.style.transform = '';
        this.setGaugeOffset(this.gauge.getUsedTime());
      }
      this._moveGauge(e.pageY);
    }
    e.preventDefault();
  }
  // ゲージを移動させる
  _moveGauge(absoluteY) {
    // コンテナ内におけるゲージのX座標[px]
    let movementAmount = 0;
    // マウスのY座標分を足す
    movementAmount += absoluteY;
    // コンテナ上部の余白を引く
    movementAmount -= this.containerOffsetTop;
    // PIXELS_PER_SECONDSで割った余りを引く
    movementAmount -= movementAmount % CONSTANT.PIXELS_PER_SECONDS;
    // クリック地点までずらす
    movementAmount -= this.offsetY;

    // データ内部のゲージの位置[秒]
    let currentSeconds = (movementAmount) / CONSTANT.PIXELS_PER_SECONDS;

    // movementAmountの値が変わらなかったら終了
    if (this.movementAmount == movementAmount) {
      return false;
    }

    let overlappingGauge = this.gauge.parent.getGaugeByTime(currentSeconds, this.gauge);
    // ゲージが重複していたら詰めて配置する
    if (overlappingGauge) {
      const median = Math.floor(this.gauge.getRecastTime() / 2);
      const usedTime = overlappingGauge.getUsedTime();
      const mousePosYSec = (movementAmount + this.offsetY) / CONSTANT.PIXELS_PER_SECONDS;
      if (mousePosYSec > usedTime + median) {
        // マウスの位置が中央値より下だったら
        // 重なっているゲージの上に詰める
        movementAmount = (usedTime + this.gauge.getRecastTime()) * CONSTANT.PIXELS_PER_SECONDS;
      } else {
        // マウスの位置が中央より上だったら
        // 重なっているゲージの上に詰める
        movementAmount = (usedTime - this.gauge.getRecastTime()) * CONSTANT.PIXELS_PER_SECONDS;
      }

      currentSeconds = (movementAmount) / CONSTANT.PIXELS_PER_SECONDS;
      overlappingGauge = this.gauge.parent.getGaugeByTime(currentSeconds, this.gauge);
      // 移動先にもゲージがあった場合は移動しない
      if (overlappingGauge) return false;
      // ゲージ末尾が頂点より上だったら移動しない
      let gaugeEnd = -1 * (this.gauge.getRecastTime() * CONSTANT.PIXELS_PER_SECONDS - 1);
      if (movementAmount < gaugeEnd) return false;
    }


    let gaugeEnd = -1 * (this.gauge.getRecastTime() * CONSTANT.PIXELS_PER_SECONDS - 1);
    // ゲージ末尾が頂点より上だったら一秒分だけはみ出るようにする
    if (movementAmount < gaugeEnd) movementAmount = gaugeEnd + CONSTANT.PIXELS_PER_SECONDS;

    if (!this.moved) this.moved = true;
    // movementAmountを更新
    this.movementAmount = movementAmount;

    this.element.style.top = 0;
    this.element.style.transform = 'translateY(' + movementAmount + 'px)';
  }
  // 要素諸々を確保する
  _holding() {
    document.querySelector('#overlayForPointer').classList.remove('hidden');
    this.element.classList.add('holdingGauge');
  }
  // 要素諸々を開放する
  _unholding() {
    document.querySelector('#overlayForPointer').classList.add('hidden');
    if (this.floating) {
      // ゲージを削除する
      this.gauge.parent.removeGauge(this.gauge);
      this.element.parentNode.removeChild(this.element);
    } else {
      // 動いたフラグがtrueならgaugeを移動させる
      if (this.moved) {
        this.moved = false;
        this.gauge.parent.tryMoveGauge(this.gauge, this.movementAmount / CONSTANT.PIXELS_PER_SECONDS);

      }
      this.element.classList.remove('holdingGauge');
    }
  }
}


const getActions = function (name) {
  return ACTIONS_DATA.get(name);
}
const parseActions = function (actions, name) {
  if (!actions) return false;
  const actionList = new ActionList(name);
  for (let i in actions) {
    let action = new Action(actions[i].name, actions[i].effectTime, actions[i].recastTime, i, actions[i].fileName);
    actionList.pushList(action);
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
