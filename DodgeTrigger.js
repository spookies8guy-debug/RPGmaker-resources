//=============================================================================
// DodgeTrigger.js
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
 * @plugindesc 戦闘中に攻撃を回避した時をトリガーにして、。
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
 * また、本プラグインはDodgeTriggerSystem.jsの副産物であり、機能縮小版です。
 * こちらのプラグインで機能的に充分である場合、
 * あるいはDodgeTriggerSystem.jsで不具合が発生した場合の代用としてご利用ください。
 * なお、スクリプトが省略されているだけで基本的に同一の記述がされているため、
 * DodgeTriggerSystem.jsと他のプラグインとの競合回避を保証するものではありません。
 * 重ねて、その旨もご了承ください。
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
 * 回避時にTP 20 ポイントを回避者に加える。
 * <DodgeTP:20>
 *
 * 回避時にスキルID:18 を使って、回避者が攻撃者に対して発動する。
 * <DodgeSkill:18>
 *
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

  const _Game_Action_apply = Game_Action.prototype.apply;
  Game_Action.prototype.apply = function (target) {
    _Game_Action_apply.call(this, target);

    if (!target.result().evaded) return;

    const objects = dodgeObjects(target);

    for (const obj of objects) {
      if (obj.meta.DodgeGrant) {
        const ids = obj.meta.DodgeGrant.split(",");
        ids.forEach((id) => target.addState(Number(id)));
      }

      if (obj.meta.DodgeRemove) {
        const ids = obj.meta.DodgeRemove.split(",");
        ids.forEach((id) => target.removeState(Number(id)));
      }

      if (obj.meta.DodgeTP) {
        target.gainTp(Number(obj.meta.DodgeTP));
      }

      if (obj.meta.DodgeSkill) {
        const skillId = Number(obj.meta.DodgeSkill);
        target.forceAction(skillId, -1);
        BattleManager.forceAction(target);
      }
    }
  };
})();
