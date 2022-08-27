import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { s as hs, vs } from 'react-native-size-matters';

import { ResponsiveText as Text } from '../components/ResponsiveText';
import { Menu, MenuItem, MenuButton, MenuDivider } from '../components/MenuPopup';
import { ListManagementModal } from '../components/ListManagementModal';
import { appFonts } from '../constants/fonts';
import { appColours, textColours } from "../constants/colours";
import { sharedListIcon, plusIcon, joinIcon } from '../constants/images';
import { getLocalData } from '../other/asyncStorageWrapper';

import type { MyListsScreenProps, List, ListTag, ListItem, ValidListManagementModalType } from '../types/types';


let testData: List[] = [
	{id: 1, name: "Grocery List", items: [
		{id: 1, name: 'Milk', additionalNotes: 'these are some additional notes. yayayaya... i really like milk', price: '3.99', tags: [{id: 1, name: 'On Sale', colour: 'red'}, {id: 2, name: 'FreshCo', colour: 'green'},{id: 3, name: 'Loblaws', colour: 'blue'},
		{id: 4, name: 'Dairy', colour: 'brown'},
		{id: 5, name: 'Grains', colour: 'yellow'},
		{id: 6, name: 'Vegetables', colour: '#FF64B3'},
		{id: 7, name: 'Frozen Foods Yay!!!!!!!', colour: '#07F7BF'},]},
		{id: 8, name: 'some list item with a really really long name', additionalNotes: 'some additional notes', price: null, tags: []},
		{id: 9, name: 'some list item with a really really long name with a price', additionalNotes: null, price: '12.99', tags: [{id: 2, name: 'FreshCo', colour: 'green'},{id: 3, name: 'Loblaws', colour: 'blue'},]},
		{id: 10, name: 'no notes or price but tags', additionalNotes: null, price: null, tags: [{id: 1, name: 'On Sale', colour: 'red'}, {id: 2, name: 'FreshCo', colour: 'green'}]},
        {id: 11, name: 'some list item with a really really long name', additionalNotes: 'some additional notes', price: null, tags: []},
		{id: 12, name: 'some list item with a really really long name with a price', additionalNotes: null, price: '12.99', tags: [{id: 2, name: 'FreshCo', colour: 'green'},{id: 3, name: 'Loblaws', colour: 'blue'},]},
		{id: 13, name: 'no notes or price but tags', additionalNotes: null, price: null, tags: [{id: 1, name: 'On Sale', colour: 'red'}, {id: 2, name: 'FreshCo', colour: 'green'}]}
	], tags: [
		{id: 1, name: 'On Sale', colour: 'red'},
		{id: 2, name: 'FreshCo', colour: 'green'},
		{id: 3, name: 'Loblaws', colour: 'blue'},
		{id: 4, name: 'Dairy', colour: 'brown'},
		{id: 5, name: 'Grains', colour: 'yellow'},
		{id: 6, name: 'Vegetables', colour: '#FF64B3'},
		{id: 7, name: 'Frozen Foods Yay!!!!!!!', colour: '#07F7BF'},
	], isJoined: false, inviteCode: '12345678'},
	{id: 2, name: "Shared Grocery List something something something", items: [], tags: [
		{id: 1, name: 'On Sale', colour: 'red'},
		{id: 2, name: 'FreshCo', colour: 'green'},
		{id: 3, name: 'Loblaws', colour: 'blue'},
	], isJoined: true, inviteCode: 'abcdefgh'},
	{id: 11, name: "Grocery List", items: [], tags: [], isJoined: false, inviteCode: '12345678'},
	{id: 12, name: "Shared Grocery List", items: [], tags: [], isJoined: true, inviteCode: 'abcdefgh'},
	{id: 21, name: "Grocery List", items: [], tags: [], isJoined: false, inviteCode: '12345678'},
	{id: 22, name: "Shared Grocery List", items: [], tags: [], isJoined: true, inviteCode: 'abcdefgh'},
	{id: 31, name: "Grocery List", items: [], tags: [], isJoined: false, inviteCode: '12345678'},
	{id: 32, name: "Shared Grocery List", items: [], tags: [], isJoined: true, inviteCode: 'abcdefgh'},
	{id: 41, name: "Grocery List", items: [], tags: [], isJoined: false, inviteCode: '12345678'},
	{id: 42, name: "Shared Grocery List", items: [], tags: [], isJoined: true, inviteCode: 'abcdefgh'},
	{id: 51, name: "Grocery List", items: [], tags: [], isJoined: false, inviteCode: '12345678'},
	{id: 52, name: "Shared Grocery List", items: [], tags: [], isJoined: true, inviteCode: 'abcdefgh'},
	{id: 61, name: "Grocery List", items: [], tags: [], isJoined: false, inviteCode: '12345678'},
	{id: 62, name: "Shared Grocery List", items: [], tags: [], isJoined: true, inviteCode: 'abcdefgh'},
	{id: 71, name: "Grocery List", items: [], tags: [], isJoined: false, inviteCode: '12345678'},
	{id: 72, name: "Shared Grocery List", items: [], tags: [], isJoined: true, inviteCode: 'abcdefgh'},
	{id: 81, name: "Grocery List", items: [], tags: [], isJoined: false, inviteCode: '12345678'},
	{id: 82, name: "Shared Grocery List", items: [], tags: [], isJoined: true, inviteCode: 'abcdefgh'},
];


function MyListsScreen({ navigation, route }: MyListsScreenProps) {
	const [ listsArr, setListsArr ] = useState<List[]>([]);
	const [ listManagementModalType, setListManagementModalType ] = useState<ValidListManagementModalType>(null);
	const [ listManagementModalList, setListManagementModalList ] = useState<List|null>(null);
	const [ listManagementModalVisible, setListManagementModalVisible ] = useState<boolean>(false);
	
	useEffect(() => {
		loadData();
	}, []);

    async function loadData() {
        let listsArrData = await getLocalData('listsArr');

        if (!listsArrData) {
            listsArrData = testData;
            // storeLocalData('listsArr', testData);
        }

        setListsArr(listsArrData);
    }

	function showListManagementModal(type: ValidListManagementModalType, list: List|null) {
		setListManagementModalType(type);
		setListManagementModalList(list);
		setListManagementModalVisible(true);
	}

	function hideListManagementModal() {
		setListManagementModalVisible(false);
	}

	function handleListCardPress(list: List) {
		navigation.navigate('List', {list, setListsArr});
	}


	return (
        <View style={styles.mainContainer}>
            <ScrollView style={styles.mainScrollViewContainer} contentContainerStyle={styles.mainScrollViewContentContainer}>
                {listsArr.map((list, index) =>
                    <TouchableOpacity key={list.id} style={styles.listCardTouchable} activeOpacity={0.4} onPress={() => handleListCardPress(list)}>
                        <View style={styles.listCard}>
                            <Menu 
                                button={<MenuButton />}
                                buttonContainerStyle={styles.listCardMenuButtonContainer}
                            >
                                <MenuItem
                                    text='Edit List'
                                    onPress={() => showListManagementModal('edit', list)}
                                />
								{/* <MenuItem
									text='Invite Others'
									onPress={() => showListManagementModal('invite', list)}
								/> */}
                                <MenuDivider />
                                <MenuItem
                                    text='Delete List'
                                    onPress={() => showListManagementModal('delete', list)}
                                />
                            </Menu>

                            <Text style={styles.listCardName}>{list.name}</Text>

                            {list.isJoined && 
                                <Image source={sharedListIcon} resizeMode='contain' style={styles.sharedListIcon}/>
                            }
                        </View>
                    </TouchableOpacity>
                )}
            </ScrollView>

            <View style={styles.floatingButtonsContainer}>
                <View style={styles.floatingButton}>
                    <TouchableOpacity activeOpacity={0.3} style={styles.floatingButtonTouchable} onPress={() => showListManagementModal('create', null)}>
                        <Image source={plusIcon} resizeMode='contain' style={styles.floatingButtonIcon}/>
                        <Text style={styles.floatingButtonText}>Create new list</Text>
                    </TouchableOpacity>
                </View>

                {/* <View style={styles.floatingButtonsContainerSpacer} />

                <View style={styles.floatingButton}>
                    <TouchableOpacity activeOpacity={0.3} style={styles.floatingButtonTouchable} onPress={() => showListManagementModal('join', null)}>
                        <Image source={joinIcon} resizeMode='contain' style={styles.floatingButtonIcon}/>
                        <Text style={styles.floatingButtonText}>Join new list</Text>
                    </TouchableOpacity>
                </View> */}
            </View>

			<ListManagementModal
				isVisible={listManagementModalVisible}
				type={listManagementModalType}
				list={listManagementModalList}
				setListsArr={setListsArr}
				closeModal={hideListManagementModal}
			/>
        </View>
	);
}


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
	mainScrollViewContainer: {
		flex: 1,
		paddingVertical: vs(15)
	},
	mainScrollViewContentContainer: {
		paddingBottom: vs(15) + vs(62)  // + vs(108) to offset two floating buttons and spacer
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
		right: 0,
		top: 0,
		paddingLeft: hs(5),
		paddingBottom: vs(5),
		zIndex: 1
	},
    sharedListIcon: {
        position: 'absolute',
        right: hs(4.5),
        bottom: vs(4),
        tintColor: appColours.green,
        width: hs(22),
        height: undefined,
        aspectRatio: 22 / 12.5
    },
    floatingButtonsContainer: {
        position: 'absolute',
        bottom: vs(23),
        right: hs(15)
    },
    floatingButtonsContainerSpacer: {
        height: vs(11)
    },
    floatingButton: {
        borderRadius: 7,
        borderWidth: 2,
        borderColor: appColours.grey,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    },
    floatingButtonTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
		paddingVertical: vs(6),
        paddingHorizontal: hs(6),
    },
    floatingButtonIcon: {
        width: hs(14),
        height: undefined,
        aspectRatio: 1,
        marginRight: hs(6),
        tintColor: textColours.blue
    },
    floatingButtonText: {
        fontFamily: appFonts.medium,
        fontSize: 15,
        color: textColours.blue
    }
});


export default MyListsScreen;
