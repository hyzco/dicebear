type Props = {
  color: string;
};

export default ({ color }: Props) => `
  <circle cx="25" cy="4" r="4" fill="${color}"/>
  <circle cx="26" cy="3" r="1" fill="#fff" fill-opacity=".5"/>
`;
