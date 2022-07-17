import React, {  } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { appFonts } from './src/constants/fonts';

// === Screens ===
import MyLists from './src/screens/MyLists';
// ===


const navgiationContainerTheme = {
	...DefaultTheme,
	colors: {
	  	...DefaultTheme.colors,
	  	background: 'white',
	}
};

const Stack = createNativeStackNavigator();


function App() {
	return (
		<NavigationContainer theme={navgiationContainerTheme}>
			<Stack.Navigator initialRouteName="Home">

				<Stack.Screen 
					name="MyLists"
					component={MyLists}
					options={{
						title: 'My Lists',
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
