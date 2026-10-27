import { AppButton, Dialog } from '@/components';

type Props = {
  visible: boolean;
  dateChanged: boolean;
  saving: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onKeepEditing: () => void;
};

// Asked when leaving the Settings tab with unsaved edits.
export function LeaveDialog({ visible, dateChanged, saving, onSave, onDiscard, onKeepEditing }: Props) {
  return (
    <Dialog
      visible={visible}
      onClose={onKeepEditing}
      title="Leave without saving?"
      message={dateChanged
        ? 'You changed the wedding date. Save it so the countdown stays right.'
        : 'You have changes that are not saved yet.'}
    >
      <AppButton label="Save & leave" loading={saving} onPress={onSave} />
      <AppButton label="Discard changes" variant="danger" onPress={onDiscard} />
      <AppButton label="Keep editing" variant="ghost" onPress={onKeepEditing} />
    </Dialog>
  );
}
