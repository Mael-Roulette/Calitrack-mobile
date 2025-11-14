import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator
} from '@react-navigation/material-top-tabs';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
import React from 'react';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<MaterialTopTabNavigationOptions, typeof Navigator, TabNavigationState<ParamListBase>, MaterialTopTabNavigationEventMap>( Navigator );

const ListLayout = () => {
  return (
    <MaterialTopTabs></MaterialTopTabs>
  )
}

export default ListLayout