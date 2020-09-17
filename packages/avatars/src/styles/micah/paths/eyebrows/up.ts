type Props = {
  color: string;
};

export default ({ color }: Props) => `
  <path d="M99 10.214c5.667-2.666 19-5.1 27 6.5M23.58 35.521c2.07-5.91 9.681-17.125 23.562-14.699" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
`;
