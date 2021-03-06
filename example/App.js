import React from 'react';
import { Asset, registerRootComponent } from 'expo';
import { FlatList, I18nManager } from 'react-native';
import { createAppContainer } from '@react-navigation/native';

import {
  Assets as StackAssets,
  createStackNavigator,
} from 'react-navigation-stack';
import { List, Divider } from 'react-native-paper';

import SimpleStack from './src/SimpleStack';
import SimpleTabs, { createSimpleTabs } from './src/SimpleTabs';
import EventsStack from './src/EventsStack';

// Comment/uncomment the following two lines to toggle react-native-screens
// import { useScreens } from 'react-native-screens';
// useScreens();

// Uncomment the following line to force RTL. Requires closing and re-opening
// your app after you first load it with this option enabled.
I18nManager.forceRTL(false);

const data = [
  { component: SimpleStack, title: 'Simple Stack', routeName: 'SimpleStack' },
  { component: SimpleTabs, title: 'Simple Tabs', routeName: 'SimpleTabs' },
  { component: EventsStack, title: 'Events', routeName: 'EventsStack' },
];

['initialRoute', 'none', 'order', 'history'].forEach(backBehavior => {
  data.push({
    component: createSimpleTabs({
      backBehavior: backBehavior,
      initialRouteName: 'C', // more easy to test initialRoute behavior
    }),
    title: `Tabs backBehavior=${backBehavior}`,
    routeName: `Tabs backBehavior=${backBehavior}`,
  });
});

// Cache images
Asset.loadAsync(StackAssets);

class Home extends React.Component {
  static navigationOptions = {
    title: 'Examples',
  };

  _renderItem = ({ item }) => (
    <List.Item
      title={item.title}
      onPress={() => this.props.navigation.navigate(item.routeName)}
    />
  );

  _keyExtractor = item => item.routeName;

  render() {
    return (
      <FlatList
        ItemSeparatorComponent={Divider}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        data={data}
        style={{ backgroundColor: '#fff' }}
      />
    );
  }
}

const Root = createStackNavigator(
  {
    Home: createStackNavigator({ Home }),
    ...data.reduce((acc, it) => {
      acc[it.routeName] = {
        screen: it.component,
        navigationOptions: {
          title: it.title,
        },
      };

      return acc;
    }, {}),
  },
  {
    mode: 'modal',
    headerMode: 'none',
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
  }
);

const App = createAppContainer(Root);
export default App;
registerRootComponent(App);
