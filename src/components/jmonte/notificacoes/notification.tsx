import { notification, NotificationArgsProps } from 'antd';
import { useEffect } from 'react';

export function Notificacao({ message, description }: { message: string, description: string }) {
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        api.error({
            message: message,
            description: description,
            placement: 'bottom'
        });
    }, [api, message, description]);

    return <div>{contextHolder}</div>;
}