import { ulid } from 'ulidx';
import { toast } from 'svelte-sonner';

interface IShowMessageSonnerProps {
   message: string;
}

export function showMessageSonner({ message }: IShowMessageSonnerProps) {
   toast.error('Error', {
      id: ulid(),
      description: message,
      class: 'bg-reg-500',
   });
}
