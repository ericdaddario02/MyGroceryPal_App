import React, { useState, useEffect, useRef, type RefObject } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, type StyleProp, type ViewStyle, type GestureResponderEvent, type LayoutChangeEvent } from "react-native";
import { s as hs, vs } from 'react-native-size-matters';
import Modal from 'react-native-modal';

import { ResponsiveText as Text } from './ResponsiveText';
import { appColours } from '../constants/colours';


interface MenuProps {
	button: React.ReactElement,
	buttonContainerStyle?: StyleProp<ViewStyle>,
	children: React.ReactElement
}

interface MenuButtonProps {
	containerStyle?: StyleProp<ViewStyle>,
	dotStyle?: StyleProp<ViewStyle>,
	ref?: RefObject<View>
}

interface MenuItemProps {
	text: string,
	onPress: Function,
	closeMenu?: Function
}


export function Menu({ button, buttonContainerStyle, children }: MenuProps) {
	const [ menuVisible, setMenuVisible ] = useState<boolean>(false);
	const [ menuButtonPosition, setMenuButtonPosition ] = useState({top: 0, left: 0});
	const [ menuChildrenContainerWidth, setMenuChildrenContainerWidth ] = useState<number>(0);

	const menuButtonRef = useRef<View>(null);

	const modalAnimations = {
		in: {
			from: {
				opacity: 0,
				translateY: vs(15)
			},
			to: {
				opacity: 1,
				translateY: 0
			}
		},
		out: {
			from: {
				opacity: 1,
				translateY: 0
			},
			to: {
				opacity: 0,
				translateY: vs(15)
			}
		}
	}

	useEffect(() => {
		menuButtonRef?.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
			setMenuButtonPosition({top: y, left: x});
		});
	}, [menuVisible]);

	function menuChildrenOnLayoutHandler(event: LayoutChangeEvent) {
		setMenuChildrenContainerWidth(event.nativeEvent.layout.width);
	}

	function toggleMenuVisible() {
		setMenuVisible(!menuVisible);
	}

	return (
		<>
		<TouchableOpacity onPress={toggleMenuVisible} style={buttonContainerStyle}>
			<View ref={menuButtonRef}>
				{button}
			</View>
		</TouchableOpacity>

		<Modal
			isVisible={menuVisible}
			animationIn={modalAnimations.in}
			animationInTiming={100}
			animationOut={modalAnimations.out}
			animationOutTiming={100}
			backdropOpacity={0}
			onBackdropPress={toggleMenuVisible}
		>
			<View onLayout={menuChildrenOnLayoutHandler} style={{ position: 'absolute', top: menuButtonPosition.top - vs(17), left: menuButtonPosition.left - menuChildrenContainerWidth - hs(18) }}>
				{children}
			</View>
		</Modal>
		</>
	);
}


export function MenuItem({ text, onPress, closeMenu }: MenuItemProps) {
	const styles = StyleSheet.create({
		body: {
			padding: 10,
		},
	});

	const handleOnPress = () => {
		closeMenu!();
		onPress();
	};

	return (
		<TouchableOpacity onPress={handleOnPress} style={styles.body}>
			<Text numberOfLines={1}>{text}</Text>
		</TouchableOpacity>
	);
};


export function MenuButton({ containerStyle, dotStyle }: MenuButtonProps) {
	const styles = StyleSheet.create({
		container: {
			height: vs(26),
			width: hs(10),
			paddingVertical: vs(3),
			justifyContent: 'space-between',
			alignItems: 'center'
		},
		dot: {
			width: hs(5),
			height: hs(5),
			backgroundColor: 'white',
			borderRadius: 5,
			borderWidth: 1,
			borderColor: appColours.green
		}
	});

	return (
		<View style={[styles.container, containerStyle]}>
			<View style={[styles.dot, dotStyle]}/>
			<View style={[styles.dot, dotStyle]}/>
			<View style={[styles.dot, dotStyle]}/>
		</View>	
	);
}
