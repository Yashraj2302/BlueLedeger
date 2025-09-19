import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  FileText, 
  MapPin, 
  Calendar,
  User,
  LogOut,
  RefreshCw
} from 'lucide-react';

// Mock data - in real app, this would come from API
const mockProjects = [
    {
      id: 1,
      name: 'Mangrove Restoration - Sundarbans',
      description: 'Large-scale mangrove restoration project in the Sundarbans delta region',
      submitter: '0x742d35Cc6634C0532925a3b8D0C0C4C4C4C4C4C4',
      status: 'pending',
      submittedAt: '2025-01-15T10:30:00Z',
      area: 150.5,
      methodology: 'VCS VM0034',
      location: 'West Bengal, India',
      geojsonData: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { plot_id: 'plot_001', species: 'Rhizophora mucronata' },
            geometry: {
              type: 'Polygon',
              coordinates: [[[88.1234, 21.5678], [88.1245, 21.5678], [88.1245, 21.5689], [88.1234, 21.5689], [88.1234, 21.5678]]]
            }
          }
        ]
      },
      documents: ['project_proposal.pdf', 'environmental_impact.pdf']
    },
    {
      id: 2,
      name: 'Seagrass Restoration - Gulf of Mannar',
      description: 'Seagrass restoration project in the Gulf of Mannar Marine National Park',
      submitter: '0x8a9b2c3d4e5f6789012345678901234567890abcd',
      status: 'pending',
      submittedAt: '2025-01-14T14:20:00Z',
      area: 75.3,
      methodology: 'VCS VM0035',
      location: 'Tamil Nadu, India',
      geojsonData: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { plot_id: 'plot_002', species: 'Halophila ovalis' },
            geometry: {
              type: 'Polygon',
              coordinates: [[[79.1234, 9.5678], [79.1245, 9.5678], [79.1245, 9.5689], [79.1234, 9.5689], [79.1234, 9.5678]]]
            }
          }
        ]
      },
      documents: ['seagrass_study.pdf', 'restoration_plan.pdf']
    },
    {
      id: 3,
      name: 'Salt Marsh Restoration - Chilika',
      description: 'Salt marsh restoration project around Chilika Lake',
      submitter: '0x1a2b3c4d5e6f7890123456789012345678901234ef',
      status: 'approved',
      submittedAt: '2025-01-10T09:15:00Z',
      area: 45.2,
      methodology: 'Custom',
      location: 'Odisha, India',
      geojsonData: null,
      documents: ['chilika_restoration.pdf']
    }
  ];

const AdminDashboard = ({ onLogout }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    // Load admin user info
    const user = localStorage.getItem('adminUser');
    if (user) {
      setAdminUser(JSON.parse(user));
    }
    
    // Use mock data for now (will integrate with API later)
    setTimeout(() => {
      setProjects(mockProjects);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  const handleApprove = async (projectId) => {
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, status: 'approved' }
          : project
      ));
      
      // Close details view if this project was selected
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
      }
    } catch (error) {
      console.error('Error approving project:', error);
    }
  };

  const handleReject = async (projectId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, status: 'rejected', rejectionReason }
          : project
      ));
      
      setRejectionReason('');
      setShowRejectionModal(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Error rejecting project:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-ocean-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">BlueLedger System Administration</p>
              {adminUser && (
                <p className="text-sm text-gray-500 mt-1">
                  Welcome, <span className="font-medium text-ocean-600">{adminUser.name}</span> 
                  <span className="ml-2 px-2 py-1 bg-ocean-100 text-ocean-800 text-xs rounded-full">
                    {adminUser.role}
                  </span>
                </p>
              )}
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter(p => p.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter(p => p.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter(p => p.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'all' 
                  ? 'bg-ocean-100 text-ocean-800' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending Review
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'approved' 
                  ? 'bg-green-100 text-green-800' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'rejected' 
                  ? 'bg-red-100 text-red-800' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Projects ({filteredProjects.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredProjects.map((project) => (
              <div key={project.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(project.status)}
                      <h4 className="text-lg font-medium text-gray-900">
                        {project.name}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{project.description}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {project.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(project.submittedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {project.submitter.slice(0, 6)}...{project.submitter.slice(-4)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                    {project.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(project.id)}
                          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProject(project);
                            setShowRejectionModal(true);
                          }}
                          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Project Details: {selectedProject.name}
              </h3>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProject.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProject.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Area (hectares)</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProject.area}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Methodology</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProject.methodology}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submitter</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{selectedProject.submitter}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submitted At</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedProject.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedProject.geojsonData && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GeoJSON Data</label>
                  <div className="bg-gray-100 p-4 rounded-md">
                    <pre className="text-xs text-gray-800 overflow-x-auto">
                      {JSON.stringify(selectedProject.geojsonData, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {selectedProject.documents && selectedProject.documents.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attached Documents</label>
                  <div className="space-y-2">
                    {selectedProject.documents.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-blue-600">
                        <FileText className="h-4 w-4" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedProject.rejectionReason && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason</label>
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-800">{selectedProject.rejectionReason}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Reject Project</h3>
              <button
                onClick={() => setShowRejectionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Rejection *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
                rows="4"
                placeholder="Please provide a detailed reason for rejecting this project..."
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedProject.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Reject Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
