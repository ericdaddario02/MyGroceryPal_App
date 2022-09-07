import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, Animated } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { s as hs, vs } from 'react-native-size-matters';

import { StyledModal } from './StyledModal';
import { ResponsiveText as Text } from './ResponsiveText';
import { appFonts } from '../constants/fonts';
import { appColours, textColours } from '../constants/colours';
import { plusIcon, xIcon } from '../constants/images';
import { findAllNewItems, findIndexOfItemById, generateRandomColour, getNextIdFromCollection } from '../other/helpers';
import { storeLocalData } from '../other/asyncStorageWrapper';

import type { List, ListItem, ListTag, StyledModalButton, ListItemCardsAnimationValues } from '../types/types';


interface ListItemCardModalProps {
	isVisible: boolean,
	list: List,
	listItem: ListItem | null,
	listTags: ListTag[],
	closeModal: Function,
    stateSetters: {
        setListsArr: React.Dispatch<React.SetStateAction<List[]>>,
        setListItems: React.Dispatch<React.SetStateAction<ListItem[]>>,
        setListTags: React.Dispatch<React.SetStateAction<ListTag[]>>
    },
	listItemCardsAnimationValues: ListItemCardsAnimationValues
}


/**
 * **Note**: If `listItem` is null, the modal will be in 'Add New Item' mode.  
 * If `listItem` is not null, the modal will be in 'Edit Item' mode.
 */
export function ListItemCardModal({ isVisible, list, listItem, listTags, closeModal, stateSetters, listItemCardsAnimationValues }: ListItemCardModalProps) {
	const [ nameInput, setNameInput ] = useState<string>('');
	const [ additionalNotesInput, setAdditionalNotesInput ] = useState<string>('');
	const [ priceInput, setPriceInput ] = useState<string>('');
	const [ isOnSaleChecked, setIsOnSaleChecked ] = useState<boolean>(false);
	const [ addTagInput, setAddTagInput ] = useState<string>('');
	const [ listItemTags, setListItemTags ] = useState<ListTag[]>([]);
	
	const [ addTagSuggestionsWidth, setAddTagSuggestionsWidth ] = useState<number>(0);

	const modalButtons: {add: StyledModalButton, save: StyledModalButton, delete: StyledModalButton} = {
		add: {text: 'Add', onPress: handleAddOnPress},
		save: {text: 'Save', onPress: handleSaveOnPress},
		delete: {text: 'Delete', textColour: 'red', onPress: handleDeleteOnPress}
	};

	useEffect(() => {
		if (isVisible && listItem) {
			setNameInput(listItem.name);
			setAdditionalNotesInput(listItem.additionalNotes ?? '');
			setPriceInput(listItem.price ?? '');
			setIsOnSaleChecked(isListItemOnSale(listItem));
			setListItemTags(listItem.tags);
		}
	}, [isVisible]);

	useEffect(() => {
		if (isOnSaleChecked && !(listItemTags[0]?.name == 'On Sale')) {
			let tempArr = [...listItemTags];
			tempArr.unshift(listTags[0]);
			setListItemTags(tempArr);
		} else if (!isOnSaleChecked && listItemTags[0]?.name == 'On Sale') {
			let tempArr = [...listItemTags];
			tempArr.shift();
			setListItemTags(tempArr);
		}
	}, [isOnSaleChecked]);

	function isListItemOnSale(listItem: ListItem) {
		for (let tag of listItem.tags) {
			if (tag.name == 'On Sale') {
				return true;
			}
		}

		return false;
	}

	function resetStates() {
		setNameInput('');
		setAdditionalNotesInput('');
		setPriceInput('');
		setIsOnSaleChecked(false);
		setAddTagInput('');
		setListItemTags([]);
	}

	function handleAddOnPress() {
		if (!nameInput) {
			return;
		}

		stateSetters.setListsArr(prevState => {
			let newState = [...prevState];

			let currentListIndex = findIndexOfItemById(newState, list.id);
			let currentList = {...newState[currentListIndex]};

			// Must deep-copy the list object to avoid duplicate pushes/state updates.
			currentList.items = [...currentList.items];
			currentList.tags = [...currentList.tags];

			let nextListItemId = getNextIdFromCollection(currentList.items);
			let newListItem: ListItem = {
				id: nextListItemId,
				name: nameInput,
				additionalNotes: additionalNotesInput,
				price: priceInput,
				tags: listItemTags
			};
			currentList.items.push(newListItem);

			listItemCardsAnimationValues[nextListItemId] = {
				defaultCardHeight: 0,
				cardHeight: new Animated.Value(0),
				cardBottomMargin: vs(12),
				cardBulletHeight: vs(3),
				cardBorderWidth: 3,
				cardOpacity: 1,
				visible: true
			};

			let allNewTags = findAllNewItems(currentList.tags, listItemTags);
			currentList.tags.push(...allNewTags);

			newState[currentListIndex] = currentList;

			storeLocalData('listsArr', newState);

			// setTimeout causes these states to be updated after the listsArr state of the MyListsScreen, to avoid a thrown error/warning.
			setTimeout(() => {
				stateSetters.setListItems(prevState => {
					let newState = [...prevState];
					newState.push(newListItem!);
	
					return newState;
				});

				stateSetters.setListTags(prevState => {
					let newState = [...prevState];
					newState.push(...allNewTags);
	
					return newState;
				});
			}, 0);

			return newState;
		});

		closeModal();
	}

	function handleSaveOnPress() {
		if (!nameInput || !listItem) {
			return;
		}

		stateSetters.setListsArr(prevState => {
			let newState = [...prevState];

			let currentListIndex = findIndexOfItemById(newState, list.id);
			let currentList = {...newState[currentListIndex]};

			// Must deep-copy the list object to avoid duplicate pushes/state updates.
			currentList.items = [...currentList.items];
			currentList.tags = [...currentList.tags];

			let currentListItemIndex = findIndexOfItemById(currentList.items, listItem.id);
			let currentListItem = {...currentList.items[currentListItemIndex]};

			currentListItem.name = nameInput;
			currentListItem.additionalNotes = additionalNotesInput;
			currentListItem.price = priceInput;
			currentListItem.tags = listItemTags;

			currentList.items[currentListItemIndex] = currentListItem;

			let allNewTags = findAllNewItems(currentList.tags, listItemTags);
			currentList.tags.push(...allNewTags);

			newState[currentListIndex] = currentList;
			
			storeLocalData('listsArr', newState);

			// setTimeout causes these states to be updated after the listsArr state of the MyListsScreen, to avoid a thrown error/warning.
			setTimeout(() => {
				stateSetters.setListItems(prevState => {
					let newState = [...prevState];
					newState[currentListItemIndex] = currentListItem;
	
					return newState;
				});

				stateSetters.setListTags(prevState => {
					let newState = [...prevState];
					newState.push(...allNewTags);
	
					return newState;
				});
			}, 0);

			return newState;
		});

		closeModal();
	}

	function handleDeleteOnPress() {
		if (!nameInput || !listItem) {
			return;
		}

		stateSetters.setListsArr(prevState => {
			let newState = [...prevState];

			let currentListIndex = findIndexOfItemById(newState, list.id);
			let currentList = {...newState[currentListIndex]};

			// Must deep-copy the list object to avoid duplicate pushes/state updates.
			currentList.items = [...currentList.items];
			currentList.tags = [...currentList.tags];

			let currentListItemIndex = findIndexOfItemById(currentList.items, listItem.id);
			currentList.items.splice(currentListItemIndex, 1);

			newState[currentListIndex] = currentList;
			
			storeLocalData('listsArr', newState);

			// setTimeout causes these states to be updated after the listsArr state of the MyListsScreen, to avoid a thrown error/warning.
			setTimeout(() => {
				stateSetters.setListItems(prevState => {
					let newState = [...prevState];
					newState.splice(currentListItemIndex, 1);
	
					return newState;
				});
			}, 0);

			return newState;
		});

		closeModal();
	}

    function handleAddTag(tagName: string) {
        if (!tagName) {
			return;
        }

		let currentListItemTagWithSameName = listItemTags.filter(tag => tag.name.toLowerCase() == tagName.toLowerCase())[0];

		if (currentListItemTagWithSameName) {
			return;
		}

		let listTagWithSameName = listTags.filter(tag => tag.name.toLowerCase() == tagName.toLowerCase())[0];

		if (listTagWithSameName) {  // Existing tag
			let tempArr = [...listItemTags];
			tempArr.push(listTagWithSameName);
			setListItemTags(tempArr);
		} else {  // New tag
			let nextTagId = getNextIdFromCollection([...listTags, ...listItemTags]);

			let newTag: ListTag = {
				id: nextTagId,
				name: tagName,
				colour: generateRandomColour()
			};

			let tempArr = [...listItemTags];
			tempArr.push(newTag);
			setListItemTags(tempArr);
		}

		setAddTagInput('');
    }

	function handleTagRemoveOnPress(tagIndex: number) {
		let tempArr = [...listItemTags];
		tempArr.splice(tagIndex, 1);
		setListItemTags(tempArr);
	}

	function shouldTagBeSuggested(tag: ListTag) {
		if (addTagInput == '' || tag.name == 'On Sale') {
			return false;
		}

		let isSubstring = tag.name.toLowerCase().includes(addTagInput.toLowerCase().trim())
		let currentListItemTagWithSameName = listItemTags.filter(listItemTag => listItemTag.name.toLowerCase() == tag.name.toLowerCase())[0];

		return isSubstring && !currentListItemTagWithSameName;
	}


	return (
		<StyledModal
			title={listItem ? 'Edit Item' : 'Add New Item'}
			isVisible={isVisible}
			closeModal={closeModal}
			borderColor={appColours.grey}
			leftButton={listItem ? modalButtons.delete : undefined}
			rightButton={listItem ? modalButtons.save : modalButtons.add}
			onClose={resetStates}
		>
			<View style={styles.section}>
				<View style={styles.row}>
					<Text style={styles.inputPrompt}>Name:</Text>
					<TextInput
						style={styles.input}
						value={nameInput}
						onChangeText={setNameInput}
					/>
				</View>

				<View style={styles.row}>
					<TextInput
						style={styles.additionalNotesInput}
						value={additionalNotesInput}
						onChangeText={setAdditionalNotesInput}
						placeholder='Additional Notes...'
						placeholderTextColor='#999999'
						textAlignVertical='top'
						multiline
					/>
				</View>
			</View>

			<View style={styles.section}>
				<View style={styles.spacedOutRow}>
					<View style={styles.row}>
						<Text style={styles.inputPrompt}>Price:</Text>
						<TextInput
							style={styles.priceInput}
							value={priceInput}
							onChangeText={setPriceInput}
							keyboardType='numeric'
							textAlign='center'
						/>
					</View>

					<View style={styles.row}>
						<Text style={styles.checkboxPrompt}>On Sale:</Text>
						<CheckBox
							value={isOnSaleChecked}
							onValueChange={(value) => setIsOnSaleChecked(value)}
							// Android
							tintColors={{ true: appColours.blue, false: appColours.grey }}
							// iOS
							tintColor={appColours.grey}
							onCheckColor='white'
							onFillColor={appColours.blue}
							onTintColor='white'
						/>
					</View>
				</View>
			</View>

			<View style={styles.section}>
				<View style={styles.row}>
					<Text style={styles.inputPrompt}>Add Tag:</Text>
					<TextInput
						onLayout={({ nativeEvent }) => setAddTagSuggestionsWidth(nativeEvent.layout.width)}
						style={styles.addTagInput}
						value={addTagInput}
						onChangeText={setAddTagInput}
						onSubmitEditing={() => handleAddTag(addTagInput.trim())}
					/>
					
					<View style={[styles.addTagButtonContainer, { backgroundColor: addTagInput.length > 0 ? '#D9D9D9' : '#F0F0F0' }]}>
						{addTagInput.length > 0 &&
							<TouchableOpacity activeOpacity={0.4} style={styles.addTagButtonTouchable} onPress={() => handleAddTag(addTagInput.trim())}>
								<Image source={plusIcon} style={styles.addTagButtonIcon}/>
							</TouchableOpacity>
						}
					</View>

					{listTags.filter(tag => shouldTagBeSuggested(tag)).length > 0 &&
						<View style={[styles.addTagSuggestionsContainer, { width: addTagSuggestionsWidth }]}>
							<View style={styles.divider}/>

							<ScrollView keyboardShouldPersistTaps='handled'>
								{listTags.map((tag) =>
									shouldTagBeSuggested(tag) &&
									<View key={tag.id} style={styles.addTagSuggestionBackgroundView}>
										<TouchableOpacity activeOpacity={0.7} style={styles.addTagSuggestionTouchable} onPress={() => handleAddTag(tag.name)}>
											<View style={[styles.tagCircle, { backgroundColor: tag.colour, marginRight: hs(6) }]}/>
											<Text adjustsFontSizeToFit style={styles.addTagSuggestionText}>{tag.name}</Text>
										</TouchableOpacity>
									</View>
								)}
							</ScrollView>
						</View>
					}
					
				</View>

				<View style={styles.tagsContainer}>
					{listItemTags.map((tag, index) =>
						<View key={tag.id} style={styles.tag}>
							<View style={[styles.tagCircle, { backgroundColor: tag.colour }]}/>
							<Text style={styles.tagName}>{tag.name}</Text>
							<TouchableOpacity activeOpacity={0.4} style={styles.tagXIconTouchable} onPress={() => handleTagRemoveOnPress(index)}>
								<Image source={xIcon} style={styles.tagXIcon}/>
							</TouchableOpacity>
						</View>
					)}
				</View>
			</View>
		</StyledModal>
	)
}


const styles = StyleSheet.create({
	section: {
		paddingVertical: vs(3)
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	spacedOutRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	inputPrompt: {
		fontFamily: appFonts.regular,
		fontSize: 17,
		color: 'black',
		marginRight: hs(10)
	},
	checkboxPrompt: {
		fontFamily: appFonts.regular,
		fontSize: 17,
		color: 'black',
		marginRight: hs(5)
	},
	input: {
		backgroundColor: '#F0F0F0',
		borderRadius: 5,
		height: vs(27),
		flex: 1,
		paddingVertical: 0,
		paddingHorizontal: hs(6),
		fontFamily: appFonts.regular,
		fontSize: 15,
		color: textColours.grey
	},
	additionalNotesInput: {
		flex: 1,
		backgroundColor: '#F0F0F0',
		borderRadius: 5,
		paddingVertical: vs(5),
		paddingHorizontal: hs(8),
		fontFamily: appFonts.regular,
		minHeight: vs(50),
		maxHeight: vs(100),
		fontSize: 13,
		color: textColours.grey,
		marginTop: vs(13)
	},
	priceInput: {
		backgroundColor: '#F0F0F0',
		borderRadius: 5,
		height: vs(25),
		width: hs(65),
		paddingVertical: 0,
		paddingHorizontal: hs(6),
		fontFamily: appFonts.regular,
		fontSize: 15,
		color: textColours.grey
	},
	tagsContainer: {
		flexDirection: 'row',
		paddingTop: vs(15),
		flexWrap: 'wrap'
	},
	tag: {
		borderWidth: 1,
		borderColor: appColours.grey,
		borderRadius: 10,
		paddingLeft: hs(4),
		paddingVertical: vs(1),
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: hs(6),
		marginBottom: vs(5)
	},
	tagCircle: {
		borderRadius: 100,
		height: hs(7),
		width: hs(7),
		marginRight: hs(4),
		borderWidth: 1,
		borderColor: 'black',
	},
	tagName: {
		fontSize: 11,
		fontFamily: appFonts.regular,
		color: 'black'
	},
	tagXIconTouchable: {
		paddingVertical: vs(4),
		paddingHorizontal: hs(4),
	},
	tagXIcon: {
		width: hs(7),
		height: hs(7),
		tintColor: textColours.grey
	},
	divider: {
		height: 1,
		width: '100%',
		backgroundColor: appColours.dividerColour
	},
	addTagInput: {
		backgroundColor: '#F0F0F0',
		borderBottomLeftRadius: 5,
		borderTopLeftRadius: 5,
		height: vs(27),
		flex: 1,
		paddingVertical: 0,
		paddingHorizontal: hs(6),
		fontFamily: appFonts.regular,
		fontSize: 15,
		color: textColours.grey
	},
	addTagButtonContainer: {
		height: vs(27),
		width: hs(32),
		borderTopRightRadius: 5,
		borderBottomRightRadius: 5
	},
	addTagButtonTouchable: {
		height: '100%',
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	addTagButtonIcon: {
		height: '65%',
		aspectRatio: 1,
		tintColor: '#3F3F3F'
	},
	addTagSuggestionsContainer: {
		position: 'absolute',
		maxHeight: vs(100), 
		top: vs(24),
		right: hs(32),
		zIndex: 1,
		paddingTop: vs(3),
		backgroundColor: '#F0F0F0',
		borderBottomLeftRadius: 5,
		borderBottomRightRadius: 5,
		overflow: 'hidden'
	},
	addTagSuggestionBackgroundView: {
		backgroundColor: appColours.blue
	},
	addTagSuggestionTouchable: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F0F0F0',
		paddingHorizontal: hs(6),
		paddingVertical: vs(4)
	},
	addTagSuggestionText: {
		fontSize: 14,
		fontFamily: appFonts.regular,
		color: '#535353'
	}
});
