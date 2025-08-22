import React, { useState } from 'react';
import { Tag } from '@/types/luogo';

interface CreateTagFormProps {
  onSave: (tag: Tag) => void;
  onCancel: () => void;
}

const CreateTagForm: React.FC<CreateTagFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Tag>>({
    name: '',
    category: 'thematic',
    color: '#000000',
    backgroundColor: '#ffffff',
    officialLogo: '',
    logoAlt: '',
    website: '',
    prestige: undefined
  });

  const categories: Array<Tag['category']> = [
    'geographic',
    'certification',
    'thematic', 
    'experience',
    'accessibility'
  ];

  const predefinedColors = [
    { color: '#000000', bg: '#ffffff', label: 'Nero/Bianco' },
    { color: '#FF4500', bg: '#FFF8DC', label: 'Arancione' },
    { color: '#D2691E', bg: '#FAF0E6', label: 'Marrone chiaro' },
    { color: '#228B22', bg: '#F0FFF0', label: 'Verde' },
    { color: '#1E90FF', bg: '#F0F8FF', label: 'Blu' },
    { color: '#DC143C', bg: '#FFF0F5', label: 'Rosso' },
    { color: '#8A2BE2', bg: '#F8F0FF', label: 'Viola' },
    { color: '#DAA520', bg: '#FFFACD', label: 'Oro' }
  ];

  const handleInputChange = (field: keyof Tag, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleColorSelect = (color: string, backgroundColor: string) => {
    setFormData(prev => ({ ...prev, color, backgroundColor }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category) {
      alert('Compila tutti i campi obbligatori');
      return;
    }

    const tag: Tag = {
      id: formData.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name: formData.name,
      category: formData.category,
      color: formData.color || '#000000',
      backgroundColor: formData.backgroundColor || '#ffffff',
      officialLogo: formData.officialLogo,
      logoAlt: formData.logoAlt,
      website: formData.website,
      prestige: formData.prestige
    };

    onSave(tag);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Crea Nuovo Tag</h2>
          
          <div className="space-y-6">
            {/* Campi base obbligatori */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome Tag *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="es. Via Francigena, Bandiera Arancione"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Categoria *</label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Seleziona categoria</option>
                  <option value="geographic">Geographic (geografico)</option>
                  <option value="certification">Certification (certificazione)</option>
                  <option value="thematic">Thematic (tematico)</option>
                  <option value="experience">Experience (esperienza)</option>
                  <option value="accessibility">Accessibility (accessibilità)</option>
                </select>
              </div>
            </div>

            {/* Colori */}
            <div>
              <label className="block text-sm font-medium mb-2">Colori</label>
              
              {/* Colori predefiniti */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Seleziona combinazione predefinita:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {predefinedColors.map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleColorSelect(preset.color, preset.bg)}
                      className="flex items-center gap-2 p-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      <div 
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: preset.bg, color: preset.color, border: `2px solid ${preset.color}` }}
                      />
                      <span className="text-xs">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Colori personalizzati */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Colore Testo</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.color || '#000000'}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={formData.color || '#000000'}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      className="flex-1 border border-gray-300 rounded px-3 py-2"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Colore Sfondo</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.backgroundColor || '#ffffff'}
                      onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={formData.backgroundColor || '#ffffff'}
                      onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                      className="flex-1 border border-gray-300 rounded px-3 py-2"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>

              {/* Anteprima */}
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Anteprima:</p>
                <div 
                  className="inline-block px-3 py-1 rounded-full text-sm font-medium border"
                  style={{ 
                    color: formData.color || '#000000', 
                    backgroundColor: formData.backgroundColor || '#ffffff',
                    borderColor: formData.color || '#000000'
                  }}
                >
                  {formData.name || 'Nome Tag'}
                </div>
              </div>
            </div>

            {/* Campi opzionali */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Logo Ufficiale (URL)</label>
                <input
                  type="url"
                  value={formData.officialLogo || ''}
                  onChange={(e) => handleInputChange('officialLogo', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="/images/logo.png"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Alt Text Logo</label>
                <input
                  type="text"
                  value={formData.logoAlt || ''}
                  onChange={(e) => handleInputChange('logoAlt', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Descrizione logo"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sito Web</label>
                <input
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Prestigio (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.prestige || ''}
                  onChange={(e) => handleInputChange('prestige', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="1-5"
                />
              </div>
            </div>

            {/* Informazioni categorie */}
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium mb-2">Guida alle Categorie:</h4>
              <ul className="text-sm space-y-1">
                <li><strong>Geographic:</strong> Percorsi, cammini, zone geografiche</li>
                <li><strong>Certification:</strong> Certificazioni ufficiali, riconoscimenti</li>
                <li><strong>Thematic:</strong> Temi specifici, argomenti</li>
                <li><strong>Experience:</strong> Tipo di esperienza vissuta</li>
                <li><strong>Accessibility:</strong> Accessibilità e servizi</li>
              </ul>
            </div>

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Salva Tag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTagForm;