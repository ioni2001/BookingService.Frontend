import { toast } from 'react-toastify';

export const showToast = (message: string) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 10000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};