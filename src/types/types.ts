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

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type StackParamList =  {
	MyLists: undefined;
	List: {listName: string, listTags: ListTag[], listItems: ListItem[]}
};

export type MyListsScreenProps = NativeStackScreenProps<StackParamList, 'MyLists'>;
export type ListScreenProps = NativeStackScreenProps<StackParamList, 'List'>;

// ===