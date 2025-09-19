import React from 'react';

const Projects = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Project Onboarding
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your GeoJSON file to register coastal restoration projects and start generating blue carbon credits.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Upload Project Data
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GeoJSON File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-gray-600 mb-2">Drag and drop your GeoJSON file here</p>
                  <p className="text-sm text-gray-500">or click to browse</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  className="input-field"
                  rows="4"
                  placeholder="Describe your coastal restoration project"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Methodology
                  </label>
                  <select className="input-field">
                    <option>VCS VM0034 - Afforestation</option>
                    <option>VCS VM0035 - Reforestation</option>
                    <option>Custom Methodology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Area (hectares)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="0"
                  />
                </div>
              </div>

              <button className="btn-primary w-full">
                Submit Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
