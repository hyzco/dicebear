type Props = {
  color: string;
};

export default ({ color }: Props) => `
  <circle cx="15.24" cy="21.239" r="12" transform="rotate(-6.276 15.24 21.24)" fill="${color}"/>
  <ellipse cx="16.53" cy="30.402" rx="9" ry="13.5" transform="rotate(-6.776 16.53 30.402)" fill="#000"/>
  <circle cx="79.019" cy="12.611" r="12" transform="rotate(-6.276 79.02 12.61)" fill="${color}"/>
  <ellipse cx="80.531" cy="20.402" rx="9" ry="13.5" transform="rotate(-6.276 80.531 20.402)" fill="#000"/>
`;
