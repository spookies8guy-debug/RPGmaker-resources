//=============================================================================
// DodgeTriggerSystem.js
// ----------------------------------------------------------------------------
// (C)2025 Ichiya Yanagawa
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2026/3/11 初版
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Provides a system that activates when attacks are evaded.
 * @author Ichiya Yanagawa
 *
 */
/*:ja
 * @target MZ
 * @plugindesc 戦闘中に攻撃を回避した時、ステートの付与・除去、スキル発動などを行う。
 * @author 柳川一夜
 *
 * @help 攻撃を回避した時に発動するシステムを提供します。
 * アクター・武器・防具・敵キャラ・ステートのメモ欄にタグを書き込むことで機能します。
 * 実際に書き込むタグは下記のサンプルをコピーして改変の上でご利用ください。
 * このプラグインには、プラグインパラメータ・プラグインコマンドはありません。
 * このプラグインはMITライセンスです。
 *
 *
 * このプラグインは、100%回避するステートを付与した時に１度回避した瞬間効果終了する、
 * つまり某ゲームの精神コマンド『ひらめき』を再現するために作ったものです。
 * 色々と拡張こそしたものの、どのような不具合を抱えているか今一つ想定されていません。
 * 特に、回避判定や反撃判定に関するプラグインと干渉する可能性があります。
 * 予めご了承ください。
 *
 * ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
 * 利用可能なタグサンプル
 *
 * 回避時にステートID:10 を回避者に付与する。
 * <DodgeGrant:10>
 *
 * 回避時にステートID:5 を回避者から除去する。
 * <DodgeRemove:5>
 *
 * 回避時にステートID:12 を攻撃者に付与する。
 * <DodgeEnemyState:12>
 *
 * 回避時にTP 20 ポイントを回避者に加える。
 * <DodgeTP:20>
 *
 * 回避時にスキルID:18 を使って、回避者が攻撃者に対して発動する。
 * <DodgeSkill:18>
 *
 * ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
 * 発動条件を設定したい場合のタグサンプル
 *
 * 回避時に 50 % で回避トリガー効果を発動
 * <DodgeChance:50>
 *
 * 回避したスキルの命中判定が物理攻撃である場合に回避トリガー効果を発動
 * <DodgePhysicalOnly>
 *
 * 回避したスキルの命中判定が魔法攻撃である場合に回避トリガー効果を発動
 * <DodgeMagicalOnly>
 *
 * ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
 * 実際に利用した場合のタグサンプル
 *
 * 『攻撃を回避した時、回避したスキルが物理攻撃の場合、
 * 　４０％の確率でスキルID:25 を使用して反撃する』
 * <DodgeSkill:25>
 * <DodgePhysicalOnly>
 * <DodgeChance:40>
 *
 * 『攻撃を回避した時、回避者にステートID:10 を付与し、ステートID::5 を除去する』
 * <DodgeGrant:10>
 * <DodgeRemove:5>
 *
 */
(() => {
  function dodgeObjects(battler) {
    let list = [];

    if (battler.isActor()) {
      list.push(battler.actor());
      list = list.concat(battler.equips().filter((e) => e));
    } else {
      list.push(battler.enemy());
    }

    list = list.concat(battler.states());

    return list;
  }

  function checkChance(meta) {
    if (!meta.DodgeChance) return true;
    const chance = Number(meta.DodgeChance);
    return Math.random() * 100 < chance;
  }

  function checkHitType(action, meta) {
    if (meta.DodgePhysicalOnly && !action.isPhysical()) return false;
    if (meta.DodgeMagicalOnly && !action.isMagical()) return false;
    return true;
  }

  const _Game_Action_apply = Game_Action.prototype.apply;
  Game_Action.prototype.apply = function (target) {
    _Game_Action_apply.call(this, target);

    if (!target.result().evaded) return;

    const subject = this.subject();
    const objects = dodgeObjects(target);

    for (const obj of objects) {
      const meta = obj.meta;

      if (!checkChance(meta)) continue;
      if (!checkHitType(this, meta)) continue;

      if (meta.DodgeGrant) {
        const ids = meta.DodgeGrant.split(",");
        ids.forEach((id) => target.addState(Number(id)));
      }

      if (meta.DodgeRemove) {
        const ids = meta.DodgeRemove.split(",");
        ids.forEach((id) => target.removeState(Number(id)));
      }

      if (meta.DodgeEnemyState) {
        const ids = meta.DodgeEnemyState.split(",");
        ids.forEach((id) => subject.addState(Number(id)));
      }

      if (meta.DodgeTP) {
        target.gainTp(Number(meta.DodgeTP));
      }

      if (meta.DodgeSkill) {
        const skillId = Number(meta.DodgeSkill);
        target.forceAction(skillId, subject.index());
        BattleManager.forceAction(target);
      }
    }
  };
})();
