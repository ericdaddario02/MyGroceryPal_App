import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

import { StyledModal } from './StyledModal';
import { ResponsiveText as Text } from './ResponsiveText';
import { appFonts } from '../constants/fonts';
import { appColours, textColours } from '../constants/colours';
import { copyIcon } from '../constants/images';
import { s as hs, vs } from 'react-native-size-matters';

import type { List, ValidListManagementModalType, StyledModalButton } from '../types/types';


interface ListManagementModalProps {
	isVisible: boolean,
	type: ValidListManagementModalType
	list: List | null,
	setListsArr: React.Dispatch<React.SetStateAction<List[]>>,
	closeModal: Function
}


export function ListManagementModal({ isVisible, type, list, setListsArr, closeModal }: ListManagementModalProps) {
	const [ nameInput, setNameInput ] = useState<string>('');
	const [ inviteCodeInput, setInviteCodeInput ] = useState<string>('');
	const [ isCopied, setIsCopied ] = useState<boolean>(false);

	useEffect(() => {
		if (!isVisible) return;

		if (type == 'edit') {
			setNameInput(list?.name ?? '');
		}
	}, [isVisible]);

	function resetStates() {
		setNameInput('');
		setInviteCodeInput('');
		setIsCopied(false);
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
						<Text style={styles.inputPrompt}>Name:</Text>
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
						<Text style={styles.inputPrompt}>Invite Code:</Text>
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
						<Text style={styles.inputPrompt}>Name:</Text>
						<TextInput
							style={styles.input}
							value={nameInput}
							onChangeText={setNameInput}
						/>
					</View>
				);
			case 'invite':
				return (
					<View>
						<View style={styles.row}>
							<Text style={styles.inputPrompt}>Invite Code:</Text>
							<View style={styles.inviteCode}>
								<Text style={styles.inviteCodeText}>{list?.inviteCode}</Text>
							</View>
							<View style={styles.inviteCodeCopyButtonContainer}>
								<TouchableOpacity activeOpacity={0.4} style={styles.inviteCodeCopyButtonTouchable} onPress={() => handleCopyButtonPress(list?.inviteCode ?? '')}>
									<Image source={copyIcon} resizeMode='contain' style={styles.inviteCodeCopyButtonIcon}/>
								</TouchableOpacity>
							</View>
						</View>
						<Text style={styles.inviteCodeExplanationText}>
							{isCopied ? 'Copied!' : 'Copy this invite code and send it to those you would like to share to list with!'}
						</Text>
					</View>
				)
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
				return {text: 'Create', onPress: handleCreateOnPress};
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

	function handleCopyButtonPress(inviteCode: string) {
		Clipboard.setString(inviteCode);
		setIsCopied(true);
	}

	function handleCreateOnPress() {
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
			onClose={resetStates}
		>
			{getModalChildren(type)}
		</StyledModal>
	);
}


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
		fontSize: 13.5,
		color: textColours.grey
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
	},
	inviteCode: {
		backgroundColor: '#F0F0F0',
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
		height: vs(27),
		flex: 1,
		paddingLeft: hs(6),
		justifyContent: 'center'
		
	},
	inviteCodeCopyButtonContainer: {
		backgroundColor: '#D9D9D9',
		height: vs(27),
		width: hs(32),
		borderTopRightRadius: 5,
		borderBottomRightRadius: 5
	},
	inviteCodeText: {
		color: '#575757',
		fontSize: 13.5,
		fontFamily: appFonts.regular
	},
	inviteCodeCopyButtonTouchable: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	inviteCodeCopyButtonIcon: {
		height: '65%',
		aspectRatio: 20 / 25,
		tintColor: '#3F3F3F'
	},
	inviteCodeExplanationText: {
		fontSize: 12.5,
		fontFamily: appFonts.light,
		color: 'black',
		marginTop: vs(5)
	}
});
