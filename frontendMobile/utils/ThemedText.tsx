import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

const styles = StyleSheet.create({
    body2: {
        fontSize: 17,
        lineHeight: 26,
    },
    body3: {
        fontSize: 10,
        lineHeight: 16,
    },
    headline: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 8,
        lineHeight: 12,
    },
    subtitle1: {
        fontSize: 14,
        lineHeight: 16,
        fontWeight: 'bold',
    },
    subtitle2: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: 'bold',
    },
    subtitle3: {
        fontSize: 10,
        lineHeight: 16,
        fontWeight: 'bold',
    },
});

type Variant = keyof typeof styles;

type Props = TextProps & {
    variant?: Variant;
    color?: string;
};

export function ThemedText({ variant, color, ...rest }: Props) {
    const textStyle = [
        styles[variant ?? 'body3'],
        color ? { color } : {}, // Applique la couleur si elle est fournie
    ];

    return <Text style={textStyle} {...rest} />;
}