import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import Home from './view/Home';
import Map from './view/Map';

const RootStack = createStackNavigator(
  {
    NotUber: {
      screen: Map,
    },
  },
  {
    initalRouteName: 'Map',
  }
);

const AppContainer = createAppContainer(RootStack);

export default function App() {
  return (
    <PaperProvider>
      <AppContainer/>
    </PaperProvider>
  );
}

