import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { s as hs, vs } from 'react-native-size-matters';

import { StyledModal } from './StyledModal';
import { ResponsiveText as Text } from './ResponsiveText';
import { appFonts } from '../constants/fonts';
import { appColours, textColours } from '../constants/colours';
import { xIcon } from '../constants/images';

import type { List, ListItem, ListTag, StyledModalButton } from '../types/types';


interface ListItemCardModalProps {
	isVisible: boolean,
	listItem: ListItem | null,
	listTags: ListTag[],
	closeModal: Function,
	setListsArr: React.Dispatch<React.SetStateAction<List[]>>
}


/**
 * **Note**: If `listItem` is null, the modal will be in 'Add New Item' mode.  
 * If `listItem` is not null, the modal will be in 'Edit Item' mode.
 */
export function ListItemCardModal({ isVisible, listItem, listTags, closeModal, setListsArr }: ListItemCardModalProps) {
	const [ nameInput, setNameInput ] = useState<string>('');
	const [ additionalNotesInput, setAdditionalNotesInput ] = useState<string>('');
	const [ priceInput, setPriceInput ] = useState<string>('');
	const [ isOnSaleChecked, setIsOnSaleChecked ] = useState<boolean>(false);
	const [ addTagInput, setAddTagInput ] = useState<string>('');
	const [ listItemTags, setListItemTags ] = useState<ListTag[]>([]);

	const modalButtons: {add: StyledModalButton, save: StyledModalButton, delete: StyledModalButton} = {
		add: {text: 'Add', onPress: handleAddOnPress},
		save: {text: 'Save', onPress: handleSaveOnPress},
		delete: {text: 'Delete', textColour: 'red', onPress: handleDeleteOnPress}
	};

	useEffect(() => {
		if (listItem) {
			setNameInput(listItem.name);
			setAdditionalNotesInput(listItem.additionalNotes ?? '');
			setPriceInput(listItem.price ?? '');
			setIsOnSaleChecked(isListItemOnSale(listItem));
			setListItemTags(listItem.tags);
		}
	}, [isVisible]);

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
		console.log('add!!!');
	}

	function handleSaveOnPress() {
		console.log('save!!!');
	}

	function handleDeleteOnPress() {
		console.log('delete!!!');
	}

	function handleTagRemoveOnPress(tagIndex: number) {
		let tempArr = [...listItemTags];
		tempArr.splice(tagIndex, 1);
		setListItemTags(tempArr);
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
						style={styles.input}
						value={addTagInput}
						onChangeText={setAddTagInput}
					/>
				</View>

				<View style={styles.tagsContainer}>
					{listItemTags.map((tag, index) =>
						<View key={tag.id} style={styles.tag}>
							<View style={[styles.tagCircle, {backgroundColor: tag.colour}]}/>
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
		fontSize: 13.5,
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
		fontSize: 12,
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
		fontSize: 13.5,
		color: textColours.grey
	},
	tagsContainer: {
		flexDirection: 'row',
		paddingTop: vs(12),
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
		fontSize: 10,
		fontFamily: appFonts.regular,
		color: 'black'
	},
	tagXIconTouchable: {
		marginLeft: hs(0),
		// backgroundColor: 'blue',
		paddingVertical: vs(3),
		paddingHorizontal: hs(4),
	},
	tagXIcon: {
		width: hs(6),
		height: hs(6),
		tintColor: textColours.grey
	}
});
