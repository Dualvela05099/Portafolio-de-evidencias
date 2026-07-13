import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StorageKey } from "@/constants/storageKeys";

export async function getStorageItem<T>(key: StorageKey | string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (error) {
    console.log(`Error al leer ${key}:`, error);
    return null;
  }
}

export async function setStorageItem<T>(key: StorageKey | string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.log(`Error al guardar ${key}:`, error);
    return false;
  }
}

export async function getStorageList<T>(key: StorageKey): Promise<T[]> {
  const data = await getStorageItem<T[]>(key);
  return data ?? [];
}

export async function setStorageList<T>(key: StorageKey, items: T[]): Promise<boolean> {
  return setStorageItem(key, items);
}

export async function removeStorageItem(key: StorageKey | string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export async function removeStorageItems(keys: StorageKey[]): Promise<void> {
  await AsyncStorage.multiRemove(keys);
}
