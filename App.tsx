import React from 'react';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { s as hs, vs } from 'react-native-size-matters';

import { ResponsiveText as Text } from './src/components/ResponsiveText';
import { appFonts } from './src/constants/fonts';
import { appColours } from './src/constants/colours';
import { backIcon } from './src/constants/images';

import type { StackParamList } from './src/types/types';

// === Screens ===
import MyListsScreen from './src/screens/MyListsScreen';
import ListScreen from './src/screens/ListScreen';
// ===


const navgiationContainerTheme = {
	...DefaultTheme,
	colors: {
	  	...DefaultTheme.colors,
	  	background: 'white',
	}
};

const Stack = createNativeStackNavigator<StackParamList>();


function App() {
	return (
		<NavigationContainer theme={navgiationContainerTheme}>
			<Stack.Navigator initialRouteName="MyLists">

				<Stack.Screen 
					name="MyLists"
					component={MyListsScreen}
					options={{
						header: () => (
							<View style={styles.headerContainer}>
								<Text style={styles.headerTitleText}>My Lists</Text>
							</View>
						),
						// headerTitle: () => (
						// 	<View style={styles.headerTitleContainer}>
						// 		<Text style={styles.headerTitleText}>My Lists</Text>
						// 	</View>
						// ),
					}}
				/>

				<Stack.Screen
					name="List"
					component={ListScreen}
					options={({ navigation, route }) => ({
						header: () => (
							<View style={styles.headerContainer}>
								<TouchableOpacity activeOpacity={0.4} onPress={() => navigation.goBack()} style={styles.headerLeftBackButtonTouchable}>
									<Image source={backIcon} resizeMode='contain' style={styles.headerLeftBackButtonIcon}/>
								</TouchableOpacity>

								<Text style={styles.headerTitleText}>{route.params.listName}</Text>
							</View>
						),
						// headerTitle: () => (
						// 	<View style={styles.headerTitleContainerMaxWidth}>
						// 		<Text adjustsFontSizeToFit style={styles.headerTitleText}>{route.params.listName}</Text>
						// 	</View>
						// ),
						// headerBackVisible: false,
						// headerLeft: () => (
						// 	<TouchableOpacity activeOpacity={0.4} onPress={() => navigation.goBack()} style={styles.headerLeftBackButtonTouchable}>
						// 		<Image source={backIcon} resizeMode='contain' style={styles.headerLeftBackButtonIcon}/>
						// 	</TouchableOpacity>
						// ),
					})}
				/>

			</Stack.Navigator>
		</NavigationContainer>
	);
}


const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		height: vs(65),
		paddingHorizontal: hs(15),
		borderBottomColor: appColours.dividerColour,
		borderBottomWidth: 1,
		backgroundColor: 'white'
	},
	headerTitleContainer: {
		justifyContent: 'center',
		height: vs(65)
	},
	headerTitleContainerMaxWidth: {
		justifyContent: 'center',
		height: vs(65),
		maxWidth: hs(300)
	},
	headerTitleText: {
		fontFamily: appFonts.semibold,
		fontSize: 32,
		color: 'black'
	},
	headerLeftBackButtonTouchable: {
		paddingHorizontal: hs(7),
		paddingVertical: vs(5),
		marginRight: hs(7),
		marginLeft: -hs(7)
	},
	headerLeftBackButtonIcon: {
		width: hs(14),
		height: undefined,
		aspectRatio: 0.8
	}
});


export default App;
