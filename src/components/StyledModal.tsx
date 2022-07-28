import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Modal from 'react-native-modal';
import { s as hs, vs } from "react-native-size-matters";

import { ResponsiveText as Text } from "./ResponsiveText";
import { appColours, textColours } from '../constants/colours';
import { appFonts } from '../constants/fonts';


interface StyledModalProps {
    title: string,
    children: React.ReactElement,
    visible: boolean,
    borderColor?: string,
    rightButton?: StyledModalButton,
    leftButton?: StyledModalButton,
    modalAnimations?: StyledModalAnimation
}

interface StyledModalButton {
    text: 'string',
    textColour?: 'string'
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


export function StyledModal({ title, children, visible, borderColor = appColours.grey, rightButton, leftButton, modalAnimations }: StyledModalProps) {
    const defaultModalAnimations = {
		in: {
			from: {
				opacity: 0,
				translateY: vs(25),
                scale: 0.5
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
				translateY: vs(25),
                scale: 0.5
			}
		}
	};

    const styles = StyleSheet.create({
        container: {
            borderWidth: 5,
            borderRadius: 5,
            borderColor: borderColor
        },
        buttonsContainer: {
            flexDirection: 'row',
            width: '95%',
            justifyContent: 'space-between'
        },
        titleContainer: {
            paddingVertical: vs(5),
            paddingHorizontal: hs(5),
            borderBottomWidth: 1,
            borderBottomColor: appColours.dividerColour,
            marginBottom: vs(5)
        },
        titleText: {
            fontSize: 22,
            fontFamily: appFonts.medium
        },
        childrenContainer: {
            paddingVertical: vs(5),
            paddingHorizontal: hs(5)
        },
        buttonContainer: {
            paddingVertical: vs(2),
            paddingHorizontal: hs(7),
            borderWidth: 2,
            borderColor: appColours.grey,
            borderRadius: 5
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
    });

    return (
        <Modal
            isVisible={visible}
            animationIn={modalAnimations?.in ?? defaultModalAnimations.in}
            animationInTiming={250}
            animationOut={modalAnimations?.out ?? defaultModalAnimations.out}
            animationOutTiming={250}
            style={{ margin: 0 }} // margin to 0 to more accurately position the modal popup at an 'absolute' window position
        >
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{title}</Text>
                </View>
                
                <View style={styles.childrenContainer}>
                    {children}
                </View>

                <View style={styles.buttonsContainer}>
                    {leftButton &&
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity activeOpacity={0.3}>
                                <Text style={styles.leftButtonText}>{leftButton.text}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {rightButton &&
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity activeOpacity={0.3}>
                                <Text style={styles.rightButtonText}>{rightButton.text}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
        </Modal>
    )
}
