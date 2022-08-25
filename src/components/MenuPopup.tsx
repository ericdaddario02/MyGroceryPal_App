import React, { useState, useRef, type RefObject } from "react";
import { View, StyleSheet, TouchableOpacity, type StyleProp, type ViewStyle, type LayoutChangeEvent } from "react-native";
import { s as hs, vs } from 'react-native-size-matters';
import Modal from 'react-native-modal';

import { ResponsiveText as Text } from './ResponsiveText';
import { appColours, textColours } from '../constants/colours';
import { appFonts } from '../constants/fonts';


interface MenuProps {
	button: React.ReactElement,
	buttonContainerStyle?: StyleProp<ViewStyle>,
	children: React.ReactElement | React.ReactElement[]
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
	};

	function calculateMenuPositionAndShowMenu() {
        menuButtonRef?.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
			setMenuButtonPosition({top: y, left: x});
            setMenuVisible(true);
		});
    }

	function menuChildrenOnLayoutHandler(event: LayoutChangeEvent) {
		setMenuChildrenContainerWidth(event.nativeEvent.layout.width);
	}

	function toggleMenuVisible() {
        if (!menuVisible) { // if we are going to set menu visible to true
            calculateMenuPositionAndShowMenu();
        } else {
            setMenuVisible(false);
        }
	}

	return (
		<>
		<TouchableOpacity onPress={toggleMenuVisible} style={buttonContainerStyle} activeOpacity={0.4}>
			<View ref={menuButtonRef} collapsable={false}>
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
            style={{ margin: 0 }} // margin to 0 to more accurately position the modal popup at an 'absolute' window position
		>
			<View 
                onLayout={menuChildrenOnLayoutHandler} 
                style={{
                    position: 'absolute',
                    top: menuButtonPosition.top,
                    left: menuButtonPosition.left - menuChildrenContainerWidth,
                    backgroundColor: 'white',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: appColours.grey
                }}
            >
				{/* pass the closeModal to children prop  */}
                {Array.isArray(children)
                ? children.map((childrenItem, index) => {
                    return React.cloneElement(childrenItem, {key: childrenItem.props.title ?? index, closeMenu: toggleMenuVisible});
                  })
                : React.cloneElement(children, {closeMenu: toggleMenuVisible})}
			</View>
		</Modal>
		</>
	);
}


export function MenuItem({ text, onPress, closeMenu }: MenuItemProps) {
	function handleOnPress() {
		closeMenu!();
		onPress();
	};

	return (
		<TouchableOpacity onPress={handleOnPress} activeOpacity={0.6} style={menuItemStyles.container}>
			<Text numberOfLines={1} style={menuItemStyles.itemText}>{text}</Text>
		</TouchableOpacity>
	);
};


export function MenuButton({ containerStyle, dotStyle }: MenuButtonProps) {
	return (
		<View style={[menuButtonStyles.container, containerStyle]}>
			<View style={[menuButtonStyles.dot, dotStyle]}/>
			<View style={[menuButtonStyles.dot, dotStyle]}/>
			<View style={[menuButtonStyles.dot, dotStyle]}/>
		</View>	
	);
}


export function MenuDivider() {
	return (
		<View style={menuDividerStyles.divider} />
	)
}


const menuItemStyles = StyleSheet.create({
	container: {
		paddingHorizontal: hs(7),
		paddingVertical: vs(6)
	},
	itemText: {
		fontFamily: appFonts.regular,
		fontSize: 14,
		color: textColours.grey
	}
});

const menuButtonStyles = StyleSheet.create({
	container: {
		height: vs(28),
		paddingHorizontal: hs(6),
		paddingVertical: vs(5),
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

const menuDividerStyles = StyleSheet.create({
	divider: {
		borderBottomWidth: 1,
		borderBottomColor: appColours.dividerColour,
		marginVertical: vs(1)
	}
});
