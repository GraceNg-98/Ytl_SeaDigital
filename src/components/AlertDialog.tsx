import * as React from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, PaperProvider, Text } from 'react-native-paper';

interface IAlert {
    visible: boolean,
    title?: string,
    desc?: string,
    buttonTitle: string,
    buttonAction: () => void,
    secondButtonTitle?: string,
    secondButtonAction?: () => void
}

const AlertDialog: React.FC<IAlert> = ({
    visible,
    title,
    desc,
    buttonTitle,
    buttonAction,
    secondButtonTitle,
    secondButtonAction
}) => {
    const [isVisible, setVisible] = React.useState(visible);
    
    const hideDialog = () => setVisible(false);
    
    return (
        <Portal>
            <Dialog visible={isVisible} onDismiss={hideDialog}>
                {title && <Dialog.Title>{title}</Dialog.Title>}
                <Dialog.Content>
                    {desc && <Text variant="bodyMedium">{desc}</Text>}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={buttonAction}>{buttonTitle}</Button>
                </Dialog.Actions>
                {
                    secondButtonTitle &&
                    <Dialog.Actions>
                        <Button onPress={secondButtonAction}>{secondButtonTitle}</Button>
                    </Dialog.Actions>
                }
            </Dialog>
        </Portal>
    );
};

export default AlertDialog;