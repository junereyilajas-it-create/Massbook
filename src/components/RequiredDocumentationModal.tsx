interface RequiredDocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventType: string;
  documents: Array<{ name: string; description: string }>;
}

function RequiredDocumentationModal({ isOpen, onClose, eventType, documents }: RequiredDocumentationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Required Documentation ({eventType} Mass)</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="document-row">
            <div>
              <strong>{eventType}</strong>
              <span className="body-text">Requirements shown for the selected event.</span>
            </div>
            <span className="status-pill pending">In Preparation</span>
          </div>

          {documents.map((doc, idx) => (
            <div key={idx} className="document-row upload-row">
              <div>
                <strong>{doc.name}</strong>
                <span className="body-text">{doc.description}</span>
              </div>
              <button className="button button-secondary" type="button">Upload</button>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <div className="modal-actions">
            <button className="button button-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequiredDocumentationModal;
