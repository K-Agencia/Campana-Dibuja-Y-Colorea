import { toast } from 'react-hot-toast';

const Toast = ({ title, message, type = 'success', duration = 7000 }) => {
   const toastProps = {
      title,
      message,
      duration,
      position: 'top-center',
      style: {
         background: type === 'error' ? '#f44336' : '#4caf50',
         color: '#fff',
      },
   };

   toast[type](toastProps);

   return null;
}

export default Toast;