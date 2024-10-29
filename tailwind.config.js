/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Para que Tailwind escanee los archivos JSX
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#f5f5f5', // Color de fondo base #ebe5d9
        'bg-base-white': '#fcfcfc', // para diferenciar el fondo de la pagina
        'base-lg': '#f5f5f5',

        // Verde
        'accent-primary': '#d3eabc', // Color de acento principal #bb5c39
        'accent-primary-dark': '#405231', // para el texto del primary

        // Negro
        'accent-secondary': '#010101', // Color de acento secundario #ffddae Canela
        'accent-secondary-dark': '#f6f6f6', // para el texto del secondary #271904

        'accent-muted': '#c4c3bb', // Color de acento suave o neutral
        'accent-warm': '#d4a37f', // Color de acento cálido (ideal para detalles)

        'text-primary': '#010101', // Color principal para texto #3d3929
        'text-contrast': '#141413', // Color de texto de alto contraste

        'input-bg': '#fcfcfc', // Color de fondo para inputs o formularios #f2efe8
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
