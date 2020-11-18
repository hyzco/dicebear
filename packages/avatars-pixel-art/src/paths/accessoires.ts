export const accessories = {
  accessories01: (color: string) => `
    <path fill="${color}" d="M4 11H2v2h2v-2zM18 11h-2v2h2v-2z"/>
  `,
  accessories02: (color: string) => `
    <path fill="${color}" fill-rule="evenodd" d="M3 10v2h1v-2H3zm13 0h1v2h-1v-2z" clip-rule="evenodd"/>
    <path fill="#fff" fill-opacity=".4" fill-rule="evenodd" d="M3 10v1h1v-1H3zm13 0h1v1h-1v-1z" clip-rule="evenodd"/>
  `,
  accessories03: (color: string) => `
    <path fill="${color}" fill-rule="evenodd" d="M3 10v2h1v-2H3zm13 0h1v2h-1v-2z" clip-rule="evenodd"/>
  `,
  accessories04: (color: string) => `
    <path fill="${color}" fill-rule="evenodd" d="M3 10v1h1v-1H3zm13 0v1h1v-1h-1z" clip-rule="evenodd"/>
  `,
};
