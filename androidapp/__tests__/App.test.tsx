/**
 * @format
 */

import React from 'react';
import { Animated } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import Sound from 'react-native-sound';
import VinnyBday from '../components/vinnybday';

jest.mock('react-native-sound', () => {
  const mockPlayer = {
    play: jest.fn(),
    release: jest.fn(),
    setNumberOfLoops: jest.fn(),
    setVolume: jest.fn(),
    stop: jest.fn(),
  };
  const mockSound = jest.fn((_file, _bundle, callback) => {
    callback(null);
    return mockPlayer;
  });
  mockSound.MAIN_BUNDLE = 'bundle';
  mockSound.setCategory = jest.fn();
  return Object.assign(mockSound, { mockPlayer });
});

jest.mock('react-native', () => {
  const createAnimation = () => ({ start: jest.fn(), stop: jest.fn() });

  return {
    View: 'View',
    Text: 'Text',
    Image: 'Image',
    Pressable: 'Pressable',
    StyleSheet: {
      create: (styles: object) => styles,
      absoluteFillObject: { position: 'absolute' },
    },
    Easing: {
      inOut: (easing: unknown) => easing,
      out: (easing: unknown) => easing,
      sin: jest.fn(),
      cubic: jest.fn(),
      linear: jest.fn(),
    },
    Animated: {
      View: 'AnimatedView',
      Value: jest.fn(() => ({ interpolate: () => 1, setValue: jest.fn() })),
      timing: jest.fn(createAnimation),
      sequence: jest.fn(createAnimation),
      loop: jest.fn(createAnimation),
      delay: jest.fn(createAnimation),
    },
  };
});

test('renders the birthday greeting, card, and animated hearts', async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<VinnyBday />);
  });

  [850, 1800, 2100, 1900].forEach(duration => {
    expect(Animated.timing).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ duration, useNativeDriver: true }),
    );
  });
  expect(
    renderer.root.findByProps({ testID: 'birthday-heading' }).props.children,
  ).toBe('Happy Birthday, my love');
  expect(
    renderer.root.findByProps({ testID: 'birthday-card-image' }).props
      .accessibilityLabel,
  ).toBeTruthy();
  expect(
    renderer.root.findByProps({ testID: 'birthday-card-animation' }),
  ).toBeTruthy();
  expect(
    renderer.root.findByProps({ testID: 'love-quote' }).props.children,
  ).toBe('Somehow, every ordinary day becomes brighter with you.');
  expect(
    renderer.root.findByProps({ testID: 'birthday-card-animation' }).props
      .accessibilityElementsHidden,
  ).toBe(true);
  expect(renderer.root.findAllByProps({ testID: 'floating-heart' })).toHaveLength(
    3,
  );
  expect(renderer.root.findByProps({ testID: 'birthday-footer' })).toBeTruthy();
  expect(renderer.root.findAllByProps({ testID: 'music-toggle' })).toHaveLength(
    0,
  );

  const mockedSound = Sound as typeof Sound & {
    mockPlayer: {
      play: jest.Mock;
      release: jest.Mock;
      setNumberOfLoops: jest.Mock;
      stop: jest.Mock;
    };
  };
  expect(mockedSound.mockPlayer.play).toHaveBeenCalledTimes(1);
  expect(mockedSound.mockPlayer.setNumberOfLoops).toHaveBeenCalledWith(-1);

  await ReactTestRenderer.act(() => {
    renderer.root.findByProps({ testID: 'birthday-screen' }).props.onLayout({
      nativeEvent: { layout: { height: 640 } },
    });
  });
  expect(renderer.root.findAllByProps({ testID: 'falling-snowflake' })).toHaveLength(
    18,
  );

  await ReactTestRenderer.act(() => {
    renderer.unmount();
  });
  expect(mockedSound.mockPlayer.stop).toHaveBeenCalledTimes(1);
  expect(mockedSound.mockPlayer.release).toHaveBeenCalledTimes(1);
});
