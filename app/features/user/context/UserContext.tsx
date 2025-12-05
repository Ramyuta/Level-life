"use client";

import { useStore } from "../../../lib/store";
import { User, XpResult } from "../../../lib/types";

export function UserProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useUser() {
  const user = useStore((state) => state.user);
  const addXp = useStore((state) => state.addXp);
  const addGold = useStore((state) => state.addGold);
  const updateUser = useStore((state) => state.updateUser);
  const resetUser = useStore((state) => state.resetUser);
  const equipItem = useStore((state) => state.equipItem);
  const unequipItem = useStore((state) => state.unequipItem);
  const addToInventory = useStore((state) => state.addToInventory);
  const removeFromInventory = useStore((state) => state.removeFromInventory);
  const purchaseEquipment = useStore((state) => state.purchaseEquipment);
  const unlockSkill = useStore((state) => state.unlockSkill);
  const addSkillPoints = useStore((state) => state.addSkillPoints);
  const battle = useStore((state) => state.battle);
  const startBattle = useStore((state) => state.startBattle);
  const fleeBattle = useStore((state) => state.fleeBattle);

  return {
    user,
    battle,
    addXp,
    addGold,
    updateUser,
    resetUser,
    equipItem,
    unequipItem,
    addToInventory,
    removeFromInventory,
    purchaseEquipment,
    unlockSkill,
    addSkillPoints,
    startBattle,
    fleeBattle,
  };
}
