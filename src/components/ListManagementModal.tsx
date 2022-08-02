import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import { StyledModal } from './StyledModal';
import { ResponsiveText as Text } from './ResponsiveText';
import { appFonts } from '../constants/fonts';
import { appColours } from '../constants/colours';
import { s as hs, vs } from 'react-native-size-matters';

import type { List, ValidListManagementModalType } from '../types/types';
import type { StyledModalButton } from '../types/types';


interface ListManagementModalProps {
	isVisible: boolean,
	type: ValidListManagementModalType
	list: List | null,
	setListsArr: React.Dispatch<React.SetStateAction<List[]>>,
	closeModal: Function
}


export function ListManagementModal({ isVisible, type, list, closeModal }: ListManagementModalProps) {
	const [ nameInput, setNameInput ] = useState<string>('');
	const [ inviteCodeInput, setInviteCodeInput ] = useState<string>('');

	useEffect(() => {
		if (!isVisible) return;

		if (type == 'edit') {
			setNameInput(list?.name ?? '');
		}
	}, [isVisible]);

	const styles = StyleSheet.create({
		row: {
			flexDirection: 'row',
			alignItems: 'center'
		},
		inputPrompt: {
			fontFamily: appFonts.regular,
			fontSize: 17,
			color: 'black',
			marginRight: hs(10)
		},
		input: {
			backgroundColor: '#F0F0F0',
			borderRadius: 5,
			height: vs(27),
			flex: 1,
			paddingVertical: 0,
			paddingHorizontal: hs(6),
			fontFamily: appFonts.regular,
			fontSize: 13.5
		},
		deleteText: {
			fontFamily: appFonts.regular,
			fontSize: 15,
			color: 'black'
		},
		deleteTextBold: {
			fontFamily: appFonts.semibold,
			fontSize: 15,
			color: 'black'
		}
	});

	function clearStates() {
		setNameInput('');
		setInviteCodeInput('');
	}

	function getModalTitle(type: ValidListManagementModalType) {
		switch(type) {
			case 'create':
				return 'Create a New List';
			case 'join':
				return "Join Someone Else's List";
			case 'edit':
				return 'Edit List';
			case 'invite':
				return 'Invite Others';
			case 'delete':
				return 'Delete List';
			default:
				return '';
		}
	}

	function getModalChildren(type: ValidListManagementModalType) {
		switch(type) {
			case 'create':
				return (
					<View style={styles.row}>
						<Text style={styles.inputPrompt}>
							Name:
						</Text>
						<TextInput
							style={styles.input}
							value={nameInput}
							onChangeText={setNameInput}
						/>
					</View>
				);
			case 'join':
				return (
					<View style={styles.row}>
						<Text style={styles.inputPrompt}>
							Invite Code:
						</Text>
						<TextInput
							style={styles.input}
							value={inviteCodeInput}
							onChangeText={setInviteCodeInput}
						/>
					</View>
				);
			case 'edit':
				return (
					<View style={styles.row}>
						<Text style={styles.inputPrompt}>
							Name:
						</Text>
						<TextInput
							style={styles.input}
							value={nameInput}
							onChangeText={setNameInput}
						/>
					</View>
				);
			case 'delete':
				return (
					<Text style={styles.deleteText}>
						Are you sure you want to delete "
						<Text style={styles.deleteTextBold}>
							{list?.name ?? ''}
						</Text>
						"?
					</Text>
				);
			default:
				return null;
		}
	}

	function getModalRightButton(type: ValidListManagementModalType): StyledModalButton|undefined {
		switch(type) {
			case 'create':
				return {text: 'Create', onPress: createOnPressHandler};
			case 'join':
				return {text: 'Join', onPress: () => {console.log('joined!!!'); closeModal()}};
			case 'edit':
				return {text: 'Save', onPress: () => {console.log('saved!!!'); closeModal()}};
			case 'delete':
				return {text: 'Delete', textColour: 'red', onPress: () => {console.log('deleted!!!'); closeModal()}};
			default:
				return undefined;
		}
	}

	function createOnPressHandler() {
		console.log('created!!!');
		closeModal();
	}


	return (
		<StyledModal
			title={getModalTitle(type)}
			isVisible={isVisible}
			closeModal={closeModal}
			borderColor={appColours.green}
			rightButton={getModalRightButton(type)}
			onClose={clearStates}
		>
			{getModalChildren(type)}
		</StyledModal>
	);
}
