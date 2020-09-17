type Props = {
  color: string;
};

export default ({ color }: Props) => `
  <path d="M140 56c14.667-.667 40.4-8.8 26-36m-52 34c14.667-.667 40.4-8.8 26-36M78 65c14.667-.667 40.4-8.8 26-36" stroke="${color}" stroke-width="4"/>
`;
