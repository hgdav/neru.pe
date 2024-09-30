/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Para que Tailwind escanee los archivos JSX
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#ebe5d9', // Color de fondo base #f0eee5
        'bg-base-white': '#fcfcfc', // para diferenciar el fondo de la pagina

        // Verde
        'accent-primary': '#d3eabc', // Color de acento principal #bb5c39
        'accent-primary-dark': '#405231', // para el texto del primary

        // Canela
        'accent-secondary': '#ffddae', // Color de acento secundario #8888dc
        'accent-secondary-dark': '#271904', // para el texto del secondary

        'accent-muted': '#c4c3bb', // Color de acento suave o neutral
        'accent-warm': '#d4a37f', // Color de acento cálido (ideal para detalles)

        'text-primary': '#3d3929', // Color principal para texto
        'text-contrast': '#141413', // Color de texto de alto contraste

        'input-bg': '#f2efe8', // Color de fondo para inputs o formularios #f8f8f7
        'input-bg-warm': '#ffddae',

        'button-bg': '#f9efe6', // Color de fondo para botones
        'button-bg-dark': '#5c5247', // Color de texto para botones

        'olva-bg': '#f9b52f',
        'shalom-bg': '#ea1c23',
      },
    },
  },
  plugins: [],
}
