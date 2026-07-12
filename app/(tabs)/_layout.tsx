import { Tabs } from 'expo-router';
import { Text } from 'react-native';

function TabEmoji({ symbol, focused }: { symbol: string; focused: boolean }) {
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>{symbol}</Text>;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#aaa',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ focused }) => <TabEmoji symbol="📅" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => <TabEmoji symbol="📊" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: 'Items',
          tabBarIcon: ({ focused }) => <TabEmoji symbol="🍽️" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ focused }) => <TabEmoji symbol="📚" focused={focused} />,
        }}
      />
      {__DEV__ && (
        <Tabs.Screen
          name="devtools"
          options={{
            title: 'DevTools',
            tabBarIcon: ({ focused }) => <TabEmoji symbol="🛠️" focused={focused} />,
          }}
        />
      )}
    </Tabs>
  );
}
