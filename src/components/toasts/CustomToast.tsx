import { Toaster } from 'react-hot-toast';

const CustomToast = () => {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      containerStyle={{
        top: 24,
        right: 24,
      }}
      toastOptions={{
        duration: 3500,
        className: 'font-light text-xs sm:text-sm tracking-wide',
        style: {
          background: '#FFFFFF',
          color: '#100C08',
          border: '1px solid rgba(16, 12, 8, 0.15)',
          borderRadius: '0px',
          boxShadow: '0 4px 20px -4px rgba(16, 12, 8, 0.12)',
          padding: '12px 18px',
          fontSize: '13px',
          fontWeight: '300',
          maxWidth: '380px',
        },
        success: {
          duration: 3500,
          style: {
            background: '#FFFFFF',
            color: '#100C08',
            border: '1px solid #7D0A0A',
            borderLeft: '4px solid #7D0A0A',
            borderRadius: '0px',
            boxShadow: '0 4px 20px -4px rgba(125, 10, 10, 0.15)',
            padding: '12px 18px',
            fontSize: '13px',
            fontWeight: '300',
            maxWidth: '380px',
          },
          iconTheme: {
            primary: '#7D0A0A',
            secondary: '#FFFFFF',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: '#FFFFFF',
            color: '#BF3131',
            border: '1px solid #BF3131',
            borderLeft: '4px solid #BF3131',
            borderRadius: '0px',
            boxShadow: '0 4px 20px -4px rgba(191, 49, 49, 0.15)',
            padding: '12px 18px',
            fontSize: '13px',
            fontWeight: '300',
            maxWidth: '380px',
          },
          iconTheme: {
            primary: '#BF3131',
            secondary: '#FFFFFF',
          },
        },
      }}
    />
  );
};

export default CustomToast;
