import { FC } from "react";
import "./SymbolCell.scss";

type Props = {
  value: string;
  selected: boolean;
  disabled?: boolean;
};

const SymbolCell: FC<Props> = (props: Props) => {
  return (
    <pre
      className={`${
        props.selected ? "symbolCell_selected" : ""
      } ${
        props.disabled ? "italic text-slate-600" : ""
      } align-middle justify-center border-2 w-10 p-1 text-center`}
    >
      {props.value}
    </pre>
  );
};

export default SymbolCell;
