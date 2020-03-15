import Gauge from './Gauge.js';
// ゲージをまとめて管理するクラス
export default class GaugeList {
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
