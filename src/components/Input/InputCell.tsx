import { FC, useEffect, useState } from "react";
import "./InputCell.scss";

type Props = {
  value: string;
  original: string;
};

const InputCell: FC<Props> = (props: Props) => {
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
    <div
      className={`${
        isChanging ? "inputCell_changing" : ""
      } ${
        !props.original.length ? "italic text-slate-400" : ""
      }
      border-2 w-full p-1 h-8 bg-white`}
    >
      <pre className="text-slate-400 inline">
        {props.original.substring(0, props.original.length - props.value.length)}
      </pre>
      <pre className="inline">
        {props.original.length ? props.value : "No input provided"}
      </pre>
    </div>
  );
};

export default InputCell;
