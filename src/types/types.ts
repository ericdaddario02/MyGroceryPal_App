// === Types that are also used on the backend / Api Types ===

export interface List {
	listId: string,
	name: string,
	tags: ListTag[],
	items: ListItem[]
};

export interface ListTag {
	listTagId: string,
	name: string,
	colour: string
};

export interface ListItem {
	listItemId: string,
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