//=============================================================================
// BattleMusicChanger.js
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
 * @plugindesc 戦闘中の「戦う」コマンドを選択したときにBGMを変更するプラグイン
 * @author 柳川一夜
 * @version 1.0.0
 *
 * @help
 * このプラグインは、バトルシーンで「戦う」コマンドが選択されたときに
 * BGMを変更する機能を提供します。
 * 使いたいBGMと、このプラグインを動かすための変数を登録してください。
 * BGMのリストと変数が連動し、登録したBGMのIDと変数の値が一致した曲を再生します。
 * 変数の値がBGMのIDと一致しない場合は登録されたBGMの中からランダムに再生します。
 *
 *
 * @param BattleBGMs
 * @text 戦闘中に切り替え再生するBGMリスト
 * @desc 戦闘中に再生するBGMファイルを複数選択できます。
 * @type file[]
 * @dir audio/bgm/
 * @default ["Battle2","Battle3","Battle4"]
 *
 * @param BGMVolume
 * @text BGMの音量
 * @desc 戦闘の開始時に再生するBGMの音量
 * @default 90
 *
 * @param BGMPitch
 * @text BGMのピッチ
 * @desc 戦闘の開始時に再生するBGMのピッチ
 * @default 100
 *
 * @param BGMPan
 * @text BGMのパン
 * @desc 戦闘の開始時に再生するBGMのパン
 * @default 0
 *
 * @param BGMIdVariable
 * @text BGMを選ぶ変数ID
 * @desc この変数の値によって、選ばれるBGMを変更します。
 * @type variable
 * @default 1
 */

(() => {
  // プラグインパラメータの取得
  const parameters = PluginManager.parameters("BattleMusicChanger");
  const battleBGMs = JSON.parse(
    parameters["BattleBGMs"] || '["Battle2","Battle3","Battle4"]'
  );
  const bgmVolume = Number(parameters["BGMVolume"] || 90);
  const bgmPitch = Number(parameters["BGMPitch"] || 100);
  const bgmPan = Number(parameters["BGMPan"] || 0);
  const bgmIdVariable = Number(parameters["BGMIdVariable"] || 1);

  // Scene_Battleのfightコマンド選択時にBGMを変更する
  const _Scene_Battle_commandFight = Scene_Battle.prototype.commandFight;
  Scene_Battle.prototype.commandFight = function () {
    // ゲーム内の変数の値を取得
    const variableValue = $gameVariables.value(bgmIdVariable);

    // 変数の値を使ってBGMを選択（範囲外の場合はランダム）
    let selectedBGM;
    if (variableValue >= 1 && variableValue <= battleBGMs.length) {
      selectedBGM = battleBGMs[variableValue - 1]; // 配列は0から始まるので-1
    } else {
      // 範囲外の場合はランダムにBGMを選ぶ
      selectedBGM = battleBGMs[Math.floor(Math.random() * battleBGMs.length)];
    }

    // 音楽を変更する
    AudioManager.playBgm({
      name: selectedBGM,
      volume: bgmVolume,
      pitch: bgmPitch,
      pan: bgmPan,
    });

    // 元々の処理を呼び出す
    _Scene_Battle_commandFight.call(this);
  };
})();
