"use client";

import { useState, useEffect } from "react";
import { NotificationManager, NotificationConfig } from "./notificationManager";

export function useNotifications() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [config, setConfig] = useState<NotificationConfig>(
    NotificationManager.loadConfig()
  );
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(NotificationManager.isSupported());
    setPermission(NotificationManager.getPermission());
    setConfig(NotificationManager.loadConfig());
  }, []);

  const requestPermission = async () => {
    const result = await NotificationManager.requestPermission();
    setPermission(result);
    return result;
  };

  const updateConfig = (newConfig: Partial<NotificationConfig>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    NotificationManager.saveConfig(updated);
  };

  const sendTestNotification = () => {
    NotificationManager.sendNotification("Test Notification", {
      body: "This is a test notification from Level-Life!",
      tag: "test-notification",
    });
  };

  return {
    isSupported,
    permission,
    config,
    requestPermission,
    updateConfig,
    sendTestNotification,
  };
}
