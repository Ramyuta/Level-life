"use client";

import { useState } from "react";
import { useUser } from "../../user/context/UserContext";
import { useToast } from "../../../context/ToastContext";
import { useConfirm } from "../../../context/ConfirmContext";
import type { Equipment, EquipmentType } from "../../../lib/types";
import { Trash2 } from "lucide-react";

const TYPE_LABELS: Record<EquipmentType, string> = {
  weapon: "武器",
  armor: "防具",
  accessory: "アクセサリー",
};

const TYPE_ICONS: Record<EquipmentType, string> = {
  weapon: "⚔️",
  armor: "🛡️",
  accessory: "💍",
};

export default function InventoryPage() {
  const { user, equipItem, unequipItem, removeFromInventory, addGold } =
    useUser() as any;
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const [selectedType, setSelectedType] = useState<EquipmentType | "all">(
    "all"
  );

  const filteredInventory = user.inventory.filter((item: any) =>
    selectedType === "all" ? true : item.equipment.type === selectedType
  );

  const handleEquip = (equipment: Equipment) => {
    const success = equipItem(equipment);
    if (success) {
      showToast(`${equipment.name}を装備しました`, "success");
    } else {
      showToast(`レベル${equipment.requiredLevel}が必要です`, "error");
    }
  };

  const handleUnequip = (type: EquipmentType) => {
    unequipItem(type);
    showToast("装備を外しました", "info");
  };

  const handleSell = async (equipment: Equipment) => {
    const sellPrice = Math.floor(equipment.price * 0.5);
    const confirmed = await confirm({
      title: "売却確認",
      message: `${equipment.icon} ${equipment.name}を${sellPrice}ゴールドで売却しますか？`,
      confirmText: "売却",
    });

    if (!confirmed) return;

    // Check if equipped
    if (user.equippedItems[equipment.type]?.id === equipment.id) {
      showToast("装備中のアイテムは売却できません", "error");
      return;
    }

    removeFromInventory(equipment.id);
    // Add gold (using addGold from component level)
    addGold(sellPrice);
    showToast(
      `${equipment.name}を売却しました（+${sellPrice}ゴールド）`,
      "success"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-black text-white">
            🎒 インベントリ
          </h1>
          <p className="text-slate-400">装備の管理と着脱を行います</p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 ring-1 ring-yellow-500/30">
            <p className="text-sm text-yellow-200">ゴールド</p>
            <p className="text-2xl font-black text-yellow-400">
              💰 {user.stats.gold || 0}
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-4 ring-1 ring-blue-500/30">
            <p className="text-sm text-blue-200">レベル</p>
            <p className="text-2xl font-black text-blue-400">
              Lv. {user.level}
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 ring-1 ring-purple-500/30">
            <p className="text-sm text-purple-200">所持アイテム</p>
            <p className="text-2xl font-black text-purple-400">
              {user.inventory.length}
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 ring-1 ring-green-500/30">
            <p className="text-sm text-green-200">装備中</p>
            <p className="text-2xl font-black text-green-400">
              {Object.values(user.equippedItems).filter(Boolean).length} / 3
            </p>
          </div>
        </div>

        {/* Equipped Items */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-white">
            装備中のアイテム
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {(["weapon", "armor", "accessory"] as EquipmentType[]).map(
              (type) => {
                const equipped = user.equippedItems[type];
                return (
                  <div
                    key={type}
                    className="rounded-2xl bg-slate-800/50 p-6 ring-1 ring-slate-700"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-slate-300">
                        {TYPE_ICONS[type]} {TYPE_LABELS[type]}
                      </h3>
                      {equipped && (
                        <button
                          onClick={() => handleUnequip(type)}
                          className="text-sm text-red-400 hover:text-red-300"
                        >
                          外す
                        </button>
                      )}
                    </div>
                    {equipped ? (
                      <div className="text-center">
                        <div className="mb-2 text-4xl">{equipped.icon}</div>
                        <p className="font-semibold text-white">
                          {equipped.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {equipped.description}
                        </p>
                      </div>
                    ) : (
                      <div className="py-8 text-center text-slate-500">
                        未装備
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setSelectedType("all")}
            className={`rounded-lg px-4 py-2 font-semibold transition-all ${
              selectedType === "all"
                ? "bg-indigo-600 text-white ring-2 ring-indigo-500"
                : "bg-slate-700/80 text-slate-300 hover:bg-slate-700"
            }`}
          >
            全て ({user.inventory.length})
          </button>
          {(["weapon", "armor", "accessory"] as EquipmentType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                selectedType === type
                  ? "bg-indigo-600 text-white ring-2 ring-indigo-500"
                  : "bg-slate-700/80 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {TYPE_ICONS[type]} {TYPE_LABELS[type]} (
              {
                user.inventory.filter((i: any) => i.equipment.type === type)
                  .length
              }
              )
            </button>
          ))}
        </div>

        {/* Inventory Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredInventory.map((item: any) => {
            const isEquipped =
              user.equippedItems[item.equipment.type]?.id === item.equipment.id;
            const sellPrice = Math.floor(item.equipment.price * 0.5);

            return (
              <div
                key={item.equipment.id}
                className={`rounded-2xl bg-slate-800/50 p-6 ring-1 ${
                  isEquipped ? "ring-green-500" : "ring-slate-700"
                } transition-all hover:scale-105`}
              >
                {isEquipped && (
                  <div className="mb-2 text-center text-xs font-semibold text-green-400">
                    ✓ 装備中
                  </div>
                )}
                <div className="mb-4 text-center text-6xl">
                  {item.equipment.icon}
                </div>
                <h3 className="mb-2 text-center font-bold text-white">
                  {item.equipment.name}
                </h3>
                <p className="mb-4 text-center text-sm text-slate-400">
                  {item.equipment.description}
                </p>
                <div className="space-y-2">
                  {!isEquipped && (
                    <button
                      onClick={() => handleEquip(item.equipment)}
                      className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2 font-bold text-white transition-all hover:from-indigo-500 hover:to-purple-500 active:scale-95"
                    >
                      装備する
                    </button>
                  )}
                  <button
                    onClick={() => handleSell(item.equipment)}
                    disabled={isEquipped}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-2 font-semibold transition-all ${
                      isEquipped
                        ? "cursor-not-allowed bg-slate-700 text-slate-500"
                        : "bg-slate-700 text-yellow-400 hover:bg-slate-600"
                    }`}
                  >
                    <Trash2 size={16} />
                    売却 (💰 {sellPrice})
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredInventory.length === 0 && (
          <div className="rounded-2xl bg-slate-800/50 p-12 text-center">
            <p className="text-lg text-slate-400">
              {selectedType === "all"
                ? "インベントリが空です。ショップでアイテムを購入しましょう！"
                : `${TYPE_LABELS[selectedType]}がありません`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
