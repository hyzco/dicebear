export default {
  polygon: (color: string) => `
    <path d="M50.3013 12L93.6025 87H7L50.3013 12Z" fill="${color}"/>
  `,
  star: (color: string) => `
    <path d="M49.5528 5L60.7785 39.5491H97.1057L67.7164 60.9017L78.9421 95.4509L49.5528 74.0983L20.1636 95.4509L31.3893 60.9017L2 39.5491H38.3271L49.5528 5Z" fill="${color}"/>
  `,
  ellipse: (color: string) => `
    <circle cx="50" cy="50" r="50" fill="${color}"/>
  `,
};
