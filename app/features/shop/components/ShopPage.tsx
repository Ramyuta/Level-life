"use client";

import { useState } from "react";
import { useUser } from "../../user/context/UserContext";
import { useToast } from "../../../context/ToastContext";
import { useConfirm } from "../../../context/ConfirmContext";
import type {
  Equipment,
  EquipmentRarity,
  EquipmentType,
} from "../../../lib/types";
import { ALL_EQUIPMENT } from "../data/equipmentCatalog";
import EquipmentCard from "./EquipmentCard";

const RARITY_COLORS: Record<EquipmentRarity, string> = {
  common: "text-gray-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-yellow-400",
};

export default function ShopPage() {
  const { user, purchaseEquipment, equipItem } = useUser() as any;
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const [selectedType, setSelectedType] = useState<EquipmentType | "all">(
    "all"
  );
  const [selectedRarity, setSelectedRarity] = useState<EquipmentRarity | "all">(
    "all"
  );

  const filteredEquipment = ALL_EQUIPMENT.filter((eq) => {
    if (selectedType !== "all" && eq.type !== selectedType) return false;
    if (selectedRarity !== "all" && eq.rarity !== selectedRarity) return false;
    return true;
  });

  const handlePurchase = async (equipment: Equipment) => {
    // Check gold
    if ((user.stats.gold || 0) < equipment.price) {
      showToast("ゴールドが不足しています", "error");
      return;
    }

    // Check level
    if (equipment.requiredLevel && user.level < equipment.requiredLevel) {
      showToast(`レベル${equipment.requiredLevel}が必要です`, "error");
      return;
    }

    // Confirm purchase
    const confirmed = await confirm({
      title: "購入確認",
      message: `${equipment.icon} ${equipment.name}を${equipment.price}ゴールドで購入しますか？`,
      confirmText: "購入",
    });

    if (!confirmed) return;

    // Purchase
    const success = purchaseEquipment(equipment);
    if (success) {
      showToast(`${equipment.name}を購入しました！`, "success");

      // Auto-equip if slot is empty
      if (!user.equippedItems[equipment.type]) {
        equipItem(equipment);
        showToast(`${equipment.name}を装備しました`, "info");
      }
    } else {
      showToast("購入に失敗しました", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-black text-white">🏪 ショップ</h1>
          <p className="text-slate-400">装備を購入してステータスを強化しよう</p>
        </div>

        {/* Gold Display */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-6 ring-1 ring-yellow-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-200">所持ゴールド</p>
              <p className="text-3xl font-black text-yellow-400">
                💰 {user.stats.gold || 0}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">レベル</p>
              <p className="text-2xl font-bold text-white">{user.level}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          {/* Type Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType("all")}
              className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                selectedType === "all"
                  ? "bg-indigo-600 text-white ring-2 ring-indigo-500"
                  : "bg-slate-700/80 text-slate-300 hover:bg-slate-700"
              }`}
            >
              全て
            </button>
            <button
              onClick={() => setSelectedType("weapon")}
              className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                selectedType === "weapon"
                  ? "bg-indigo-600 text-white ring-2 ring-indigo-500"
                  : "bg-slate-700/80 text-slate-300 hover:bg-slate-700"
              }`}
            >
              ⚔️ 武器
            </button>
            <button
              onClick={() => setSelectedType("armor")}
              className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                selectedType === "armor"
                  ? "bg-indigo-600 text-white ring-2 ring-indigo-500"
                  : "bg-slate-700/80 text-slate-300 hover:bg-slate-700"
              }`}
            >
              🛡️ 防具
            </button>
            <button
              onClick={() => setSelectedType("accessory")}
              className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                selectedType === "accessory"
                  ? "bg-indigo-600 text-white ring-2 ring-indigo-500"
                  : "bg-slate-700/80 text-slate-300 hover:bg-slate-700"
              }`}
            >
              💍 アクセサリー
            </button>
          </div>

          {/* Rarity Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedRarity("all")}
              className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                selectedRarity === "all"
                  ? "bg-indigo-600 text-white ring-2 ring-indigo-500"
                  : "bg-slate-700/80 text-slate-300 hover:bg-slate-700"
              }`}
            >
              全レアリティ
            </button>
            <button
              onClick={() => setSelectedRarity("common")}
              className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                selectedRarity === "common"
                  ? "bg-gray-600 text-white ring-2 ring-gray-500"
                  : "bg-slate-700/80 text-gray-300 hover:bg-slate-700"
              }`}
            >
              コモン
            </button>
            <button
              onClick={() => setSelectedRarity("rare")}
              className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                selectedRarity === "rare"
                  ? "bg-blue-600 text-white ring-2 ring-blue-500"
                  : "bg-slate-700/80 text-blue-300 hover:bg-slate-700"
              }`}
            >
              レア
            </button>
            <button
              onClick={() => setSelectedRarity("epic")}
              className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                selectedRarity === "epic"
                  ? "bg-purple-600 text-white ring-2 ring-purple-500"
                  : "bg-slate-700/80 text-purple-300 hover:bg-slate-700"
              }`}
            >
              エピック
            </button>
            <button
              onClick={() => setSelectedRarity("legendary")}
              className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                selectedRarity === "legendary"
                  ? "bg-yellow-600 text-white ring-2 ring-yellow-500"
                  : "bg-slate-700/80 text-yellow-300 hover:bg-slate-700"
              }`}
            >
              レジェンダリー
            </button>
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEquipment.map((equipment) => (
            <EquipmentCard
              key={equipment.id}
              equipment={equipment}
              userGold={user.stats.gold || 0}
              userLevel={user.level}
              onPurchase={() => handlePurchase(equipment)}
            />
          ))}
        </div>

        {filteredEquipment.length === 0 && (
          <div className="rounded-2xl bg-slate-800/50 p-12 text-center">
            <p className="text-lg text-slate-400">
              該当する装備が見つかりませんでした
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
