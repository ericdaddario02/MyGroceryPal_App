import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GestureResponderEvent, Animated } from 'react-native';

// === Types that are also used on the backend / Api Types ===

export interface List {
	id: number,
	name: string,
	tags: ListTag[],
	items: ListItem[],
	isJoined: boolean,
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
	additionalNotes: string | null,
	price: string | null,
	tags: ListTag[]
};

// ===

// === React Navigation Types ===

export type StackParamList =  {
	MyLists: undefined;
	List: {list: List, setListsArr: React.Dispatch<React.SetStateAction<List[]>>}
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

export interface ListItemCardsAnimationValues {
	[id: number]: {
		defaultCardHeight: number,
		cardHeight: Animated.Value,
		cardBottomMargin: number|Animated.AnimatedInterpolation,
		cardBulletHeight: number|Animated.AnimatedInterpolation,
		cardBorderWidth: number|Animated.AnimatedInterpolation,
		cardOpacity: number|Animated.AnimatedInterpolation,
		visible: boolean, 
	}
}

// ===