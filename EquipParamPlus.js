//=============================================================================
// EquipParamPlus.js
// ----------------------------------------------------------------------------
// (C)2025 Ichiya Yanagawa
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2026/1/25 初版
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Plugin that implements equipment whose performance changes based on the wearer's parameters.
 * @author Ichiya Yanagawa
 *
 *
 * @help In addition to the standard parameters that fluctuate,
 * Implements equipment effects that provide adjustments based on the wearer's parameters.
 * This plugin does not provide plugin commands.
 *
 */
/*:ja
 * @target MZ
 * @plugindesc 装備者のパラメータに応じて性能変化する装備を実装するプラグイン
 * @author 柳川一夜
 *
 * @help 標準的に上下するパラメータとは別に、
 * 装備者のパラメータに準拠した補正を与える装備効果を実装します。
 * このプラグインには、プラグインコマンドはありません。
 *
 * 使い方
 * X に変化させたいパラメータ番号
 * ： の後に変化させたい補正値
 * 以下の内容をメモ欄に書き込む。
 *
 * <scaleParamX:数値>
 *
 * 使用例
 *
 * <scaleParam2:0.3>
 * 攻撃力 30 % 上昇
 *
 * <scaleParam4:-0.2>
 * 魔法攻撃力 20 % 低下
 */
(() => {
  const _paramPlus = Game_Actor.prototype.paramPlus;
  Game_Actor.prototype.paramPlus = function (paramId) {
    let value = _paramPlus.call(this, paramId);

    this.equips().forEach((equip) => {
      if (!equip) return;

      const metaKey = `scaleParam${paramId}`;
      if (equip.meta[metaKey]) {
        const rate = Number(equip.meta[metaKey]);
        value += Math.floor(this.paramBase(paramId) * rate);
      }
    });

    return value;
  };
})();
