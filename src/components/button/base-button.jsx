import styles from './button.module.css';

const BaseButton = ({
  text,
  onClick,
  type = 'button',
  backgroundColor = 'var(--main-green)',
  hoverColor = 'var(--light-green)',
  className,
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={`${styles.baseButton} ${className || ''}`}
      type={type}
      onClick={onClick}
      style={{
        backgroundColor: disabled ? 'var(--disabled-gray)' : backgroundColor,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...props,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.target.style.backgroundColor = hoverColor;
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.target.style.backgroundColor = backgroundColor;
      }}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default BaseButton;