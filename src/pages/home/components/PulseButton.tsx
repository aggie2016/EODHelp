import React from "react";
import styles from "./PulseButton.module.css";

interface IPulseButtonProps {
  onClick?: () => void;
}

export const PulseButton: React.FC<IPulseButtonProps> = (props) => {
  return (
    <div
      className={`${styles.container} ${styles.noselect}`}
      onTouchEnd={props.onClick}
      onMouseUp={props.onClick}
    >
      <div className={styles.pulseButton}>
        <div>
          <p>Find A Friend</p>
        </div>
      </div>
    </div>
  );
};
