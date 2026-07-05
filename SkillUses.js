//=============================================================================
// SkillUses
//=============================================================================
// Version
// 1.1. 2026/07/02 プラグインコマンドを追加
// 1.0. 2026/07/02 初版
//=============================================================================
/*:
 * @target MZ
 * @plugindesc スキル使用回数制限 v1.1
 * @author Ichiya Yanagawa
 *
 * @command RecoverAllSkillUses
 * @text スキル使用回数を全回復
 * @desc パーティ全員のスキル使用回数を最大まで回復します。
 *
 * @help
 * 例えばスキルのメモ欄に、
 *
 * <SkillUses:3>
 *
 * と書くと3回まで使用できます。
 *
 * このプラグインにはプラグインコマンドがあります。
 *
 * RecoverAllSkillUses
 *
 * パーティ全員のスキル使用回数を最大まで回復します。
 *
 * 通常の全回復コマンドでは使用回数は回復できません。
 */

(() => {
  const pluginName = document.currentScript.src.match(/^.*\/(.*)\.js$/)[1];

  //==============================
  // 初期化
  //==============================

  const _Game_Actor_setup = Game_Actor.prototype.setup;
  Game_Actor.prototype.setup = function (actorId) {
    _Game_Actor_setup.call(this, actorId);
    this.initSkillUses();
  };

  Game_Actor.prototype.initSkillUses = function () {
    this._skillUses = {};
  };

  Game_Actor.prototype.maxSkillUses = function (skill) {
    return Number(skill.meta.SkillUses || 0);
  };

  Game_Actor.prototype.skillUsesLeft = function (skill) {
    const max = this.maxSkillUses(skill);

    if (max <= 0) return Infinity;

    if (this._skillUses[skill.id] == null) {
      this._skillUses[skill.id] = max;
    }

    return this._skillUses[skill.id];
  };

  Game_Actor.prototype.consumeSkillUse = function (skill) {
    const max = this.maxSkillUses(skill);

    if (max > 0) {
      this._skillUses[skill.id]--;
    }
  };

  Game_Actor.prototype.restoreSkillUses = function () {
    this.skills().forEach((skill) => {
      const max = this.maxSkillUses(skill);

      if (max > 0) {
        this._skillUses[skill.id] = max;
      }
    });
  };

  //==============================
  // 使用可能判定
  //==============================

  const _canPaySkillCost = Game_BattlerBase.prototype.canPaySkillCost;

  Game_BattlerBase.prototype.canPaySkillCost = function (skill) {
    if (!_canPaySkillCost.call(this, skill)) {
      return false;
    }

    if (this.isActor()) {
      return this.skillUsesLeft(skill) > 0;
    }

    return true;
  };

  //==============================
  // 消費
  //==============================

  const _paySkillCost = Game_BattlerBase.prototype.paySkillCost;

  Game_BattlerBase.prototype.paySkillCost = function (skill) {
    _paySkillCost.call(this, skill);

    if (this.isActor()) {
      this.consumeSkillUse(skill);
    }
  };

  //==============================
  // プラグインコマンド
  //==============================

  PluginManager.registerCommand(pluginName, "RecoverAllSkillUses", () => {
    $gameParty.members().forEach((actor) => {
      actor.restoreSkillUses();
    });
  });
})();
