/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Para que Tailwind escanee los archivos JSX
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#f0eee5', // Color de fondo base
        'accent-primary': '#bb5c39', // Color de acento principal
        'accent-secondary': '#8888dc', // Color de acento secundario (probablemente usado para acciones o links)
        'accent-muted': '#c4c3bb', // Color de acento suave o neutral
        'accent-warm': '#d4a37f', // Color de acento cálido (ideal para detalles)
        'text-primary': '#3d3929', // Color principal para texto
        'text-contrast': '#141413', // Color de texto de alto contraste
        'input-bg': '#f8f8f7', // Color de fondo para inputs o formularios
      },
    },
  },
  plugins: [],
}
