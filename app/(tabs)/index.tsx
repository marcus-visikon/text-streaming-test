import { StyleSheet, Image } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import { polyfill as polyfillEncoding } from 'react-native-polyfill-globals/src/encoding';
import { polyfill as polyfillReadableStream } from 'react-native-polyfill-globals/src/readable-stream';
import { polyfill as polyfillFetch } from 'react-native-polyfill-globals/src/fetch';

polyfillEncoding();
polyfillReadableStream();
polyfillFetch();


function TextStreamingContent() {
  const [streamText, setStreamText] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:2312', { reactNative: { textStreaming: true }}).then(async res => {
      const decoder = new TextDecoder('utf-8');
      if (!res.body) {
        console.error('No body in response', res.status);
        return;
      }

      console.log("Got response with body!");

      const reader = res.body.getReader();

      while (true) {
        const { value, done } = await reader.read()
        const text = decoder.decode(value, {stream: !done });
    
        if (done) {
          console.log("Stream complete");
          break;
        }
        
        setStreamText((currentText) => currentText + text);
      }
    }).catch(err => setStreamText('Error: ' + (err?.message || 'Unknown!!')));

    
  }, []);

  return <ThemedText>Text from stream: {streamText}</ThemedText>
}

import { HelloWave } from '@/components/HelloWave';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Text streaming demo!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <TextStreamingContent/>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
