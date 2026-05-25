interface BookingType {
  title: string;
  subtitle: string;
  variants: Array<{ name: string; price: number; description: string }>;
}

interface EventSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingTypes: BookingType[];
  selectedType: string;
  selectedVariant: string;
  onSelectType: (title: string) => void;
  onSelectVariant: (variant: string) => void;
}

function EventSelectionModal({ 
  isOpen, 
  onClose, 
  bookingTypes, 
  selectedType, 
  selectedVariant, 
  onSelectType, 
  onSelectVariant 
}: EventSelectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-large" onClick={(e) => e.stopPropagation()} style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.99) 0%, rgba(248, 251, 255, 0.99) 100%)', boxShadow: '0 32px 80px rgba(15, 33, 71, 0.2)' }}>
        <div className="modal-header" style={{ borderBottom: '1px solid rgba(15, 33, 71, 0.08)', paddingBottom: '20px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#0f2147', margin: 0 }}>Select Event Type</h2>
          <button className="modal-close" onClick={onClose} style={{ fontSize: '2rem', color: '#5f7096', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0 8px' }}>×</button>
        </div>

        <div className="modal-body">
          <div className="event-type-grid" style={{ gap: '16px' }}>
            {bookingTypes.map((type) => (
              <button
                key={type.title}
                type="button"
                className={`event-type-card ${selectedType === type.title ? 'selected-card' : ''}`}
                onClick={() => onSelectType(type.title)}
                style={{ padding: '20px', borderRadius: '18px', background: selectedType === type.title ? 'linear-gradient(135deg, #eef2ff 0%, #d7e4ff 100%)' : 'linear-gradient(135deg, #f8fbff 0%, #f1f5fb 100%)', border: selectedType === type.title ? '2px solid #0f2147' : '1px solid rgba(15, 33, 71, 0.12)', boxShadow: selectedType === type.title ? '0 12px 30px rgba(15, 33, 71, 0.15)' : '0 4px 12px rgba(15, 33, 71, 0.06)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                <strong style={{ fontSize: '1.15rem', color: '#0f2147', marginBottom: '8px', display: 'block' }}>{type.title}</strong>
                <p className="body-text" style={{ margin: 0, color: '#5f7096', lineHeight: '1.6' }}>{type.subtitle}</p>
              </button>
            ))}
          </div>

          {selectedType && (
            <div className="variant-selection" style={{ marginTop: '32px' }}>
              <div className="section-heading" style={{ marginBottom: '20px', color: '#0f2147', fontWeight: '700' }}>Select {selectedType} Variant</div>
              <div className="variant-grid" style={{ gap: '20px' }}>
                {bookingTypes.find((t) => t.title === selectedType)?.variants.map((variant) => (
                  <button
                    key={variant.name}
                    type="button"
                    className={`variant-card ${selectedVariant === variant.name.toLowerCase() ? 'selected-card' : ''}`}
                    onClick={() => onSelectVariant(variant.name.toLowerCase())}
                    style={{ padding: '24px', borderRadius: '18px', background: selectedVariant === variant.name.toLowerCase() ? 'linear-gradient(135deg, #eef2ff 0%, #d7e4ff 100%)' : 'linear-gradient(135deg, #f8fbff 0%, #f1f5fb 100%)', border: selectedVariant === variant.name.toLowerCase() ? '2px solid #0f2147' : '1px solid rgba(15, 33, 71, 0.12)', boxShadow: selectedVariant === variant.name.toLowerCase() ? '0 12px 30px rgba(15, 33, 71, 0.15)' : '0 4px 12px rgba(15, 33, 71, 0.06)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  >
                    <strong style={{ fontSize: '1.1rem', marginBottom: '8px', display: 'block', color: '#0f2147' }}>{variant.name}</strong>
                    <p className="body-text" style={{ margin: '0 0 12px', color: '#5f7096', lineHeight: '1.6' }}>{variant.description}</p>
                    <p className="price-tag" style={{ margin: 0, fontWeight: '600', color: '#0f2147', fontSize: '1.15rem' }}>{variant.price === 0 ? 'Free' : `₱${variant.price.toLocaleString()}`}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ borderTop: '1px solid rgba(15, 33, 71, 0.08)', paddingTop: '24px', marginTop: '24px' }}>
          <div className="modal-actions">
            <button className="button button-primary" onClick={onClose} style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventSelectionModal;
