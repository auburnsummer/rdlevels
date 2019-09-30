module.exports = {
  theme: {
    extend: {
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      lineHeight: {
        cramped: 0.9
      },
      spacing: {
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '2/4': '50%',
        '3/4': '75%',
        '1/5': '20%',
        '2/5': '40%',
        '3/5': '60%',
        '4/5': '80%',
        '1/6': '16.666667%',
        '2/6': '33.333333%',
        '3/6': '50%',
        '4/6': '66.666667%',
        '5/6': '83.333333%',
        '1/12': '8.333333%',
        '2/12': '16.666667%',
        '3/12': '25%',
        '4/12': '33.333333%',
        '5/12': '41.666667%',
        '6/12': '50%',
        '7/12': '58.333333%',
        '8/12': '66.666667%',
        '9/12': '75%',
        '10/12': '83.333333%',
        '11/12': '91.666667%',
        '9/16' : '56.25%'
      },
      gap: { // defaults to {}
        '0': '0',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
      },
      minWidth: {
        '0': '0',
        '64': '16rem',
        '72': '18rem',
        '80': '20rem',
        '84': '21rem',
        'full': '100%',
      },
      transitionProperty: { // defaults to these values
        'none': 'none',
        'all': 'all',
        'color': 'color',
        'bg': 'background-color',
        'border': 'border-color',
        'colors': ['color', 'background-color', 'border-color'],
        'opacity': 'opacity',
        'transform': 'transform',
        'filter': 'filter',
        'shadow': 'box-shadow'
      },
    },
    fontFamily: {
      'sans': ['Nunito', 'sans-serif']
    }
  },
  variants: {
    visibility: ['responsive', 'group-hover'],
    defocus: ['group-hover'],
    cursor: ['responsive', 'hover', 'focus'],
    opacity: ['responsive', 'group-hover'],
  },
  plugins: [
    require('@tailwindcss/custom-forms'),
    require('tailwindcss-gap')({
      legacy: false, // defaults to false, set to true to output IE-compatible CSS (no custom properties, but much larger CSS for the same functionality)
    }),
    function({ addUtilities, variants}) {
      // defocus plugin
      const newUtilities = {
        '.defocus' : {
          filter: "brightness(50%) saturate(120%) blur(2px)"
        }
      };
      addUtilities(newUtilities, variants('defocus'));
    },
    require('tailwindcss-transitions')()
  ]
}
