import React from 'react';
import VideoEditorModal from './components/VideoEditorModal';

export default function VideoEditor() {
  const [isOpen, setIsOpen] = React.useState(true);
  const closeModal = () => setIsOpen(false);
  return (
    <div className="video-editor">
      <span>Video</span>
      <VideoEditorModal
        isOpen={isOpen}
        close={closeModal}
      />
    </div>
  );
}
