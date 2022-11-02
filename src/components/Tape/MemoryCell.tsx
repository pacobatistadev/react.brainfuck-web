import { FC, useEffect, useState } from "react";
import "./MemoryCell.scss";

type Props = {
  value: number;
  selected: boolean;
  disabled?: boolean;
};

const MemoryCell: FC<Props> = (props: Props) => {
  const [isChanging, setIsChanging] = useState(true);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsChanging(false)
    })
  }, [props.value]);

  useEffect(() => {
    if (!isChanging && props.selected) {
      requestAnimationFrame(() => setIsChanging(true))
    }
  }, [isChanging])

  return (
    <pre
      className={`${
        isChanging && props.selected ? "memoryCell_changing" : ""
      } align-middle justify-center border-2 ${
        props.selected ? "bg-slate-400" : ""
      } w-12 p-1 text-center ${
        props.disabled && "text-slate-400"
      }
      `}
    >
      {props.value}
    </pre>
  );
};

export default MemoryCell;
