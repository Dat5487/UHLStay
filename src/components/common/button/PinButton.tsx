import {Button} from "antd";
import {PushpinFilled, PushpinOutlined} from "@ant-design/icons";
import {useAppDispatch, useAppSelector} from "../../../store/hooks.ts";
import * as React from "react";
import {selectPinnedItems, togglePin} from "../../../store/slices/userActionSlice.ts";

interface PinButtonProps {
    itemType: 'motels' | 'items' | 'posts';
    itemId: number | string;
}

const PinButton = ({ itemType, itemId }: PinButtonProps) => {
    const dispatch = useAppDispatch();
    const pinnedItems = useAppSelector(selectPinnedItems);

    const isPinned = pinnedItems[itemType]?.includes(itemId as never);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(togglePin({ type: itemType, id: itemId }));
    };

    return (
        <Button
            icon={isPinned ? <PushpinFilled style={{ color: '#1890ff' }} /> : <PushpinOutlined />}
            onClick={handleToggle}
        >
            {isPinned ? 'Bỏ ghim' : 'Ghim tin'}
        </Button>
    );
}
export default PinButton;