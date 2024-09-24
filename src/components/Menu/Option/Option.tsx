import * as Styles from "./styles";

export interface OptionProps {
  children: string;
  styles?: React.CSSProperties;
  onClick?: () => void;
}

const Option = ({ children, onClick, styles }: OptionProps) => {
  return <Styles.Container onClick={onClick} style={styles} className="material-symbols-outlined">{children}</Styles.Container>;
};

export default Option;
