import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GestureResponderEvent } from 'react-native';

// === Types that are also used on the backend / Api Types ===

export interface List {
	id: number,
	name: string,
	tags: ListTag[],
	items: ListItem[],
	isOwner: boolean,
    inviteCode: string
};

export interface ListTag {
	id: number,
	name: string,
	colour: string
};

export interface ListItem {
	id: number,
	name: string,
	additionalNotes: string,
	price: string,
	tags: ListTag[]
};

// ===

// === React Navigation Types ===

export type StackParamList =  {
	MyLists: undefined;
	List: {listName: string, listTags: ListTag[], listItems: ListItem[]}
};

export type MyListsScreenProps = NativeStackScreenProps<StackParamList, 'MyLists'>;
export type ListScreenProps = NativeStackScreenProps<StackParamList, 'List'>;

// ===

// === Shared Types Between Components/Screens ===

export interface StyledModalButton {
    text: string,
    textColour?: string,
	onPress: ((event: GestureResponderEvent) => void)
}

export type ValidListManagementModalType = 'create' | 'join' | 'edit' | 'invite' | 'delete' | null;

// ===