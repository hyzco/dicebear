type Props = {
  color: string;
};

export default ({ color }: Props) => `
  <path d="M27 26.5c6.167 2.5 21.1 3 31.5-15M94 4c5.167 5.333 18.1 12.8 28.5 0" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
`;
