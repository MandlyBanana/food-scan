import { getFile } from '@/constants/fs';
import { useFocusEffect } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Dashboard() {
  const [progress, setProgress] = useState(0); // current progress
  const [goal, setGoal] = useState(100); // max value (goal)
  const [inputGoal, setInputGoal] = useState('100');
  const animation = useRef(new Animated.Value(0)).current;

  // Load progress from constants.json on mount
  useEffect(() => {
    async function loadConstants() {
      try {
        const file = await getFile('constants.json');
        if (file.exists) {
          const text = await file.textSync();
          const constants = JSON.parse(text);
          setProgress(Number(constants.totalWeight || 0));
        }
      } catch (e) {
        console.warn('Failed to load constants.json', e);
      }
    }
    loadConstants();
  }, []);

  // Refresh when screen is focused
  useFocusEffect(
    useRef(() => {
      let mounted = true;
      async function refresh() {
        try {
          const file = await getFile('constants.json');
          if (file.exists) {
            const text = await file.textSync();
            const constants = JSON.parse(text);
            if (mounted) {
              setProgress(Number(constants.totalWeight || 0));
            }
          }
        } catch (e) {
          console.warn('Failed to refresh constants.json', e);
        }
      }
      refresh();
      return () => { mounted = false; };
    }).current
  );

  const progressRatio = Math.min(progress / goal, 1); // ensure it doesn't exceed 1

  useEffect(() => {
    Animated.timing(animation, {
      toValue: progressRatio,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progressRatio]);

  const widthInterpolated = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Interpolate bar color from green -> yellow -> red
  const colorInterpolated = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#00ff00', '#ffff00', '#ff0000'], // green → yellow → red
  });

  const handleGoalChange = async () => {
    const newGoal = parseFloat(inputGoal);
    if (!isNaN(newGoal) && newGoal > 0) {
      setGoal(newGoal);
      // Save goal to constants.json
      try {
        const file = await getFile('constants.json');
        if (!file.exists && file.create) {
          await file.create();
        }
        const text = await file.textSync();
        let constants: Record<string, any> = {};
        try {
          constants = JSON.parse(text);
        } catch (e) {
          constants = {};
        }
        constants.goal = newGoal;
        await file.write(JSON.stringify(constants, null, 2));
      } catch (e) {
        console.warn('Failed to save goal to constants.json', e);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food wasted this week:</Text>

      {/* Progress bar */}
      <View style={styles.progressBackground}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: widthInterpolated,
              backgroundColor: colorInterpolated,
            },
          ]}
        />
      </View>

      <Text style={styles.percentText}>
        {progress}g / {goal}g ({Math.round(progressRatio * 100)}%)
      </Text>

      {/* Buttons for demo */}
      <View style={styles.buttons}>
        <Button title="+" onPress={() => setProgress(Math.min(progress + 10, 999999999))} />
        <Button title="-" onPress={() => setProgress(Math.max(progress - 10, 0))} />
      </View>

      {/* Goal input */}
      <View style={styles.goalContainer}>
        <Text style={styles.label}>Set new goal:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={inputGoal}
          onChangeText={setInputGoal}
          onSubmitEditing={handleGoalChange}
        />
        <Button title="Update" onPress={handleGoalChange} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
    paddingHorizontal: 20,
  },
  title: {
    color: 'white',
    fontSize: 28,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  progressBackground: {
    width: '90%',
    height: 40, // thicker bar
    backgroundColor: '#333',
    borderRadius: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 20,
  },
  percentText: {
    color: 'white',
    marginTop: 10,
    fontSize: 18,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  goalContainer: {
    marginTop: 30,
    width: '80%',
    alignItems: 'center',
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#222',
    color: 'white',
    width: '60%',
    textAlign: 'center',
    borderRadius: 10,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 16,
  },
});
