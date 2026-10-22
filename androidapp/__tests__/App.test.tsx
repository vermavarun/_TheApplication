/**
 * @format
 */

import React from 'react';
import { Animated } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import VinnyBday from '../components/vinnybday';

jest.mock('react-native', () => {
  const createAnimation = () => ({ start: jest.fn(), stop: jest.fn() });

  return {
    View: 'View',
    Text: 'Text',
    Image: 'Image',
    StyleSheet: {
      create: (styles: object) => styles,
      absoluteFillObject: { position: 'absolute' },
    },
    Easing: {
      inOut: (easing: unknown) => easing,
      out: (easing: unknown) => easing,
      sin: jest.fn(),
      cubic: jest.fn(),
    },
    Animated: {
      View: 'AnimatedView',
      Value: jest.fn(() => ({ interpolate: () => 1 })),
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
      expect.objectContaining({ duration, useNativeDriver: false }),
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
  expect(renderer.root.findAllByProps({ testID: 'floating-heart' })).toHaveLength(
    3,
  );
  expect(renderer.root.findByProps({ testID: 'birthday-footer' })).toBeTruthy();

  await ReactTestRenderer.act(() => {
    renderer.unmount();
  });
});
