import { cn } from '@/utils';

const buttonSizeClasses = {
  '': '',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg text-sm sm:text-base',
  xl: 'lg:btn-xl btn-md sm:btn-lg',
  '4xl': 'h-[80px] w-[250px] text-[24px] sm:w-[300px] sm:text-[28px] lg:h-[111px] lg:w-[450px] lg:text-[32px]',
};

const buttonColorClasses = {
  primary: 'bg-transparent hover:bg-maroon border-maroon text-maroon hover:text-main-white',
  secondary:
    'bg-transparent hover:bg-main-white border-main-white text-main-white hover:text-shadow-black',
};

const OutlineButton = ({
  startIcon,
  endIcon,
  isLoading,
  children,
  className,
  color,
  size,
  ...props
}: Button.OutlineButtonProps) => {
  return (
    <button
      className={cn(
        'hover:shadow-btn-outline animate-btn-outline btn btn-outline rounded-none font-light transition-all duration-300',
        buttonSizeClasses[size],
        buttonColorClasses[color],
        className
      )}
      {...props}
    >
      {isLoading && <span className="loading loading-spinner loading-sm mr-2" />}
      {startIcon && !isLoading && <span className="mr-2">{startIcon}</span>}
      {children}
      {endIcon && !isLoading && <span className="ml-2">{endIcon}</span>}
    </button>
  );
};

export default OutlineButton;
