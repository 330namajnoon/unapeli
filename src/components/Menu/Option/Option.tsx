import * as Styles from "./styles";

export interface OptionProps {
  children: string;
  onClick?: () => void;
}

const Option = ({ children, onClick }: OptionProps) => {
  return <Styles.Container onClick={onClick} className="material-symbols-outlined">{children}</Styles.Container>;
};

export default Option;
