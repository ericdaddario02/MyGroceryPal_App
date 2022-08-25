import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storeLocalData(key: string, value: any) {
    try {
        let jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
        console.error(error);
    }
}

export async function getLocalData(key: string) {
    try {
        let jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error(error);
        return null;
    }
}