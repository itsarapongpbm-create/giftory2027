declare namespace Contact {
  type ContactCardProps = {
    id: string;
    icon: React.ReactNode;
    title: string;
    detail: string;
    className: ClassValue;
    type?: 'email' | 'phone' | 'location' | 'line' | 'instagram' | 'other';
    value?: string;
    onClick?: () => void;
  };
}
