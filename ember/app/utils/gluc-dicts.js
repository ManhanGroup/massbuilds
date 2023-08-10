const glucDicts = {
    'Rural Residential': '2.5-, 5-, 10-, 20-acre lots',
    'Estate Residential': '',
    'Very Low Density Residential': '1 du/2.5 ac to 4 du/ac',
    'Low Density Residential': '4 to 8 du/ac',
    'Medium Density Residential': '8 to 12 du/ac',
	'Med-High Density Residential': '12 to 16 du/ac',
    'High Density Residential': '16 to 20 du/ac',
    'Very-High Density Residential': '20 to 38 du/ac',
	'Mobile Home Park': 'varies',
    'Senior Housing': 'varies',
    'Student Housing': 'varies',
    'Auto Sales': '',
    'Commercial Retail': '',
    'Office': '',
    'Tourist Accommodation': '',
    'Religious Facility':'',
    'Community Center': '',
    'Business Park': '',
    'Commercial Services': '',
    'Light Industrial': '',
    'High Industrial': '',
    'Mixed-Use': 'varies',
    'Specific Planning Areas': 'varies',
    'School': '',
    'College or University': '',
    'Special Use (Major Facility)': '',
    'Public Facility': '',
    'Road': 'n/a',
    'Agriculture': '',
    'Winery': '',
    'Rural Lands': 'limited',
    'Recreation': '',
    'Open Space': 'n/a',
    'Riparian Corridor': 'n/a'
};

const glucOptions = Object.keys(glucDicts)
                            .filter(gluc => gluc !== 'deselected');

export { glucOptions, glucDicts };
export default glucDicts;