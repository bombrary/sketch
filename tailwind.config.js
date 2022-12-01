/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./layouts/**/*.html', './content/**/*.md'],
    theme: {
        extend: {
          colors: {
            body: '#ffffff',
            text: '#000',
            'selected-text': '#aaaaaa',
            theme: '#5c318c',
          },
          aspectRatio: {
            '4/3': '4 / 3',
            '16/9': '16 / 9',
          }
        },
        fontFamily: {
          mplus1c: ["\"M PLUS Rounded 1c\"", "sans-serif"],
        },
    },
    plugins: [
    ],
}
