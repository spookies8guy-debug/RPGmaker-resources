//=============================================================================
// CallCommonOK.js
// ----------------------------------------------------------------------------
// (C)2025 Ichiya Yanagawa
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2025/11/30 初版
//=============================================================================

/*:
 * @target MZ
 * @plugindesc In execution key, common event is activated.
 * @author Ichiya Yanagawa
 *
 *
 * @help In execution key, common event is activated.
 * It does not support mouse operation.
 * This plugin does not provide plugin commands.
 *
 */
/*:ja
 * @target MZ
 * @plugindesc 決定キーを押すとコモンイベントID1を呼び出すプラグイン
 * @author 柳川一夜
 *
 * @help 決定キーを押すとコモンイベントを呼び出すプラグイン。
 * マウス操作には対応していません。
 * このプラグインには、プラグインコマンドはありません。
 */
const _Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function () {
  _Scene_Map_update.call(this);
  // アクティブなイベントがない場合のみコモンイベントを呼び出す
  if (Input.isTriggered("ok") && !$gameMap.isEventRunning()) {
    $gameTemp.reserveCommonEvent(1); // コモンイベント1を呼び出す
  }
};
