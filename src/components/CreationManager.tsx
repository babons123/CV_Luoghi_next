import React, { useState } from 'react';
import { Location, Tag } from '@/types/luogo';
import CreateLocationForm from './CreateLocationForm';
import CreateTagForm from './CreateTagForm';

interface CreationManagerProps {
  onLocationCreated?: (location: Location) => void;
  onTagCreated?: (tag: Tag) => void;
}

const CreationManager: React.FC<CreationManagerProps> = ({ 
  onLocationCreated, 
  onTagCreated 
}) => {
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);

  const saveLocationToFile = async (location: Location, category: string) => {
    try {
      // Simula il salvataggio in un file JSON
      const fileName = `${category}.json`;
      const existingData = JSON.parse(localStorage.getItem(fileName) || '[]');
      const updatedData = [...existingData, location];
      localStorage.setItem(fileName, JSON.stringify(updatedData, null, 2));
      
      console.log(`Luogo salvato in ${fileName}:`, location);
      return true;
    } catch (error) {
      console.error('Errore nel salvataggio del luogo:', error);
      return false;
    }
  };

  const saveTagToFile = async (tag: Tag) => {
    try {
      // Simula il salvataggio nel file tags.json
      const fileName = 'tags.json';
      const existingData = JSON.parse(localStorage.getItem(fileName) || '{}');
      const updatedData = { ...existingData, [tag.id]: tag };
      localStorage.setItem(fileName, JSON.stringify(updatedData, null, 2));
      
      console.log('Tag salvato in tags.json:', tag);
      return true;
    } catch (error) {
      console.error('Errore nel salvataggio del tag:', error);
      return false;
    }
  };

  const handleLocationSave = async (location: Location) => {
    const success = await saveLocationToFile(location, location.category);
    
    if (success) {
      alert(`Luogo "${location.name}" salvato con successo in ${location.category}.json!`);
      setShowLocationForm(false);
      
      // Callback per aggiornare la UI genitore se necessario
      if (onLocationCreated) {
        onLocationCreated(location);
      }
    } else {
      alert('Errore nel salvataggio del luogo');
    }
  };

  const handleTagSave = async (tag: Tag) => {
    const success = await saveTagToFile(tag);
    
    if (success) {
      alert(`Tag "${tag.name}" salvato con successo!`);
      setShowTagForm(false);
      
      // Callback per aggiornare la UI genitore se necessario
      if (onTagCreated) {
        onTagCreated(tag);
      }
    } else {
      alert('Errore nel salvataggio del tag');
    }
  };

  // Funzione per scaricare il file JSON (utile per development)
  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportData = (type: 'location' | 'tag', category?: string) => {
    try {
      if (type === 'location' && category) {
        const data = JSON.parse(localStorage.getItem(`${category}.json`) || '[]');
        downloadJSON(data, `${category}.json`);
      } else if (type === 'tag') {
        const data = JSON.parse(localStorage.getItem('tags.json') || '{}');
        downloadJSON(data, 'tags.json');
      }
    } catch (error) {
      console.error('Errore nell\'export:', error);
      alert('Errore nell\'esportazione dei dati');
    }
  };

  return (
    <div>
      {/* Bottoni di creazione */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setShowLocationForm(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          + Crea Luogo
        </button>
        
        <button
          onClick={() => setShowTagForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          + Crea Tag
        </button>
      </div>

      {/* Sezione per export/debug (rimuovibile in produzione) */}
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h3 className="font-medium mb-2">Debug/Export Data:</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => exportData('tag')}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
          >
            Export Tags
          </button>
          {['aeroporti', 'bivacchi', 'castelli', 'chiese', 'eventi', 'laghi', 'monti', 'musei', 'rifugi', 'ristoranti'].map(cat => (
            <button
              key={cat}
              onClick={() => exportData('location', cat)}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              Export {cat}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">
          I dati vengono salvati in localStorage per demo. In produzione useresti API per salvare sui file JSON.
        </p>
      </div>

      {/* Form modale per la creazione di luoghi */}
      {showLocationForm && (
        <CreateLocationForm
          onSave={handleLocationSave}
          onCancel={() => setShowLocationForm(false)}
        />
      )}

      {/* Form modale per la creazione di tag */}
      {showTagForm && (
        <CreateTagForm
          onSave={handleTagSave}
          onCancel={() => setShowTagForm(false)}
        />
      )}
    </div>
  );
};

export default CreationManager;