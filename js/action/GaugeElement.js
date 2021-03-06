// 定数を読み込み
import CONSTANT from '../constant/CONSTANT.js';

export default class GaugeElement {
  constructor(gauge, gaugeContainer) {
    this.gauge = gauge;
    this.gaugeContainer = gaugeContainer;
    this.containerOffsetTop = gaugeContainer.getBoundingClientRect().top + window.pageYOffset;

    this.offsetX;
    this.offsetY;
    this.pageX;
    this.pageY;

    this.moved;
    this.seconds = false;

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

    // 効果時間が0秒だったら非表示にしておく
    if (effectTime <= 0) clone.querySelector('.effectTime').style.display = 'none';

    clone.querySelector('.recastTime').style.height = (CONSTANT.PIXELS_PER_SECONDS * (recastTime - effectTime)) + 'px';
    clone.children[0].style.top = this._usedTimeToPX(usedTime);

    return clone.children[0];
  }
  setGaugeOffset(usedTime) {
    this.element.style.top = this._usedTimeToPX(usedTime);
  }
  _mouseDown(e) {
    e.stopPropagation();
    console.log('mousedown', this.gauge.getUsedTime());
    // クリックした座標を記憶しておく
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
    let mouseRelativePosY = 0;
    // マウスのY座標分を足す
    mouseRelativePosY += absoluteY;
    // コンテナ上部の余白を引く
    mouseRelativePosY -= this.containerOffsetTop;
    // クリック地点までずらす
    mouseRelativePosY -= this.offsetY;

    // データ内部のゲージの位置[秒]
    let currentSeconds = Math.floor(mouseRelativePosY / CONSTANT.PIXELS_PER_SECONDS);

    if (this.seconds == currentSeconds) return false;

    if (!this.moved) this.moved = true;

    let placeableSeconds = this.gauge.parent.getPlaceableSeconds(currentSeconds);

    if (placeableSeconds === false) return false;

    // secondsを更新
    this.seconds = placeableSeconds;

    this.element.style.top = 0;
    this.element.style.transform = 'translateY(' + (placeableSeconds * CONSTANT.PIXELS_PER_SECONDS) + 'px)';
  }
  // 要素諸々を確保する
  _holding() {
    document.querySelector('#overlayForPointer').classList.remove('hidden');
    this.element.classList.add('holdingGauge');
    this.gauge.hold();
  }
  // 要素諸々を開放する
  _unholding() {
    document.querySelector('#overlayForPointer').classList.add('hidden');
    this.gauge.unhold();
    if (this.floating) {
      // ゲージを削除する
      this.gauge.parent.removeGauge(this.gauge);
      this.element.parentNode.removeChild(this.element);
    } else {
      // 動いたフラグがtrueならgaugeを移動させる
      if (this.moved) {
        this.moved = false;
        this.gauge.parent.tryMoveGauge(this.gauge, this.seconds);

      }
      this.element.classList.remove('holdingGauge');
    }
  }
}
