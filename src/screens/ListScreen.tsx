import React, { useEffect, useState, useMemo } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { s as hs, vs } from 'react-native-size-matters';

import { ResponsiveText as Text } from '../components/ResponsiveText';
import { appColours, textColours } from '../constants/colours';
import { appFonts } from '../constants/fonts';
import { dropdownArrowIcon } from '../constants/images';

import type { ListScreenProps, List, ListTag, ListItem } from '../types/types';


function ListScreen({ navigation, route }: ListScreenProps) {
	const [ isFilterPressed, setIsFilterPressed ] = useState<boolean>(false);
	const [ activeFilters, setActiveFilters ] = useState<boolean[]>(new Array(route.params.listTags.length).fill(false));

	const filterAnimationValues = useMemo(() => {
		return {
			filterIconRotationValue: new Animated.Value(0),
			filterTagsContainerHeight: new Animated.Value(0),
			tagsHeight: 0
		};
	}, []);

	useEffect(() => {
		if (isFilterPressed) {
			Animated.timing(filterAnimationValues.filterIconRotationValue, {
				toValue: 1,
				duration: 150,
				easing: Easing.linear,
				useNativeDriver: true
			}).start();
			Animated.timing(filterAnimationValues.filterTagsContainerHeight, {
				toValue: filterAnimationValues.tagsHeight,
				duration: 150,
				easing: Easing.bezier(0,.77,.82,.99),
				useNativeDriver: false
			}).start();
		} else {
			Animated.timing(filterAnimationValues.filterIconRotationValue, {
				toValue: 0,
				duration: 150,
				easing: Easing.linear,
				useNativeDriver: true
			}).start();
			Animated.timing(filterAnimationValues.filterTagsContainerHeight, {
				toValue: 0,
				duration: 150,
				easing: Easing.bezier(0,.77,.82,.99),
				useNativeDriver: false
			}).start();
		}
	}, [isFilterPressed]);

	const filterIconRotationDeg = filterAnimationValues.filterIconRotationValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '-180deg']
	});

	function handleFilterButtonPress() {
		setIsFilterPressed(!isFilterPressed);
	}

	function handleFilterTagsContainerHeightChange(height: number) {
		if (height != 0) {
			filterAnimationValues.tagsHeight = height;
		} else if (route.params.listTags.length == 0) {
			filterAnimationValues.tagsHeight = 0;
		}
	}

	function handleFilterTagPress(tag: ListTag, index: number) {
		let tempArr = [...activeFilters];
		tempArr[index] = !tempArr[index];
		setActiveFilters(tempArr);
	}


	return (
		<View>
			<View style={styles.filterButtonContainer}>
				<TouchableOpacity activeOpacity={0.4} style={styles.filterTouchable} onPress={handleFilterButtonPress}>
					<Text style={styles.filterText}>Filter</Text>
					<Animated.Image source={dropdownArrowIcon} resizeMode="contain" style={[styles.filterIcon, {transform: [{rotate: filterIconRotationDeg}]}]}/>
				</TouchableOpacity>
			</View>

			<Animated.View style={[styles.filterTagsAnimatedView, {height: filterAnimationValues.filterTagsContainerHeight}]}>
				<View style={{marginTop: 1}} onLayout={({ nativeEvent }) => handleFilterTagsContainerHeightChange(nativeEvent.layout.height)}>
					<View style={styles.filterTagsContainer}>
						{route.params.listTags.map((tag, index) =>
							<View key={tag.id} style={[styles.filterTagButton, {backgroundColor: activeFilters[index] ? 'rgba(74, 196, 247, .15)': 'white'}]}>
								<TouchableOpacity activeOpacity={0.6} style={styles.filterTagButtonTouchable} onPress={() => handleFilterTagPress(tag, index)}>
									<View style={[styles.filterTagCircle, {backgroundColor: tag.colour}]}/>
									<Text style={styles.filterTagName}>{tag.name}</Text>
								</TouchableOpacity>
							</View>
						)}
					</View>
				</View>
			</Animated.View>

			<View style={styles.activeFiltersContainer}>
				{route.params.listTags.map((tag, index) =>
					activeFilters[index]
					&&
					<View style={styles.activeFilter}>
						<View style={[styles.activeFilterCircle, {backgroundColor: tag.colour}]}/>
						<Text style={styles.activeFilterName}>{tag.name}</Text>
					</View>
				)}
			</View>

			<ScrollView contentContainerStyle={styles.allListItemsContainer}>
				{route.params.listItems.map((item, index) =>
					<View style={styles.listItemCardRow}>
						<View style={styles.listItemCardLeftBullet}/>
						<View style={styles.listItemCard}>
							<TouchableOpacity activeOpacity={0.5} style={styles.listItemCardTouchable}>
								<View style={styles.listItemCardTopRow}>
									<Text style={styles.listItemCardName}>{item.name}</Text>
									{item.price &&
										<Text style={styles.listItemCardPrice}>{'$' + item.price}</Text>
									}
								</View>

								{item.additionalNotes &&
									<View style={styles.listItemCardAdditionalNotesContainer}>
										<Text style={styles.listItemCardAdditionalNotes}>{item.additionalNotes}</Text>
									</View>
								}

								{item.tags.length > 0
									?
									<View style={styles.listItemCardTagsContainer}>
										{item.tags.map(tag => 
											<View style={styles.listItemCardTag}>
												<View style={[styles.listItemCardTagCircle, {backgroundColor: tag.colour}]}/>
												<Text style={styles.listItemCardTagName}>{tag.name}</Text>
											</View>
										)}
									</View>
									:
									<View style={styles.listItemCardNoTagsBottomPadding}/>
								}
							</TouchableOpacity>
						</View>
					</View>
				)}
			</ScrollView>
		</View>
	);
}


const styles = StyleSheet.create({
	// Filter Button
	filterButtonContainer: {
		height: vs(40),
		width: '100%',
		paddingHorizontal: hs(16),
		flexDirection: 'row-reverse',
		alignItems: 'center'
	},
	filterTouchable: {
		paddingHorizontal: hs(5),
		paddingVertical: vs(3),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	filterText: {
		fontFamily: appFonts.regular,
		fontSize: 16,
		color: textColours.blue
	},
	filterIcon: {
		width: hs(11),
		height: undefined,
		aspectRatio: 11 / 7,
		marginLeft: hs(4),
		tintColor: textColours.blue
	},

	// Collapsible Filter View
	filterTagsAnimatedView: {
		borderBottomColor: appColours.dividerColour,
		borderBottomWidth: 1,
		overflow: 'scroll',
		paddingLeft: hs(16),
		paddingRight: hs(6),  // right and left separated since the filter buttons themselves have a right margin
		justifyContent: 'flex-start'
	},
	filterTagsContainer: {
		flexDirection: 'row',
		paddingBottom: vs(8),
		flexWrap: 'wrap',
	},
	filterTagButton: {
		borderColor: appColours.grey,
		borderWidth: 1,
		borderRadius: 5,
		marginRight: hs(10),
		marginBottom: vs(10)
	},
	filterTagButtonTouchable: {
		paddingVertical: vs(5),
		paddingHorizontal: hs(6),
		flexDirection: 'row',
		alignItems: 'center'
	},
	filterTagCircle: {
		borderRadius: 100,
		height: hs(10),
		width: hs(10),
		marginRight: hs(6),
		borderWidth: 1,
		borderColor: 'black',
	},
	filterTagName: {
		fontSize: 12,
		fontFamily: appFonts.regular,
		color: 'black'
	},

	// Active Filters
	activeFiltersContainer: {
		flexDirection: 'row',
		paddingTop: vs(8),
		paddingBottom: vs(7),
		flexWrap: 'wrap',
		paddingLeft: hs(16),
		paddingRight: hs(10),  // right and left separated since the active filter views themselves have a right margin,
	},
	activeFilter: {
		borderWidth: 1,
		borderColor: appColours.grey,
		borderRadius: 10,
		paddingHorizontal: hs(3),
		paddingVertical: vs(0.5),
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: hs(6),
		marginBottom: vs(5)
	},
	activeFilterCircle: {
		borderRadius: 100,
		height: hs(7),
		width: hs(7),
		marginRight: hs(3),
		borderWidth: 1,
		borderColor: 'black',
	},
	activeFilterName: {
		fontSize: 9,
		fontFamily: appFonts.regular,
		color: 'black'
	},

	// List Items
	allListItemsContainer: {
		paddingHorizontal: hs(16)
	},
	listItemCardRow: {
		marginBottom: vs(12),
		flexDirection: 'row',
		alignItems: 'center'
	},
	listItemCardLeftBullet: {
		width: hs(13),
		height: vs(3),
		backgroundColor: appColours.grey,
		borderRadius: 3,
		marginRight: hs(10)
	},
	listItemCard: {
		borderWidth: 3,
		borderColor: appColours.grey,
		borderRadius: 10,
		flex: 1
	},
	listItemCardTouchable: {
		paddingTop: vs(4),
		paddingHorizontal: hs(7)
	},
	listItemCardTopRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start'
	},
	listItemCardName: {
		fontSize: 17,
		fontFamily: appFonts.medium,
		color: 'black',
		flexShrink: 1
	},
	listItemCardPrice: {
		fontSize: 14,
		fontFamily: appFonts.regular,
		color: textColours.grey
	},
	listItemCardAdditionalNotesContainer: {
		marginTop: vs(3)
	},
	listItemCardAdditionalNotes: {
		fontSize: 12,
		fontFamily: appFonts.regular,
		color: textColours.grey
	},
	listItemCardTagsContainer: {
		flexDirection: 'row-reverse',
		flexWrap: 'wrap',
		marginTop: vs(5),
		marginBottom: vs(1)
	},
	listItemCardTag: {
		borderWidth: 1,
		borderColor: appColours.grey,
		borderRadius: 10,
		paddingHorizontal: hs(3),
		paddingVertical: vs(0.5),
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: hs(6),
		marginBottom: vs(4)
	},
	listItemCardTagCircle: {
		borderRadius: 100,
		height: hs(7),
		width: hs(7),
		marginRight: hs(3),
		borderWidth: 1,
		borderColor: 'black',
	},
	listItemCardTagName: {
		fontSize: 9,
		fontFamily: appFonts.regular,
		color: 'black'
	},
	listItemCardNoTagsBottomPadding: {
		height: vs(5)
	}
});


export default ListScreen;
