//=============================================================================
// MouseOverEventID.js
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
 * @plugindesc マウスポインタがマップイベントに重なるとイベントIDを変数に格納するプラグイン
 * @author Ichiya Yanagawa
 *
 * @param VariableID
 * @text イベントID格納用変数ID
 * @type variable
 * @desc 現在マウスオーバーしているイベントのIDを格納する変数
 * @default 1
 *
 * @help
 * ■ 概要
 * マップ上でマウスポインタがイベント上にある場合、
 * そのイベントのIDを指定した変数に格納します。
 * イベントが無い場合は0が代入されます。
 *
 * ■ 使い方
 * 1. プラグインを導入し有効化。
 * 2. プラグインパラメータで「イベントID格納用変数ID」を設定。
 * 3. マウスがイベントの上に来ると、そのイベントIDがリアルタイムに変数に入ります。
 * 4. イベントが存在しない座標にマウスポインタが移動した場合は「0」が代入されます。
 *
 * ■ 注意
 * - 通常イベント（消去済み・透明含む）も対象になります。
 * - 複数イベントが重なっている場合は最前面のものを取得します。
 * - このプラグインは単独での利用を想定していません。
 * - 適宜、他のプラグインや並列処理などでのイベントを構築してください。
 */

(() => {
  const parameters = PluginManager.parameters("MouseOverEventID");
  const variableId = Number(parameters["VariableID"] || 1);

  // 前回のIDと比較して、変化があったときだけ更新（パフォーマンス対策）
  let lastEventId = 0;

  const _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    _Scene_Map_update.call(this);

    if (!this._mapLoaded) return; // マップロード前は何もしない

    // 現在のマウス座標をマップ座標に変換
    const x = $gameMap.canvasToMapX(TouchInput.x);
    const y = $gameMap.canvasToMapY(TouchInput.y);

    const events = $gameMap.eventsXy(Math.floor(x), Math.floor(y));
    let eventId = 0;

    // 一番上のイベント（最後に配置された）を優先
    if (events.length > 0) {
      eventId = events[events.length - 1].eventId();
    }

    // イベントIDが変化した場合のみ変数を更新
    if (eventId !== lastEventId) {
      $gameVariables.setValue(variableId, eventId);
      lastEventId = eventId;
    }
  };
})();
