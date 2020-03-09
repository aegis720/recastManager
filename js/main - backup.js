const CONSTANT = {
  PADDING: 0,
  // ヘッダーの高さ
  HEADER_HEIGHT: 64,
  // フッターの高さ
  FOOTER_HEIGHT: 64,
  // 列の幅
  COLUMN_WIDTH: 64,
  // 1秒表記ごとの高さ(px)
  PIXELS_PER_SECONDS: 8
};

const getTimelineHeight = function () {
  let height = (CONSTANT.PIXELS_PER_SECONDS * (battleTimeSeconds + 1));
  return height;
}
const getFinalyHeight = function () {
  let height = (CONSTANT.PIXELS_PER_SECONDS * battleTimeSeconds) + CONSTANT.HEADER_HEIGHT + CONSTANT.FOOTER_HEIGHT + (CONSTANT.PADDING * 2);
  return height;
}
const setContainerHeight = function (height) {
  document.querySelector('#container').style.height = height + 'px';
}

// アクションをまとめて管理するクラス
class ActionList {
  constructor() {
    this.index = 0;
    this.list = [];
  }
  pushList(action) {
    action.setIndex(this.index);
    this.list.push(action);
    ++(this.index);
  }
  appendActions() {
    const container = document.querySelector('#actionsContainer');
    const recastTimeContainer = document.querySelector('#recastTimeContainer');
    for (let action of this.list) {
      let leftMargin = (action.getIndex() + 2) * CONSTANT.COLUMN_WIDTH;
      action.actionElements.setLeftMargin(leftMargin);
      action.gaugeList.setLeftMargin(leftMargin);

      action.actionElements.icon.style.top = '8px';
      action.actionElements.icon.style.left = leftMargin + 'px';

      container.appendChild(action.actionElements.icon);

      action.gaugeList.getGaugeContainer().style.top = CONSTANT.HEADER_HEIGHT + 'px';
      action.gaugeList.getGaugeContainer().style.left = leftMargin + 'px';
      recastTimeContainer.appendChild(action.gaugeList.getGaugeContainer());
    }
  }
}

// アクションを管理するクラス
class Action {
  constructor(name, effectTime, recastTime, fileName) {
    this.name = name;
    this.effectTime = effectTime;
    this.recastTime = recastTime;
    this.gaugeList = new GaugeList(effectTime, recastTime);
    this.index = undefined;
    this.actionElements = new ActionElements(this, fileName);
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
}
// ゲージをまとめて管理するクラス
class GaugeList {
  constructor(effectTime, recastTime) {
    this.effectTime = effectTime;
    this.recastTime = recastTime;
    this.list = [];
    this.previeGauge = this._createPreviewGauge();
    this.gaugeContainer = this._createGaugeContainer();
    this.leftMargin = 0;

    document.querySelector('#recastTimeContainer').appendChild(this.previeGauge);
  }
  // ゲージの要素を作成
  _createGaugeElement() {
    let template = document.querySelector("#actionTemplate");
    let clone = document.importNode(template.content, true);
    clone.querySelector('.effectTime').style.height = this.getEffectTime() * CONSTANT.PIXELS_PER_SECONDS + 'px';
    clone.querySelector('.recastTime').style.height = this.getTimeDifference() * CONSTANT.PIXELS_PER_SECONDS + 'px';
    return clone.querySelector('.action');
  }
  // プレビュー用ゲージの要素を作成
  _createPreviewGauge() {
    let gauge = this._createGaugeElement();
    gauge.classList.add('previewGauge');
    gauge.style.width = (CONSTANT.COLUMN_WIDTH * .8) + 'px';
    gauge.style.left = this.getLeftMargin;
    return gauge;
  }
  // ゲージ格納用の要素を作成
  _createGaugeContainer() {
    let container = document.createElement('div');
    container.classList.add('gaugeContainer');
    container.style.height = getTimelineHeight() + 'px';
    container.style.width = (CONSTANT.COLUMN_WIDTH) + 'px';
    console.log(container);
    container.addEventListener('mouseenter', this._mouseoverContainer, true);
    container.addEventListener('mouseleave', this._mouseoutContainer, true);
    return container;
  }
  _mouseoverContainer(event) {
    console.log('mouseenter:', this, event);
  }
  _mouseoutContainer(event) {
    console.log('mouseleave:', this, event);
  }
  getGaugeContainer() {
    return this.gaugeContainer;
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
  getLeftMargin() {
    return this.leftMargin;
  }
  setLeftMargin(leftMargin) {
    this.leftMargin = leftMargin;
  }
}
// ゲージ単体のクラス
class Gauge {
  constructor(effectTime, recastTime) {
    this.effectTime = effectTime;
    this.recastTime = recastTime;
  }
}
// アクションの要素を管理するクラス
class ActionElements {
  constructor(parentObject, fileName) {
    this.parentObject = parentObject;
    this.icon = this._createIcon(fileName);
    this.leftMargin = 0;
  }
  // アイコンの要素を作成
  _createIcon(fileName) {
    // res/actions/paladin/Fight_or_Flight.png
    let template = document.querySelector("#actionIcon");
    let clone = document.importNode(template.content, true);
    let img = clone.querySelector(".img");
    img.src = "res/actions/" + fileName;
    clone.querySelector('.iconContainer').style.width = CONSTANT.COLUMN_WIDTH + 'px';
    return clone.querySelector('.iconContainer');
  }
  getLeftMargin() {
    return this.leftMargin;
  }
  setLeftMargin(leftMargin) {
    this.leftMargin = leftMargin;
  }
}
// 0 を 00にする関数
const zeroPadding = function (number) {
  return ('00' + number).slice(-2);
}
const initTimeRuler = function (battleTimeSeconds) {
  for (var i = 0, j = battleTimeSeconds; i <= j; i++) {
    let element,
      minutes,
      seconds;
    minutes = Math.floor(i / 60);
    seconds = i % 60;

    minutes = zeroPadding(minutes);
    seconds = zeroPadding(seconds);

    if (i % 10 == 0) {
      // 処理中の秒が10の倍数なら 
      let template = document.querySelector('#timeRuler');
      let clone = document.importNode(template.content, true);
      element = clone.querySelector('.timeRuler');
      if (i != 0) {
        // 0だったら時間を表示しない
        element.querySelector('.time').textContent = minutes + ':' + seconds;
      }
    } else {
      element = document.createElement('div');
      element.classList.add('horizontalLine');
    }
    element.style.top = ((CONSTANT.PIXELS_PER_SECONDS * i) + CONSTANT.HEADER_HEIGHT + CONSTANT.PADDING) + 'px';
    element.style.left = CONSTANT.PADDING + 'px';
    //  element.style.top = (CONSTANT.PIXELS_PER_SECONDS * i + CONSTANT.HEADER_HEIGHT) + 'px';
    document.getElementById('timeDisplayContainer').appendChild(element);
  }

}
let battleTimeSeconds = 608;
initTimeRuler(battleTimeSeconds);
const height = getFinalyHeight();
setContainerHeight(height);

const actionList = new ActionList()
actionList.pushList(new Action('Fight or Flight', 25, 60, 'paladin/Fight_or_Flight.png'));
actionList.pushList(new Action('Requiescat', 25, 60, 'paladin/Requiescat.png'));
actionList.pushList(new Action('Divine Veil', 25, 60, 'paladin/Divine_Veil.png'));
actionList.pushList(new Action('Passage of Arms', 25, 60, 'paladin/Passage_of_Arms.png'));
actionList.pushList(new Action('Hallowed Ground', 25, 60, 'paladin/Hallowed_Ground.png'));
actionList.appendActions();
