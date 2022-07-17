import React, {  } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { appFonts } from './src/constants/fonts';

// === Types ===
import { StackParamList } from './src/types/types';
// ===

// === Screens ===
import MyListsScreen from './src/screens/MyListsScreen';
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
						// header: () => (
						// 	<View style={{ justifyContent: 'center', height: 75, paddingHorizontal: 20, backgroundColor: 'white', borderBottomColor: '#D9D9D9', borderBottomWidth: 1}}>
						// 		<Text style={{ fontSize: 32, color: 'black' }}>My Lists</Text>
						// 	</View>
						// ),
						headerTitle: () => (
							<View style={{ justifyContent: 'center', height: 75 }}>
								<Text style={{ fontFamily: appFonts.medium, fontSize: 32, color: 'black' }}>My Lists</Text>
							</View>
						),
					}}
				/>

			</Stack.Navigator>
		</NavigationContainer>
	);
}


const styles = StyleSheet.create({

});

export default App;
