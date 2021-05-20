import React from 'react';
import styles from './PulseButton.module.css';

/**
 * Properties for {@link PulseButton}
 */
interface IPulseButtonProps {
    onClick?: () => void;
}

/**
 * Creates a pulsating button that animates on click.
 * @param props the properties defined in {@link IPulseButtonProps}
 */
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
