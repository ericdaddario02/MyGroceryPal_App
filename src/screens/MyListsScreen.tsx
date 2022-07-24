import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { s as hs, vs, ms as mhs, mvs } from 'react-native-size-matters';

import { ResponsiveText as Text } from '../components/ResponsiveText';
import { Menu, MenuItem, MenuButton } from '../components/MenuPopup';
import { appFonts } from '../constants/fonts';
import { appColours } from "../constants/colours";

import type { MyListsScreenProps, List } from '../types/types';


let testData: List[] = [
	{id: 1, name: "Grocery List", items: [], tags: [], isOwner: true},
	{id: 2, name: "Shared Grocery List", items: [], tags: [], isOwner: false},
	{id: 11, name: "Grocery List", items: [], tags: [], isOwner: true},
	{id: 12, name: "Shared Grocery List", items: [], tags: [], isOwner: false},
	{id: 21, name: "Grocery List", items: [], tags: [], isOwner: true},
	{id: 22, name: "Shared Grocery List", items: [], tags: [], isOwner: false},
	{id: 31, name: "Grocery List", items: [], tags: [], isOwner: true},
	{id: 32, name: "Shared Grocery List", items: [], tags: [], isOwner: false},
	{id: 41, name: "Grocery List", items: [], tags: [], isOwner: true},
	{id: 42, name: "Shared Grocery List", items: [], tags: [], isOwner: false},
	{id: 51, name: "Grocery List", items: [], tags: [], isOwner: true},
	{id: 52, name: "Shared Grocery List", items: [], tags: [], isOwner: false},
	{id: 61, name: "Grocery List", items: [], tags: [], isOwner: true},
	{id: 62, name: "Shared Grocery List", items: [], tags: [], isOwner: false},
	{id: 71, name: "Grocery List", items: [], tags: [], isOwner: true},
	{id: 72, name: "Shared Grocery List", items: [], tags: [], isOwner: false},
	{id: 81, name: "Grocery List", items: [], tags: [], isOwner: true},
	{id: 82, name: "Shared Grocery List", items: [], tags: [], isOwner: false},
];


function MyListsScreen({ navigation, route }: MyListsScreenProps) {
	const [ listsArr, setListsArr ] = useState<List[]>([]);
	
	useEffect(() => {
		setListsArr(testData);
	}, []);


	return (
		<ScrollView style={styles.mainContainer} contentContainerStyle={styles.mainContentContainer}>
			{listsArr.map((list, index) =>
				<TouchableOpacity key={list.id} style={styles.listCardTouchable}>
					<View style={styles.listCard}>
						<Text style={styles.listCardName}>{list.name}</Text>
						<Menu 
							button={<MenuButton />}
							buttonContainerStyle={styles.listCardMenuButtonContainer}
						>
							<MenuItem
								text='Edit List'
								onPress={() => console.log('edit list')}
							/>
                            {/* <MenuDivider /> */}
                            <MenuItem
                                text='Delete List'
                                onPress={() => console.log('delete list')}
                            />
						</Menu>
					</View>
				</TouchableOpacity>
			)}
		</ScrollView>
	);
}


const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		paddingVertical: vs(15)
	},
	mainContentContainer: {
		paddingBottom: vs(15)
	},
	listCard: {
		flex: 1,
		width: '100%',
		paddingVertical: vs(22),
		borderRadius: 10,
		borderColor: appColours.green,
		borderWidth: 3,
		justifyContent: 'center',
		backgroundColor: 'rgba(74, 196, 247, 0.15)'
	},
	listCardTouchable: {
		flex: 1,
		paddingHorizontal: hs(6),
		marginHorizontal: hs(10),
		paddingVertical: vs(5),
		marginBottom: vs(8),
		justifyContent: 'center'
	},
	listCardName: {
		fontSize: 24,
		color: 'black',
		fontFamily: appFonts.medium,
		marginLeft: hs(13)
	},
	listCardMenuButtonContainer: {
		position: 'absolute',
		right: hs(3),
		top: vs(2)
	}
});


export default MyListsScreen;
