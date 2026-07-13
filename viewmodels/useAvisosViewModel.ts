import { useCallback, useEffect, useState } from "react";
import { router } from "expo-router";
import { Alert } from "react-native";
import { notificationService } from "@/services/api/NotificationService";
import type { Notificacion } from "@/types";

export function useAvisosViewModel() {
  const [notices, setNotices] = useState<Notificacion[]>([]);
  const [previous, setPrevious] = useState<Notificacion[]>([]);

  useEffect(() => {
    notificationService.getAll().then(setNotices);
    notificationService.getPrevious().then(setPrevious);
  }, []);

  const clean = useCallback(async () => {
    setNotices([]);
    await notificationService.clearToday();
    Alert.alert("Avisos", "Se limpiaron los avisos de hoy.");
  }, []);

  const handleNoticePress = useCallback((notice: Notificacion, index: number) => {
    if (index === 0) {
      router.push("/confirmacion");
      return;
    }
    Alert.alert(notice.titulo, "Aviso revisado correctamente.");
  }, []);

  const handlePreviousPress = useCallback((notice: Notificacion) => {
    Alert.alert(notice.titulo, "Aviso anterior revisado.");
  }, []);

  return { notices, previous, clean, handleNoticePress, handlePreviousPress };
}
