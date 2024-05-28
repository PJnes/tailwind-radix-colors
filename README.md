## Tailwind Radix Colors

This is a [Tailwind CSS](https://tailwindcss.com) plugin that generates a set of CSS custom properties and tailwind classes for colours on the [Radix Colour Palette](https://www.radix-ui.com/colors).

## Installation

```bash
npm install --save-dev @squirgle/tailwind-radix-colors
```

## Usage

Add the plugin to your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require('@squirgle/tailwind-radix-colors'),
  ],
}
```

This will produce:

```css
:root {
  --amber-1: #fefdfb;
  /* ...and the rest */
}

@media (prefers-color-scheme: dark) {
  :root {
    --amber-1: #16120c;
    /* ...and the rest */
  }
}

.bg-amber-1 {
  background-color: var(--amber-1, #fefdfb);
}
```


### Limiting the colours

By default the plugin will include **ALL** of the colours from the Radix Colour Palette. If you only want to include a subset of the colours, you can specify them in the plugin options:

```js
// tailwind.config.js
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require('@squirgle/tailwind-radix-colors')({
      colors: ['red', 'blue', 'green'],
    }),
  ],
}
```

### Renaming the colours

If you prefer, you can also specify the colours as an object with the colour name as the key and the colour value as the value:

```js
// tailwind.config.js
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require('@squirgle/tailwind-radix-colors')({
      colors: {
        base: 'slate',
        accent: 'iris',
      },
    }),
  ],
}
```

### Providing a dark mode selector

By default the plugin will switch between the light and dark scales based on the `prefers-color-scheme` media query.

If you want to provide a dark mode selector, to switch between the light and dark scalesyou can specify it in the plugin options:

```js
// tailwind.config.js
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require('@squirgle/tailwind-radix-colors')({
      darkModeSelector: '.dark' // any valid CSS selector should work,
      // darkModeSelector: '[data-theme="dark"]',
      respectMediaQuery: false // If you don't want to respect the media query
    }),
  ],
}
```

This will produce:

```css
:root {
  --amber-1: #fefdfb;
  /* ...and the rest */
}

@media (prefers-color-scheme: dark) {
  :root {
    --amber-1: #16120c;
    /* ...and the rest */
  }
}

.dark {
  --amber-1: #16120c;
  /* ...and the rest */
}
```

### Providing a light, dark and system selector

For maximum flexibility you can provide selectors for light mode, dark mode, and the system mode. This will allow you to switch between the light and dark scales based on the provided selectors, or let the user choose to use their system preference.

```js
// tailwind.config.js
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require('@squirgle/tailwind-radix-colors')({
      darkModeSelector: '[data-theme="dark"]',
      lightModeSelector: '[data-theme="light"]',
      systemModeSelector: '[data-theme="system"]',
    }),
  ],
}
```

Note that providing a system mode selector will override the `respectMediaQuery` option. This will produce:

```css
:root {
  --amber-1: #fefdfb;
  /* ...and the rest */
}

@media (prefers-color-scheme: dark) {
  [data-mode="auto"] {
    --amber-1: #16120c;
    /* ...and the rest */
  }
}

[data-mode="light"] {
  --amber-1: #fefdfb;
  /* ...and the rest */
}

[data-mode="dark"] {
  --amber-1: #16120c;
  /* ...and the rest */
}
```

### Providing a prefix

If you are worried about the custom properties clashing with other custom properties or class names in your project, you can specify a prefix seprately for both the class names and css variables in the plugin options. They don't need to match:

```js
// tailwind.config.js
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require('@squirgle/tailwind-radix-colors')({
      classPrefix: 'rdx' // This will be prefixed to the tailwind classes.
      variablePrefix: 'radix' // This will be prefixed to the CSS custom properties.
    }),
  ],
}
```

This will produce:

```css
:root {
  --radix-amber-1: #fefdfb;
  /* ...and the rest */
}

@media (prefers-color-scheme: dark) {
  :root {
    --radix-amber-1: #16120c;
    /* ...and the rest */
  }
}

.bg-rdx-amber-1 {
  background-color: var(--radix-amber-1, #fefdfb);
}
```

## Configuration Options

```ts
type Options = {
  classPrefix?: string; // Defaults to no prefix.
  colors?: Color[] | Record<string, Color>; // Defaults to all radix colours.
  darkModeSelector?: string; // Defaults to no dark mode selector.
  respectMediaQuery?: boolean; // Defaults to true.
  variablePrefix?: string; // Defaults to no prefix.
};
```
