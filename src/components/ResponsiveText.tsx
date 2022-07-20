import React from 'react';
import { Text, type TextProps } from 'react-native';
import { ms as mhs } from 'react-native-size-matters';


type FontStyleProps = {style?: {fontSize: number}};
type ResponsiveTextProps = TextProps & FontStyleProps; 


export function ResponsiveText(props: ResponsiveTextProps) {
	return (
		<Text {...props} style={[{fontSize: props.style?.fontSize ? mhs(props.style.fontSize, 0.3) : undefined}, props.style]}> 
			{props.children}
		</Text>
	);
};
