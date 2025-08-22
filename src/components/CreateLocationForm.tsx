import React, { useState } from 'react';
import { Location, EatenFoodItem, MountainFeature } from '@/types/luogo';

interface CreateLocationFormProps {
  onSave: (location: Location) => void;
  onCancel: () => void;
}

const CreateLocationForm: React.FC<CreateLocationFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Location>>({
    name: '',
    description: '',
    category: '',
    coordinates: [0, 0],
    visitDate: '',
    country: 'Italia',
    region: '',
    province: '',
    municipality: '',
    address: '',
    rating: undefined,
    notes: '',
    website: '',
    ticketPrice: undefined,
    duration: '',
    epoca: '',
    stato: undefined,
    cucina: '',
    prezzo: undefined,
    altitude: undefined,
    eatenFoods: [],
    mountainFeatures: [],
    tags: []
  });

  const categories = [
    'aeroporti', 'bivacchi', 'castelli', 'chiese', 'eventi', 
    'laghi', 'monti', 'musei', 'rifugi', 'ristoranti'
  ];

  const regions = [
    'Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna',
    'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardia', 'Marche',
    'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia', 'Toscana',
    'Trentino-Alto Adige', 'Umbria', 'Valle d\'Aosta', 'Veneto'
  ];

  const [newFood, setNewFood] = useState({ name: '', subItems: [] });
  const [newFeature, setNewFeature] = useState({ name: '', altitude: undefined });

  const handleInputChange = (field: keyof Location, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCoordinateChange = (index: 0 | 1, value: string) => {
    const coords = [...(formData.coordinates || [0, 0])];
    coords[index] = parseFloat(value) || 0;
    handleInputChange('coordinates', coords);
  };

  const addEatenFood = () => {
    if (newFood.name.trim()) {
      const foods = [...(formData.eatenFoods || [])];
      foods.push({ name: newFood.name, subItems: [] });
      handleInputChange('eatenFoods', foods);
      setNewFood({ name: '', subItems: [] });
    }
  };

  const removeEatenFood = (index: number) => {
    const foods = [...(formData.eatenFoods || [])];
    foods.splice(index, 1);
    handleInputChange('eatenFoods', foods);
  };

  const addMountainFeature = () => {
    if (newFeature.name.trim()) {
      const features = [...(formData.mountainFeatures || [])];
      features.push({ 
        name: newFeature.name, 
        altitude: newFeature.altitude || undefined,
        subFeatures: [] 
      });
      handleInputChange('mountainFeatures', features);
      setNewFeature({ name: '', altitude: undefined });
    }
  };

  const removeMountainFeature = (index: number) => {
    const features = [...(formData.mountainFeatures || [])];
    features.splice(index, 1);
    handleInputChange('mountainFeatures', features);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.visitDate || !formData.region || !formData.province) {
      alert('Compila tutti i campi obbligatori');
      return;
    }

    const location: Location = {
      id: formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: formData.name,
      description: formData.description || '',
      category: formData.category,
      coordinates: formData.coordinates || [0, 0],
      visitDate: formData.visitDate,
      country: formData.country || 'Italia',
      region: formData.region,
      province: formData.province,
      municipality: formData.municipality,
      address: formData.address,
      rating: formData.rating,
      notes: formData.notes,
      website: formData.website,
      ticketPrice: formData.ticketPrice,
      duration: formData.duration,
      epoca: formData.epoca,
      stato: formData.stato,
      cucina: formData.cucina,
      prezzo: formData.prezzo,
      altitude: formData.altitude,
      eatenFoods: formData.eatenFoods,
      mountainFeatures: formData.mountainFeatures,
      tags: formData.tags || []
    };

    onSave(location);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Crea Nuovo Luogo</h2>
          
          <div className="space-y-6">
            {/* Campi base obbligatori */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
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
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descrizione</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 h-24"
              />
            </div>

            {/* Campi geografici */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Regione *</label>
                <select
                  value={formData.region || ''}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Seleziona regione</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Provincia *</label>
                <input
                  type="text"
                  value={formData.province || ''}
                  onChange={(e) => handleInputChange('province', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="es. TO, MI, RM"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Comune</label>
                <input
                  type="text"
                  value={formData.municipality || ''}
                  onChange={(e) => handleInputChange('municipality', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Indirizzo</label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* Coordinate e data */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Latitudine *</label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.coordinates?.[0] || ''}
                  onChange={(e) => handleCoordinateChange(0, e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Longitudine *</label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.coordinates?.[1] || ''}
                  onChange={(e) => handleCoordinateChange(1, e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Data Visita *</label>
                <input
                  type="date"
                  value={formData.visitDate || ''}
                  onChange={(e) => handleInputChange('visitDate', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Campi opzionali */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating || ''}
                  onChange={(e) => handleInputChange('rating', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Altitudine (m)</label>
                <input
                  type="number"
                  value={formData.altitude || ''}
                  onChange={(e) => handleInputChange('altitude', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Campi specifici per categoria */}
            {formData.category === 'castelli' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Epoca</label>
                  <input
                    type="text"
                    value={formData.epoca || ''}
                    onChange={(e) => handleInputChange('epoca', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Stato</label>
                  <select
                    value={formData.stato || ''}
                    onChange={(e) => handleInputChange('stato', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Seleziona stato</option>
                    <option value="rovine">Rovine</option>
                    <option value="restaurato">Restaurato</option>
                    <option value="abitato">Abitato</option>
                  </select>
                </div>
              </div>
            )}

            {formData.category === 'ristoranti' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Cucina</label>
                    <input
                      type="text"
                      value={formData.cucina || ''}
                      onChange={(e) => handleInputChange('cucina', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Fascia Prezzo</label>
                    <select
                      value={formData.prezzo || ''}
                      onChange={(e) => handleInputChange('prezzo', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="">Seleziona fascia</option>
                      <option value="€">€</option>
                      <option value="€€">€€</option>
                      <option value="€€€">€€€</option>
                    </select>
                  </div>
                </div>

                {/* Cibi mangiati */}
                <div>
                  <label className="block text-sm font-medium mb-2">Cibi Mangiati</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newFood.name}
                      onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                      placeholder="Nome piatto"
                      className="flex-1 border border-gray-300 rounded px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={addEatenFood}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Aggiungi
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.eatenFoods?.map((food, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span>{food.name}</span>
                        <button
                          type="button"
                          onClick={() => removeEatenFood(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Rimuovi
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(formData.category === 'monti' || formData.category === 'rifugi' || formData.category === 'bivacchi') && (
              <div>
                <label className="block text-sm font-medium mb-2">Caratteristiche Montagna</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeature.name}
                    onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                    placeholder="Nome caratteristica"
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                  />
                  <input
                    type="number"
                    value={newFeature.altitude || ''}
                    onChange={(e) => setNewFeature({ ...newFeature, altitude: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="Altitudine"
                    className="w-24 border border-gray-300 rounded px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={addMountainFeature}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Aggiungi
                  </button>
                </div>
                
                <div className="space-y-2">
                  {formData.mountainFeatures?.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{feature.name} {feature.altitude && `(${feature.altitude}m)`}</span>
                      <button
                        type="button"
                        onClick={() => removeMountainFeature(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Rimuovi
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Note</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 h-24"
              />
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
                Salva Luogo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLocationForm;