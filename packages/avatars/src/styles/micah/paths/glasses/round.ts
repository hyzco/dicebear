type Props = {
  color: string;
};

export default ({ color }: Props) => `
  <g stroke="${color}" stroke-width="4">
    <circle cx="122.5" cy="28" r="26"/>
    <circle cx="55.5" cy="37" r="26"/>
    <path d="M97.5 35a8 8 0 00-16 0M30 39L0 44.5"/>
  </g>
`;
