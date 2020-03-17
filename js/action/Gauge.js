// ゲージ単体のクラス
export default class Gauge {
  constructor(parent, usedTime, effectTime, recastTime) {
    this.parent = parent;
    this.usedTime = usedTime;
    this.effectTime = effectTime;
    this.recastTime = recastTime;
    this.holding = false;
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
  hold() {
    this.holding = true;
  }
  unhold() {
    this.holding = false;
  }
  isHolding() {
    console.log(this.holding);
    if (this.holding) return true;
    return false;
  }
}
