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
        
		if (listsArrData) {
			setListsArr(listsArrData);
		}
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
