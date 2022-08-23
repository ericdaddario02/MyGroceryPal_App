import React, { useMemo } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Modal from 'react-native-modal';
import { s as hs, vs } from "react-native-size-matters";

import { ResponsiveText as Text } from "./ResponsiveText";
import { appColours, textColours } from '../constants/colours';
import { appFonts } from '../constants/fonts';

import type { StyledModalButton } from '../types/types';


interface StyledModalProps {
    title: string,
    children: React.ReactNode,
    isVisible: boolean,
    borderColor?: string,
    rightButton?: StyledModalButton,
    leftButton?: StyledModalButton,
    modalAnimations?: StyledModalAnimation,
	closeModal: Function,
	onClose?: Function
}

interface StyledModalAnimation {
    in: {
        from: {
            opacity?: number,
            translateY?: number,
            scale?: number
        },
        to: {
            opacity?: number,
            translateY?: number,
            scale?: number
        }
    },
    out: {
        from: {
            opacity?: number,
            translateY?: number,
            scale?: number
        },
        to: {
            opacity?: number,
            translateY?: number,
            scale?: number
        }
    }
}


export function StyledModal({ title, children, isVisible, borderColor, rightButton, leftButton, modalAnimations, closeModal, onClose }: StyledModalProps) {
    const defaultModalAnimations = {
		in: {
			from: {
				opacity: 0,
				translateY: vs(20),
                scale: 0.9
			},
			to: {
				opacity: 1,
				translateY: 0,
                scale: 1
			}
		},
		out: {
			from: {
				opacity: 1,
				translateY: 0,
                scale: 1
			},
			to: {
				opacity: 0,
				translateY: vs(20),
                scale: 0.9
			}
		}
	};

    const styles = useMemo(() => StyleSheet.create({
        container: {
            borderWidth: 5,
            borderRadius: 10,
            borderColor: borderColor ?? appColours.grey,
			backgroundColor: 'white',
			width: '93%',
			alignSelf: 'center'
        },
        titleContainer: {
            paddingVertical: vs(5),
            paddingHorizontal: hs(8),
			marginBottom: vs(5),
            borderBottomWidth: 1,
            borderBottomColor: appColours.dividerColour
        },
        titleText: {
            fontSize: 22,
            fontFamily: appFonts.medium,
			color: 'black'
        },
        childrenContainer: {
            paddingVertical: vs(5),
            paddingHorizontal: hs(9)
        },
		childrenDivider: {
			width: '100%',
			height: 1,
			backgroundColor: appColours.dividerColour,
			marginVertical: vs(5)
		},
		buttonsContainer: {
            flexDirection: 'row-reverse',
			paddingTop: vs(5),
			paddingBottom: hs(8),
			paddingHorizontal: hs(8),
            justifyContent: 'space-between'
        },
        button: {
            borderWidth: 2,
            borderColor: appColours.grey,
            borderRadius: 5,
			minWidth: hs(70),
        },
		buttonTouchable: {
			alignItems: 'center',
			paddingVertical: vs(3),
            paddingHorizontal: hs(9)
		},
        leftButtonText: {
            fontFamily: appFonts.medium,
            fontSize: 14,
            color: leftButton?.textColour ?? textColours.blue
        },
        rightButtonText: {
            fontFamily: appFonts.medium,
            fontSize: 14,
            color: rightButton?.textColour ?? textColours.blue
        }
    }), [borderColor, leftButton, rightButton]);
	

    return (
        <Modal
            isVisible={isVisible}
            animationIn={modalAnimations?.in ?? defaultModalAnimations.in}
            animationInTiming={150}
            animationOut={modalAnimations?.out ?? defaultModalAnimations.out}
            animationOutTiming={150}
            style={{ margin: 0 }} // margin to 0 to more accurately position the modal popup at an 'absolute' window position
			onBackdropPress={() => closeModal()}
			onBackButtonPress={() => closeModal()}
			backdropOpacity={0.4}
			onModalHide={() => {if (onClose) onClose()}}
			useNativeDriver
        >
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{title}</Text>
                </View>
                
				{Array.isArray(children)
				?
				children.map((child, index) =>
					<View key={'child' + index}>
						<View style={styles.childrenContainer}>
							{child}
						</View>

						{index != children.length - 1 && 
							<View style={styles.childrenDivider}/>
						}
					</View>					
				)
				:
				<View style={styles.childrenContainer}>
                    {children}
                </View>
				}

                <View style={styles.buttonsContainer}>
					{rightButton &&
                        <View style={styles.button}>
                            <TouchableOpacity activeOpacity={0.3} onPress={rightButton.onPress} style={styles.buttonTouchable}>
                                <Text style={styles.rightButtonText}>{rightButton.text}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {leftButton &&
                        <View style={styles.button}>
                            <TouchableOpacity activeOpacity={0.3} onPress={leftButton.onPress} style={styles.buttonTouchable}>
                                <Text style={styles.leftButtonText}>{leftButton.text}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
        </Modal>
    )
}
