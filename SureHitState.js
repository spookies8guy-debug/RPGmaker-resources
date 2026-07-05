//=============================================================================
// SureHitState
//=============================================================================
// Version
// 1.0. 2026/07/05 初版
//=============================================================================
/*:
/*:
 * @target MZ
 * @plugindesc 指定ステート中はスキルを必中にする v1.0.0
 * @author ChatGPT
 *
 * @param StateId
 * @text 必中ステートID
 * @type state
 * @default 1
 * @desc このステートが付与されている間、使用するスキルが必中になります。
 *
 * @help
 * ■概要
 * 指定したステートが付与されている間、
 * 使用するスキルの命中率を100%にし、回避も無効化します。
 *
 * 対象
 * ・物理攻撃
 * ・魔法攻撃
 * ・命中タイプが「必中」のスキルには影響しません。
 *
 * プラグインコマンドはありません。
 * 
 * ◆使い方
 * プラグインコマンドで必中ステートにしたいIDを指定します。
 * 他、メモ欄等への操作はありません。
 */

(() => {
  "use strict";

  const pluginName = document.currentScript.src.match(/([^\/]+)\.js$/)[1];
  const parameters = PluginManager.parameters(pluginName);

  const stateId = Number(parameters["StateId"] || 1);

  //--------------------------------------------------------------------------
  // 命中率
  //--------------------------------------------------------------------------

  const _Game_Action_itemHit = Game_Action.prototype.itemHit;
  Game_Action.prototype.itemHit = function (target) {
    if (this.subject().isStateAffected(stateId)) {
      // 必中スキルは元の処理
      if (this.item().hitType === 0) {
        return _Game_Action_itemHit.call(this, target);
      }

      return 1.0;
    }

    return _Game_Action_itemHit.call(this, target);
  };

  //--------------------------------------------------------------------------
  // 回避率
  //--------------------------------------------------------------------------

  const _Game_Action_itemEva = Game_Action.prototype.itemEva;
  Game_Action.prototype.itemEva = function (target) {
    if (this.subject().isStateAffected(stateId)) {
      if (this.item().hitType === 0) {
        return _Game_Action_itemEva.call(this, target);
      }

      return 0;
    }

    return _Game_Action_itemEva.call(this, target);
  };
})();
