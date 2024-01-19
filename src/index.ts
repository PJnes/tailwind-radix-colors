import plugin from "tailwindcss/plugin";
import * as radix from "@radix-ui/colors";
import { CSSRuleObject } from "tailwindcss/types/config";

const allColors = [
  "amber",
  "blue",
  "bronze",
  "brown",
  "crimson",
  "cyan",
  "gold",
  "grass",
  "gray",
  "green",
  "indigo",
  "lime",
  "mauve",
  "mint",
  "olive",
  "orange",
  "pink",
  "plum",
  "purple",
  "red",
  "sage",
  "sand",
  "sky",
  "slate",
  "teal",
  "tomato",
  "violet",
  "yellow",
] as const;

type Color = (typeof allColors)[number];

type Scale = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type Options = {
  classPrefix?: string;
  colors?: Color[] | Record<string, Color>;
  darkModeSelector?: string;
  respectMediaQuery?: boolean;
  variablePrefix?: string;
};

const parseColors = (
  radixScale: Record<string, string>
): Partial<Record<Scale, string>> => {
  return Object.entries(radixScale)
    .map(([key, value]) => {
      const shade: Scale = parseInt(key.replace(/[^0-9\.]+/g, "")) as Scale;
      return {
        shade,
        value,
      };
    })
    .reduce((acc, { shade, value }) => ({ ...acc, [shade]: value }), {});
};

const variableName = (name: string, shade: Scale, prefix?: string) => {
  return `--${prefix ? `${prefix}-` : ""}${name}-${shade}`;
};

const colorsIsObject = (
  colors: Color[] | Record<string, Color>
): colors is Record<string, Color> => {
  return !Array.isArray(colors);
};

const convertColorsToObject = (colors: Color[] | Record<string, Color>) => {
  return colorsIsObject(colors)
    ? colors
    : colors.reduce(
        (acc, color) => {
          acc[color] = color;
          return acc;
        },
        {} as Record<string, Color>
      );
};

export = plugin.withOptions(
  ({
    colors = [...allColors],
    darkModeSelector,
    respectMediaQuery = true,
    variablePrefix,
  }: Options) => {
    return ({ addBase }) => {
      const lightStyles: Record<string, string> = {};
      const darkStyles: Record<string, string> = {};

      Object.entries(convertColorsToObject(colors)).forEach(([name, color]) => {
        const lightColor = parseColors(radix[color]);
        const darkColor = parseColors(radix[`${color}Dark`]);

        Object.keys(lightColor).forEach((key) => {
          // TODO: Figure out a better way to type this...
          const scale = parseInt(key) as any as Scale;
          lightStyles[variableName(name, scale, variablePrefix)] =
            lightColor[scale]!;
          darkStyles[variableName(name, scale, variablePrefix)] =
            darkColor[scale]!;
        });
      });

      const styles: CSSRuleObject[] = [
        {
          ":root": lightStyles,
        },
      ];

      if (respectMediaQuery) {
        styles.push({
          "@media (prefers-color-scheme: dark)": {
            ":root": darkStyles,
          },
        });
      }

      if (darkModeSelector) {
        styles.push({
          [darkModeSelector]: {
            ...darkStyles,
          },
        });
      }

      addBase(styles);
    };
  },
  function ({ classPrefix, colors = [...allColors], variablePrefix }: Options) {
    return {
      theme: {
        extend: {
          colors: () => {
            const colorStyles = {} as Record<string, Record<Scale, string>>;
            Object.entries(convertColorsToObject(colors)).forEach(
              ([name, color]) => {
                colorStyles[name] = {} as Record<Scale, string>;
                const defaultScales = parseColors(radix[color]);
                Object.keys(defaultScales).forEach((key) => {
                  // TODO: Figure out a better way to type this...
                  const scale = parseInt(key) as any as Scale;
                  colorStyles[name][scale] =
                    `var(${variableName(name, scale, variablePrefix)}, ${defaultScales[scale]})`;
                });
              }
            );
            return classPrefix ? { [classPrefix]: colorStyles } : colorStyles;
          },
        },
      },
    };
  }
);
