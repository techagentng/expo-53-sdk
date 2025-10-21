import { ReportCategory, ReportField, ReportData } from '../screens/ReportContainer/BaseReportComponent';

// Category configurations
export const REPORT_CATEGORIES: Record<string, ReportCategory> = {
  crime: {
    id: 'crime',
    name: 'Crime',
    title: 'Crime & Safety',
    fields: [
      {
        name: 'sub_report_type',
        label: 'Select the type of Incident',
        type: 'select',
        required: true,
        options: [
          'Theft',
          'Robbery',
          'Vandalism',
          'Kidnapping',
          'Assault',
          'Burglary',
          'Fraud',
          'Cybercrime',
          'Domestic Violence',
          'Other'
        ],
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Enter Description',
      },
      {
        name: 'date_of_incidence',
        label: 'Date of Incident',
        type: 'date',
        required: true,
      },
      {
        name: 'state_name',
        label: 'State',
        type: 'custom',
        required: true,
        component: 'StateLocal',
      },
      {
        name: 'landmark',
        label: 'Address/Landmark',
        type: 'text',
        required: false,
        placeholder: 'Enter address or landmark',
      },
      {
        name: 'is_anonymous',
        label: 'Report Anonymously',
        type: 'checkbox',
        required: false,
      },
    ],
    validation: (data: ReportData) => {
      return !!(
        data.sub_report_type &&
        data.description &&
        data.state_name &&
        data.lga_name
      );
    },
  },

  healthcare: {
    id: 'healthcare',
    name: 'HealthCare',
    title: 'Healthcare Services',
    fields: [
      {
        name: 'sub_report_type',
        label: 'Type of Healthcare Issue',
        type: 'select',
        required: true,
        options: [
          'Medical Emergency',
          'Hospital Conditions',
          'Medical Equipment',
          'Staff Attitude',
          'Drug Availability',
          'Medical Bills',
          'Insurance Issues',
          'Other'
        ],
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the healthcare issue',
      },
      {
        name: 'state_name',
        label: 'State',
        type: 'custom',
        required: true,
        component: 'StateLocal',
      },
      {
        name: 'landmark',
        label: 'Hospital/Facility Name',
        type: 'text',
        required: false,
        placeholder: 'Enter hospital or facility name',
      },
      {
        name: 'is_anonymous',
        label: 'Report Anonymously',
        type: 'checkbox',
        required: false,
      },
    ],
    validation: (data: ReportData) => {
      return !!(
        data.sub_report_type &&
        data.description &&
        data.state_name &&
        data.lga_name
      );
    },
  },

  education: {
    id: 'education',
    name: 'Education',
    title: 'Education Services',
    fields: [
      {
        name: 'sub_report_type',
        label: 'Type of Education Issue',
        type: 'select',
        required: true,
        options: [
          'School Infrastructure',
          'Teacher Quality',
          'Student Safety',
          'Curriculum Issues',
          'Examination Malpractice',
          'School Fees',
          'Discrimination',
          'Other'
        ],
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the education issue',
      },
      {
        name: 'state_name',
        label: 'State',
        type: 'custom',
        required: true,
        component: 'StateLocal',
      },
      {
        name: 'landmark',
        label: 'School Name',
        type: 'text',
        required: false,
        placeholder: 'Enter school name',
      },
      {
        name: 'is_anonymous',
        label: 'Report Anonymously',
        type: 'checkbox',
        required: false,
      },
    ],
    validation: (data: ReportData) => {
      return !!(
        data.sub_report_type &&
        data.description &&
        data.state_name &&
        data.lga_name
      );
    },
  },

  roads: {
    id: 'roads',
    name: 'Roads',
    title: 'Roads & Infrastructure',
    fields: [
      {
        name: 'sub_report_type',
        label: 'Type of Road Issue',
        type: 'select',
        required: true,
        options: [
          'Potholes',
          'Damaged Roads',
          'Poor Drainage',
          'Missing Signage',
          'Street Lighting',
          'Traffic Congestion',
          'Road Construction',
          'Other'
        ],
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the road issue',
      },
      {
        name: 'state_name',
        label: 'State',
        type: 'custom',
        required: true,
        component: 'StateLocal',
      },
      {
        name: 'landmark',
        label: 'Location Details',
        type: 'text',
        required: false,
        placeholder: 'Enter specific location or landmark',
      },
      {
        name: 'is_anonymous',
        label: 'Report Anonymously',
        type: 'checkbox',
        required: false,
      },
    ],
    validation: (data: ReportData) => {
      return !!(
        data.sub_report_type &&
        data.description &&
        data.state_name &&
        data.lga_name
      );
    },
  },

  fakeproduct: {
    id: 'fakeproduct',
    name: 'Fake products',
    title: 'Fake Products',
    fields: [
      {
        name: 'sub_report_type',
        label: 'Select the type of Incident',
        type: 'select',
        required: true,
        options: [
          'Counterfeit Electronics',
          'Fake Medicines',
          'KnockOff Clothings',
          'Counterfeit Cosmetics',
          'Imitation Food Products'
        ],
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Enter Description',
      },
      {
        name: 'product_name',
        label: 'Product Name',
        type: 'text',
        required: true,
        placeholder: 'Enter product name',
      },
      {
        name: 'state_name',
        label: 'State',
        type: 'custom',
        required: true,
        component: 'StateLocal',
      },
      {
        name: 'landmark',
        label: 'Address/Landmark',
        type: 'text',
        required: false,
        placeholder: 'Enter address or landmark',
      },
      {
        name: 'is_anonymous',
        label: 'Report Anonymously',
        type: 'checkbox',
        required: false,
      },
    ],
    validation: (data: ReportData) => {
      return !!(
        data.sub_report_type &&
        data.description &&
        data.product_name &&
        data.state_name &&
        data.lga_name
      );
    },
  },

  election: {
    id: 'election',
    name: 'Election',
    title: 'Election Issues',
    fields: [
      {
        name: 'sub_report_type',
        label: 'Type of Election Issue',
        type: 'select',
        required: true,
        options: [
          'Voter Suppression',
          'Electoral Fraud',
          'Polling Station Issues',
          'Campaign Violations',
          'Other'
        ],
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the election issue',
      },
      {
        name: 'state_name',
        label: 'State',
        type: 'custom',
        required: true,
        component: 'StateLocal',
      },
      {
        name: 'landmark',
        label: 'Location Details',
        type: 'text',
        required: false,
        placeholder: 'Enter specific location',
      },
      {
        name: 'is_anonymous',
        label: 'Report Anonymously',
        type: 'checkbox',
        required: false,
      },
    ],
    validation: (data: ReportData) => {
      return !!(
        data.sub_report_type &&
        data.description &&
        data.state_name &&
        data.lga_name
      );
    },
  },

  portablewater: {
    id: 'portablewater',
    name: 'Portable Water',
    title: 'Portable Water',
    fields: [
      {
        name: 'sub_report_type',
        label: 'Type of Water Issue',
        type: 'select',
        required: true,
        options: [
          'No Water Supply',
          'Contaminated Water',
          'Pipe Leaks',
          'Water Billing Issues',
          'Other'
        ],
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the water issue',
      },
      {
        name: 'state_name',
        label: 'State',
        type: 'custom',
        required: true,
        component: 'StateLocal',
      },
      {
        name: 'landmark',
        label: 'Location Details',
        type: 'text',
        required: false,
        placeholder: 'Enter specific location',
      },
      {
        name: 'is_anonymous',
        label: 'Report Anonymously',
        type: 'checkbox',
        required: false,
      },
    ],
    validation: (data: ReportData) => {
      return !!(
        data.sub_report_type &&
        data.description &&
        data.state_name &&
        data.lga_name
      );
    },
  },

  power: {
    id: 'power',
    name: 'Power',
    title: 'Power & Electricity',
    fields: [
      {
        name: 'sub_report_type',
        label: 'Type of Power Issue',
        type: 'select',
        required: true,
        options: [
          'Power Outage',
          'Frequent Disconnections',
          'High Electricity Bills',
          'Faulty Equipment',
          'Other'
        ],
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the power issue',
      },
      {
        name: 'outage_length',
        label: 'Outage Length',
        type: 'text',
        required: false,
        placeholder: 'Enter outage duration',
      },
      {
        name: 'state_name',
        label: 'State',
        type: 'custom',
        required: true,
        component: 'StateLocal',
      },
      {
        name: 'landmark',
        label: 'Location Details',
        type: 'text',
        required: false,
        placeholder: 'Enter specific location',
      },
      {
        name: 'is_anonymous',
        label: 'Report Anonymously',
        type: 'checkbox',
        required: false,
      },
    ],
    validation: (data: ReportData) => {
      return !!(
        data.sub_report_type &&
        data.description &&
        data.state_name &&
        data.lga_name
      );
    },
  },

  environment: {
    id: 'environment',
    name: 'Environment',
    title: 'Environmental Issues',
    fields: [
      {
        name: 'sub_report_type',
        label: 'Type of Environmental Issue',
        type: 'select',
        required: true,
        options: [
          'Air Pollution',
          'Water Pollution',
          'Noise Pollution',
          'Waste Management',
          'Deforestation',
          'Erosion',
          'Flooding',
          'Other'
        ],
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the environmental issue',
      },
      {
        name: 'state_name',
        label: 'State',
        type: 'custom',
        required: true,
        component: 'StateLocal',
      },
      {
        name: 'landmark',
        label: 'Location Details',
        type: 'text',
        required: false,
        placeholder: 'Enter specific location',
      },
      {
        name: 'is_anonymous',
        label: 'Report Anonymously',
        type: 'checkbox',
        required: false,
      },
    ],
    validation: (data: ReportData) => {
      return !!(
        data.sub_report_type &&
        data.description &&
        data.state_name &&
        data.lga_name
      );
    },
  },

  others: {
    id: 'others',
    name: 'Others',
    title: 'Others',
    fields: [
      {
        name: 'sub_report_type',
        label: 'What are you reporting about',
        type: 'text',
        required: true,
        placeholder: 'Enter report type',
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        placeholder: 'Enter Description',
      },
      {
        name: 'state_name',
        label: 'State',
        type: 'custom',
        required: true,
        component: 'StateLocal',
      },
      {
        name: 'landmark',
        label: 'Landmark',
        type: 'text',
        required: false,
        placeholder: 'Enter landmark',
      },
      {
        name: 'is_anonymous',
        label: 'Report Anonymously',
        type: 'checkbox',
        required: false,
      },
    ],
    validation: (data: ReportData) => {
      return !!(
        data.sub_report_type &&
        data.description &&
        data.state_name &&
        data.lga_name
      );
    },
  },
};

// Helper function to get category by name
export const getCategoryByName = (name: string): ReportCategory | undefined => {
  return Object.values(REPORT_CATEGORIES).find(category => category.name.toLowerCase() === name.toLowerCase());
};

// Helper function to get category by id
export const getCategoryById = (id: string): ReportCategory | undefined => {
  return REPORT_CATEGORIES[id];
};

// Helper function to get all categories for selection
export const getAllCategories = (): ReportCategory[] => {
  return Object.values(REPORT_CATEGORIES);
};

// Default export for route compatibility
export default {
  REPORT_CATEGORIES,
  getCategoryByName,
  getCategoryById,
  getAllCategories,
};
