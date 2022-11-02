import { CSSProperties, FC, ReactElement, useEffect, useState } from "react";
import "./Cell.scss"

type Props<T = any> = {
  children?: (values: T) => ReactElement
  className?: string;
  selected?: boolean;
  disableAnimations?: boolean;
  changeColor?: string;
  selectedColor?: string;
  value: T;
};

const Cell: FC<Props> = (props) => {
  const [animationEnabled, setAnimationEnabled] = useState(!props.disableAnimations);
  const [triggerAnimation, setTriggerAnimation] = useState(true);
  const [selected, setSelected] = useState(!!props.selected);

  useEffect(() => {
    setAnimationEnabled(!props.disableAnimations)
  }, [props.disableAnimations])

  useEffect(() => {
    // Double animation frame to ensure the order of the css appliance
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSelected(!!props.selected)
      })
    })
  }, [props.selected])

  useEffect(() => {
    if(!triggerAnimation) {
      requestAnimationFrame(() => setTriggerAnimation(animationEnabled))
    }
  }, [animationEnabled, triggerAnimation])

  useEffect(() => {
    if (animationEnabled && (props.selected || !selected)) {
      requestAnimationFrame(() => setTriggerAnimation(false));
    }
  }, [props.value, props.selected, animationEnabled])

  if (!props.children) return null;

  return (
    <div
      style={{
        '--cell_change-started-bg': props.changeColor,
        '--cell_change-ended-bg': props.selected ? props.selectedColor : 'white',
      } as CSSProperties}
      className={`cell
        ${selected ? 'cell_selected': ''}
        ${triggerAnimation && animationEnabled ? 'cell_changing' : ''}
        ${props.className}`
      } 
    >
      {props.children(props.value)}
    </div>
  );
};

Cell.defaultProps = {
  selected: false,
  disableAnimations: false,
  changeColor: 'aquamarine',
  selectedColor: 'rgb(203 213 225)', // bg-slate-300
}

export default Cell

/*
props.selected  |  selected  |  means?             | should animate? |
----------------------------------------------------------------------
true            |  true      |  already selected   | yes
true            |  false     |  now selected       | yes
false           |  true      |  now unselected     | no
false           |  false     |  already unselected | yes
*/