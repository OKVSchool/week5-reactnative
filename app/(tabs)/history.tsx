import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Polyline, Circle, Text as SvgText } from 'react-native-svg';
import { SEED_MEALS } from '../../data/meals';

const W = Dimensions.get('window').width - 48;
const H = 220;
const PAD = { t: 10, b: 30, l: 10, r: 10 };
const IW = W - PAD.l - PAD.r;
const IH = H - PAD.t - PAD.b;

const COLORS: Record<string, string> = {
  calories: '#FF6B6B',
  protein:  '#4ECDC4',
  fat:      '#FFE66D',
  carbs:    '#A8E6CF',
};

const KEYS = ['calories', 'protein', 'fat', 'carbs'] as const;
type Key = typeof KEYS[number];

const days: string[] = [];
for (let i = 6; i >= 0; i--) {
  const d = new Date();
  d.setDate(d.getDate() - i);
  days.push([
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-'));
}

const daily = days.map(date => {
  const ms = SEED_MEALS.filter(m => m.date === date);
  return {
    calories: ms.reduce((s, m) => s + m.calories, 0),
    protein:  ms.reduce((s, m) => s + m.protein,  0),
    fat:      ms.reduce((s, m) => s + m.fat,      0),
    carbs:    ms.reduce((s, m) => s + m.carbs,    0),
  };
});

function normalize(vals: number[]) {
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  return vals.map(v => (v - min) / range);
}

function getPoints(key: Key) {
  return normalize(daily.map(d => d[key])).map((v, i) => ({
    x: PAD.l + (i / (days.length - 1)) * IW,
    y: PAD.t + (1 - v) * IH,
  }));
}

const dayLabels = days.map(d =>
  new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })
);

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Progress</Text>
      <Svg width={W} height={H}>
        {KEYS.map(key => (
          <Polyline
            key={`line-${key}`}
            points={getPoints(key).map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke={COLORS[key]}
            strokeWidth={2}
          />
        ))}
        {KEYS.map(key =>
          getPoints(key).map((p, i) => (
            <Circle key={`dot-${key}-${i}`} cx={p.x} cy={p.y} r={3} fill={COLORS[key]} />
          ))
        )}
        {dayLabels.map((label, i) => (
          <SvgText
            key={i}
            x={PAD.l + (i / (days.length - 1)) * IW}
            y={H - 8}
            fontSize={10}
            textAnchor="middle"
            fill="#666"
          >
            {label}
          </SvgText>
        ))}
      </Svg>
      <View style={styles.legend}>
        {KEYS.map(key => (
          <View key={key} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: COLORS[key] }]} />
            <Text style={styles.legendLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  heading:     { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  legend:      { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 16 },
  legendItem:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot:         { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { fontSize: 13 },
});
