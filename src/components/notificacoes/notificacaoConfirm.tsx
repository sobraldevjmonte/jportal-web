import React from 'react';
import type { PopconfirmProps } from 'antd';
import { Button, message, Popconfirm } from 'antd';

interface NotificacaoConfirmProps {
    title: string;
    description: string;
    onConfirm: PopconfirmProps['onConfirm'];
    onCancel: PopconfirmProps['onCancel'];
}

export function NotificacaoConfirm({
    title,
    description,
    onConfirm,
    onCancel,
}: NotificacaoConfirmProps) {
    return (
        <Popconfirm
            title={title}
            description={description}
            onConfirm={onConfirm}
            onCancel={onCancel}
            okText="Yes"
            cancelText="No"
        >
            <Button danger>Delete</Button>
        </Popconfirm>
    );
}
