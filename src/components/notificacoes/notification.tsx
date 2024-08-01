import { notification, NotificationArgsProps } from 'antd';
import { useEffect } from 'react';

type NotificationPlacement = NotificationArgsProps['placement'];

export function Notificacao({ message, description }: { message: string, description: string }) {
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        api.error({
            message: message,
            description: description,
            placement: 'bottomRight'
        });
    }, [api, message, description]);

    return <div>{contextHolder}</div>;
}