//=============================================================================
// MouseEventStart.js
// ----------------------------------------------------------------------------
// (C)2025 Ichiya Yanagawa
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2025/11/16 初版
//=============================================================================

/*:
 * @target MZ
 * @plugindesc 特定スイッチONのときだけマウスクリックでイベントを起動するプラグイン
 * @author Ichiya Yanagawa
 *
 * @param SwitchID
 * @text 有効化スイッチID
 * @type switch
 * @desc このスイッチがONのときだけマウスクリックでイベントが起動します。
 * @default 1
 *
 * @help
 * ■ 概要
 * マップ上でイベントをマウス操作の左クリックすると、
 * プレーヤーキャラクターの座標に関係なくそのイベントが直接起動します。
 * このプラグインでは特定のスイッチがONのときだけ反応します。
 * また、設定したスイッチがOFFである時、マウス操作を受け付けなくなります。
 *
 * ■ 起動条件
 * - イベントの「トリガー」が「決定ボタン」のとき
 * - 指定したスイッチがONのとき
 *
 * ■ 使い方
 * 1. プラグインを導入し、有効化。
 * 2. プラグインパラメータで「有効化スイッチID」を指定。
 * 3. ゲーム中、そのスイッチがONのときだけマウスクリックでイベントが起動します。
 *
 * ■ 注意事項
 * このプラグインはキーボード(あるいはゲームパッド)とマウス操作をそれぞれ個別に要求する仕様を想定しています。
 * 設定したスイッチがOFFの間はマウスクリックによるプレイヤーキャラクターの移動なども動作しなくなります。
 * もしも、ゲーム開始直後からマウス操作を許可したい場合はスイッチONにすることを忘れないようにしてください。
 */

(() => {
  const parameters = PluginManager.parameters("MouseEventStart");
  const switchId = Number(parameters["SwitchID"] || 1);

  const _Scene_Map_onMapTouch = Scene_Map.prototype.onMapTouch;
  Scene_Map.prototype.onMapTouch = function () {
    // まずスイッチONかどうか確認
    if (!$gameSwitches.value(switchId)) return;

    if (TouchInput.isTriggered()) {
      const x = $gameMap.canvasToMapX(TouchInput.x);
      const y = $gameMap.canvasToMapY(TouchInput.y);
      const events = $gameMap.eventsXy(Math.floor(x), Math.floor(y));

      for (const ev of events) {
        // 決定ボタンで起動するイベントだけ反応
        if (ev.list() && ev.isTriggerIn([0, 1, 2])) {
          ev.start();
          return;
        }
      }
    }
    _Scene_Map_onMapTouch.call(this);
  };
})();
