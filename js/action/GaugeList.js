import Gauge from './Gauge.js';
// ゲージをまとめて管理するクラス
export default class GaugeList {
  constructor(effectTime, recastTime) {
    this.effectTime = effectTime;
    this.recastTime = recastTime;
    this.list = [];
  }
  canPushGauge(usedTime) {
    if (!(this._isOverlapping(usedTime))) {
      return true;
    }
    return false;
  }
  tryPushGauge(usedTime) {
    if (this.canPushGauge(usedTime)) {
      const gauge = new Gauge(this, usedTime, this.getEffectTime(), this.getRecastTime());
      this.list.push(gauge);
      return gauge;
    }
    return false;
  }
  canMoveGauge(gauge, time) {
    console.log('time', time);
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
      if (gauge.isHolding()) continue;
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
  getPlaceableSeconds(targetSeconds) {
    let placeableSeconds = targetSeconds;
    let minSeconds = -1 * (this.getRecastTime());
    const overlappingGauge = this.getGaugeByTime(targetSeconds);
    // 重なっているゲージが存在しなければ
    if (!overlappingGauge) {
      // ゲージ末尾が頂点より上だったら一秒分だけはみ出るようにする
      if (targetSeconds <= minSeconds) placeableSeconds = minSeconds + 1;
      return placeableSeconds;
    }

    const median = Math.floor(this.getRecastTime() / 2);
    const usedTime = overlappingGauge.getUsedTime();
    if (targetSeconds > usedTime + median) {
      // targetSecondsが中央値より下だったら
      // 重なっているゲージの上に詰める
      placeableSeconds = usedTime + this.getRecastTime();
    } else {
      // targetSecondsの位置が中央より上だったら
      // 重なっているゲージの上に詰める
      placeableSeconds = usedTime - this.getRecastTime();
    }

    // 移動先にもゲージがあった場合は配置不可能
    if (this.getGaugeByTime(placeableSeconds)) {
      return false;
    }

    if (placeableSeconds <= minSeconds) {
      // ゲージ末尾が頂点より上だったら配置不可能
      return false;
    }

    return placeableSeconds;
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
