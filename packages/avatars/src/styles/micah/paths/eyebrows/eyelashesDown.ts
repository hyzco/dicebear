type Props = {
  color: string;
};

export default ({ color }: Props) => `
  <path d="M27 26.5c6.167 2.5 21.1 3 31.5-15M94 4c5.167 5.333 18.1 12.8 28.5 0M37.148 26.458L31 21.03m85.219-11.586l1.785-8.005M45.597 22.814l-4.046-7.132m66.591-6.664L109.08.87M52.674 17.2l-2.201-7.9m49.52-1.269l-.776-8.164" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
`;
