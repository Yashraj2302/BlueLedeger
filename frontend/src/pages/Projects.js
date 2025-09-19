import React, { useState, useRef } from 'react';
import { useWalletContext } from '../context/WalletContext';
import { useProjectContext } from '../context/ProjectContext';
import { AlertCircle, CheckCircle, Upload, FileText, X, CheckCircle2, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const Projects = () => {
  const { isConnected, isCorrectNetwork, account } = useWalletContext();
  const { addProject } = useProjectContext();
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    methodology: 'VCS VM0034 - Afforestation',
    area: '',
    location: '',
    geojsonData: null,
    geojsonFile: null
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileSelect = (file) => {
    if (file && (file.type === 'application/geo+json' || file.name.endsWith('.geojson'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const geojsonData = JSON.parse(e.target.result);
          
          // Validate GeoJSON structure
          if (geojsonData.type === 'FeatureCollection' && geojsonData.features) {
            setProjectData(prev => ({
              ...prev,
              geojsonData,
              geojsonFile: file
            }));
            toast.success('GeoJSON file loaded successfully!');
          } else {
            toast.error('Invalid GeoJSON format. Please ensure it\'s a FeatureCollection.');
          }
        } catch (error) {
          toast.error('Error parsing GeoJSON file. Please check the file format.');
        }
      };
      reader.readAsText(file);
    } else {
      toast.error('Please select a valid GeoJSON file (.geojson)');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeGeoJSON = () => {
    setProjectData(prev => ({
      ...prev,
      geojsonData: null,
      geojsonFile: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!projectData.name.trim()) {
      errors.name = 'Project name is required';
    }
    
    if (!projectData.description.trim()) {
      errors.description = 'Project description is required';
    }
    
    if (!projectData.area || projectData.area <= 0) {
      errors.area = 'Valid area is required';
    }
    
    if (!projectData.location.trim()) {
      errors.location = 'Project location is required';
    }
    
    if (!projectData.geojsonData) {
      errors.geojson = 'GeoJSON file is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!isCorrectNetwork()) {
      toast.error('Please switch to Polygon network');
      return;
    }
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call for project submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add project to shared state
      const newProject = addProject({
        ...projectData,
        submitter: account
      });
      
      console.log('Project submitted:', newProject);
      
      toast.success('Project submitted successfully! It will be reviewed by administrators.');
      
      // Reset form
      setProjectData({
        name: '',
        description: '',
        methodology: 'VCS VM0034 - Afforestation',
        area: '',
        location: '',
        geojsonData: null,
        geojsonFile: null
      });
      setValidationErrors({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Error submitting project:', error);
      toast.error('Failed to submit project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Project Onboarding
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Upload your GeoJSON file to register coastal restoration projects and start generating blue carbon credits.
          </p>
          
          {/* Sample GeoJSON Download */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-medium text-blue-800">Need a sample GeoJSON file?</h3>
            </div>
            <p className="text-sm text-blue-600 mb-3">
              Download our sample GeoJSON file to see the expected format for project submission.
            </p>
            <a
              href="/sample-project.geojson"
              download="sample-project.geojson"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download Sample GeoJSON</span>
            </a>
          </div>
        </div>

        {/* Wallet Status */}
        {isConnected && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className={`card ${isCorrectNetwork() ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
              <div className="flex items-center space-x-3">
                {isCorrectNetwork() ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                )}
                <div>
                  <h3 className={`font-semibold ${isCorrectNetwork() ? 'text-green-800' : 'text-orange-800'}`}>
                    {isCorrectNetwork() ? 'Wallet Connected' : 'Wrong Network'}
                  </h3>
                  <p className={`text-sm ${isCorrectNetwork() ? 'text-green-600' : 'text-orange-600'}`}>
                    {isCorrectNetwork() 
                      ? `Connected to Polygon with account: ${account?.slice(0, 6)}...${account?.slice(-4)}`
                      : 'Please switch to Polygon network to continue'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Upload Project Data
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={projectData.name}
                  onChange={handleInputChange}
                  className={`input-field ${validationErrors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter project name"
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={projectData.location}
                  onChange={handleInputChange}
                  className={`input-field ${validationErrors.location ? 'border-red-500' : ''}`}
                  placeholder="e.g., Sundarbans, West Bengal, India"
                />
                {validationErrors.location && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.location}</p>
                )}
              </div>

              {/* GeoJSON File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GeoJSON File *
                </label>
                {!projectData.geojsonData ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragOver 
                        ? 'border-ocean-400 bg-ocean-50' 
                        : validationErrors.geojson 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Drag and drop your GeoJSON file here</p>
                    <p className="text-sm text-gray-500">or click to browse</p>
                    <p className="text-xs text-gray-400 mt-2">Supports .geojson files only</p>
                  </div>
                ) : (
                  <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            {projectData.geojsonFile.name}
                          </p>
                          <p className="text-xs text-green-600">
                            {projectData.geojsonData.features.length} features loaded
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeGeoJSON}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".geojson,application/geo+json"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                {validationErrors.geojson && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.geojson}</p>
                )}
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  name="description"
                  value={projectData.description}
                  onChange={handleInputChange}
                  className={`input-field ${validationErrors.description ? 'border-red-500' : ''}`}
                  rows="4"
                  placeholder="Describe your coastal restoration project, including goals, methods, and expected outcomes"
                />
                {validationErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
                )}
              </div>

              {/* Methodology and Area */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Methodology
                  </label>
                  <select 
                    name="methodology"
                    value={projectData.methodology}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="VCS VM0034 - Afforestation">VCS VM0034 - Afforestation</option>
                    <option value="VCS VM0035 - Reforestation">VCS VM0035 - Reforestation</option>
                    <option value="Custom Methodology">Custom Methodology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Area (hectares) *
                  </label>
                  <input
                    type="number"
                    name="area"
                    value={projectData.area}
                    onChange={handleInputChange}
                    className={`input-field ${validationErrors.area ? 'border-red-500' : ''}`}
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                  {validationErrors.area && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.area}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isSubmitting || !isConnected || !isCorrectNetwork()}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting Project...</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    <span>Submit Project</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
