import React, { useState } from 'react';
import { X, Upload, ChevronDown } from 'lucide-react';
import { categories } from '../data/pins';

interface CreatePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePin: (pin: any) => void;
}

const CreatePinModal: React.FC<CreatePinModalProps> = ({ isOpen, onClose, onCreatePin }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create a preview URL for the uploaded image
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
        
        // Get image dimensions
        const img = new Image();
        img.onload = () => {
          setImageSize({
            width: img.width,
            height: img.height
          });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now we're just using the preview URL as the image URL
    // In a real app, you would upload the image to a server
    const newPin = {
      id: `temp-${Date.now()}`,
      title,
      description,
      imageUrl: previewUrl || imageUrl,
      width: imageSize.width || 4,
      height: imageSize.height || 5,
      saved: false,
      category: selectedCategory || 'other',
      user: {
        id: 'current-user',
        name: 'Current User',
        avatarUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
      }
    };
    
    onCreatePin(newPin);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedCategory('');
    setImageUrl('');
    setImageFile(null);
    setPreviewUrl(null);
    setImageSize({ width: 0, height: 0 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Create a Pin</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-6">
            {previewUrl ? (
              <div className="relative rounded-lg overflow-hidden bg-gray-100">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full object-contain max-h-[400px]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(null);
                    setImageFile(null);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label 
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-gray-600 mb-1">Click to upload an image</p>
                  <p className="text-gray-400 text-sm">Recommendation: Use high-quality .jpg files</p>
                </label>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Add a title"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Tell everyone what your Pin is about"
              />
            </div>
            
            <div className="relative">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <div 
                className="w-full p-3 border border-gray-300 rounded-lg flex justify-between items-center cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className={selectedCategory ? "text-gray-900" : "text-gray-500"}>
                  {selectedCategory ? 
                    categories.find(c => c.id === selectedCategory)?.name : 
                    "Select a category"}
                </span>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
              
              {dropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {categories.filter(c => c.id !== 'all').map((category) => (
                    <div
                      key={category.id}
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setDropdownOpen(false);
                      }}
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 mr-2 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#E60023] text-white rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!title || (!previewUrl && !imageUrl)}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePinModal;