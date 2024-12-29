/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Para que Tailwind escanee los archivos JSX
  ],
  theme: {
    extend: {
      colors: {
        'bg-base-white': '#f5f5f5', // actual fondo gris que será blanco
        'bg-base': '#fcfcfc', // actual blanco claro que será fondo gris
        'base-lg': '#f5f5f5',

        // Verde
        'accent-primary': '#d3eabc', // Color de acento principal #bb5c39
        'accent-primary-dark': '#405231', // para el texto del primary

        // Negro
        'accent-secondary': '#010101', // Color de acento secundario #010101 Canela
        'accent-secondary-dark': '#f6f6f6', // para el texto del secondary #f6f6f6

        'accent-muted': '#c4c3bb', // Color de acento suave o neutral
        'accent-warm': '#d4a37f', // Color de acento cálido (ideal para detalles)

        'text-primary': '#010101', // Color principal para texto #3d3929
        'text-contrast': '#141413', // Color de texto de alto contraste

        'input-bg': '#f5f5f5', // Color de fondo para inputs o formularios #f2efe8
        'input-bg-warm': '#ffddae',

        'button-bg': '#010101', // Color de fondo para botones
        'button-bg-dark': '#fcfcfc', // Color de texto para botones

        'olva-bg': '#f9b52f',
        'shalom-bg': '#ea1c23',
      },
    },
  },
  plugins: [],
}
