type Props = {
  color: string;
};

export default ({ color }: Props) => `
  <circle cx="123.5" cy="28" r="26" stroke="${color}" stroke-width="4"/>
  <circle cx="56.5" cy="37" r="26" stroke="${color}" stroke-width="4"/>
  <path d="M98.5 35a8 8 0 00-16 0M31 39L1 44.5" stroke="${color}" stroke-width="4"/>
`;
