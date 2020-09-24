type Props = {
  color: string;
};

export default ({ color }: Props) => `
  <circle cx="15.24" cy="20.239" r="12" transform="rotate(-6.276 15.24 20.24)" fill="${color}"/>
  <ellipse cx="16.53" cy="29.402" rx="9" ry="13.5" transform="rotate(-6.776 16.53 29.402)" fill="#000"/>
  <circle cx="79.019" cy="11.611" r="12" transform="rotate(-6.276 79.02 11.61)" fill="${color}"/>
  <ellipse cx="80.531" cy="19.402" rx="9" ry="13.5" transform="rotate(-6.276 80.531 19.402)" fill="#000"/>
`;
