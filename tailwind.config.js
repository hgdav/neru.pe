/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Para que Tailwind escanee los archivos JSX
  ],
  theme: {
    extend: {
      colors: {
        'bg-base-white': '#fff', // anterior #e9edf6, ahora antrophic
        'bg-base': '#f0eee6', // anterior #fcfcfc, ahora antrophic

        // Negro
        'accent-secondary': '#010101', // Color de acento secundario #010101 Canela
        'accent-secondary-dark': '#fff', // para el texto del secondary #f6f6f6

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

        'pizarra': '#e1c7a5',
        'importante': '#3f69bf',
      },
    },
  },
  plugins: [],
}
