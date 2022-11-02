import { FC, useEffect, useState } from "react";
import "./OutputCell.scss";

type Props = {
  value: string;
};

const OutputCell: FC<Props> = (props: Props) => {
  const [isChanging, setIsChanging] = useState(true);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsChanging(false);
    });
  }, [props.value]);

  useEffect(() => {
    if (!isChanging) {
      requestAnimationFrame(() => setIsChanging(true));
    }
  }, [isChanging]);

  return (
    <pre
      className={`${
        isChanging ? "outputCell_changing" : ""
      } ${
        !props.value ? "italic text-slate-400" : ""
      }
      border-2 w-full p-1 h-8 bg-white`}
    >
      {props.value || "No output yet"}
    </pre>
  );
};

export default OutputCell;
