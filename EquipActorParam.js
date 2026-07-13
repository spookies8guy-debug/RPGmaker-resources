//=============================================================================
// EquipActorParam
//=============================================================================
// Version
// 1.1. 2026/07/13
// 		・メモタグを１つしか読み込めなかった問題を解消
// 		・装備とアクターが同一の場合の循環参照を防止
// 1.0. 2026/07/09 初版
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//=============================================================================
/*:
 * @target MZ
 * @plugindesc アクターのパラメータを装備に反映させる v1.0
 * @author Ichiya Yanagawa
 *
 *
 * @help
 * 武器・防具のメモ欄に、
 *
 * <CopyParam:アクターID,参照パラメータ>
 *
 * を書き込むことで、装備にアクターのパラメータを追加させます。
 *
 * 例えば、
 *
 * <CopyParam:1,mhp>
 *
 * この場合、アクターID 1 の 最大HP を加算、ということです。
 *
 * 参照できるパラメータは、
 *
 * mhp: 最大HP
 * mmp: 最大MP
 * atk: 攻撃力
 * def: 防御力
 * mat: 魔法攻撃力
 * mdf: 魔法防御力
 * agi: 敏捷
 * luk: 幸運
 *
 * 以上のデフォルト、通常パラメータの範囲です。
 *
 * また、
 *
 * <CopyTraits:アクターID>
 *
 * というメモタグを追加することで特徴を追加できます。
 * 特徴については個別取得は想定していません。
 * アクター固有の特徴 + 職業の特徴 を全て取得します。
 *
 *
 * 本プラグインは、
 * 『剣魔の剣』や『合体剣』、
 * あるいは、『ペルソナ』や『ガーディアン』といった、
 * 成長・ステータス変化する装備を実現するために開発しました。
 *
 *
 *
 * ※注意喚起※
 *
 * このプラグインは、循環参照バグへの対処が完全ではありません。
 * つまり、
 *
 * アクター１を参照する装備をアクター１に装着…
 *
 * あるいは、
 *
 * アクター２を参照する装備をアクター１に付けて、
 * アクター１を参照する装備をアクター２に付けると、
 * お互いに永遠に呼び出し続けてゲームが停止します。
 *
 * 相互に数値を呼び合うことが無いようにゲームを設計してください。
 *
 *
 */

const _Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;

const PARAM_MAP = {
  mhp: 0,
  mmp: 1,
  atk: 2,
  def: 3,
  mat: 4,
  mdf: 5,
  agi: 6,
  luk: 7,
};

Game_Actor.prototype.paramPlus = function (paramId) {
  let value = _Game_Actor_paramPlus.call(this, paramId);

  for (const item of this.equips()) {
    if (!item) continue;

    const regexp = /<CopyParam:([^>]+)>/g;
    let match;

    while ((match = regexp.exec(item.note)) !== null) {
      const [actorId, paramName] = match[1].split(",");

      if (PARAM_MAP[paramName] !== paramId) continue;

      const actor = $gameActors.actor(Number(actorId));
      if (!actor) continue;

      value += actor.paramBase(paramId);
      value += _Game_Actor_paramPlus.call(actor, paramId);
    }
  }

  return value;
};

const _Game_Actor_traitObjects = Game_Actor.prototype.traitObjects;

Game_Actor.prototype.traitObjects = function () {
  const objects = _Game_Actor_traitObjects.call(this);

  for (const item of this.equips()) {
    if (!item || !item.meta.CopyTraits) continue;

    const actorId = Number(item.meta.CopyTraits);
    const actor = $gameActors.actor(actorId);

    objects.push(...actor.equips().filter(Boolean));
    objects.push(actor.currentClass());
    objects.push(actor.actor());
  }

  return objects;
};
