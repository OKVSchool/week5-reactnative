import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { FoodTemplate } from '../data/FoodsContext';
import FoodCard from './FoodCard';

type Props = { food: FoodTemplate; onAdd: () => void };

export default function SwipeableFoodCard({ food, onAdd }: Props) {
  const translateX = useSharedValue(0);
  const [showAdded, setShowAdded] = useState(false);

  function triggerAdd() {
    onAdd();
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 3000);
  }

  const pan = Gesture.Pan()
    .onUpdate(e => { translateX.value = Math.max(0, e.translationX); })
    .onEnd(e => {
      if (e.translationX > 120) runOnJS(triggerAdd)();
      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    width: '100%',
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={animatedStyle}>
        <FoodCard food={food} />
        {showAdded && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>Added</Text>
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  overlay:     { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  overlayText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
