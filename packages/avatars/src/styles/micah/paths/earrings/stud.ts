type Props = {
  color: string;
};

export default ({ color }: Props) => `
  <circle cx="25" cy="2" r="4" fill="${color}"/>
  <circle opacity=".25" cx="26" cy="1" r="1" fill="#fff"/>
`;
