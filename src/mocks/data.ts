const _propertyList = [
	{
		id: 12345,
		title: 'Modern 3-Bedroom House',
		description: 'A spacious modern house with a backyard and parking.',
		propertyType: 'house',
		address: {
			street: '456 Oak Lane',
			city: 'Lviv',
			country: 'Ukraine',
			zipCode: '94103',
		},
		pricePerMonth: 3000, // OR
		// price_per_day: 250
		longTerm: true, // OR false
		amenities: [
			{
				name: 'pool',
				value: false,
				unit: null,
				valueType: 'boolean',
			},
			{
				name: 'parking',
				value: 2,
				unit: 'slots',
				valueType: 'number',
			},
			{
				name: 'gym_distance',
				value: 500,
				unit: 'meters',
				valueType: 'number',
			},
			{
				name: 'backyard',
				value: true,
				unit: null,
				valueType: 'boolean',
			},
			{
				name: 'wifi',
				value: 100,
				unit: 'Mbps',
				valueType: 'number',
			},
			{
				name: 'air_conditioning',
				value: true,
				unit: null,
				valueType: 'boolean',
			},
			{
				name: 'heating',
				value: true,
				unit: null,
				valueType: 'boolean',
			},
			{
				name: 'laundry',
				value: 'In-unit',
				unit: null,
				valueType: 'string',
			},
			{
				name: 'dishwasher',
				value: false,
				unit: null,
				valueType: 'boolean',
			},
			{
				name: 'balcony_area',
				value: 10,
				unit: 'sqm',
				valueType: 'number',
			},
			{
				name: 'furnished',
				value: false,
				unit: null,
				valueType: 'boolean',
			},
			{
				name: 'pets_allowed',
				value: true,
				unit: null,
				valueType: 'boolean',
			},
			{
				name: 'children_allowed',
				value: true,
				unit: null,
				valueType: 'boolean',
			},
			{
				name: 'elevator',
				value: true,
				unit: null,
				valueType: 'boolean',
			},
			{
				name: 'security_system',
				value: true,
				unit: null,
				valueType: 'boolean',
			},
			{
				name: 'fireplace',
				value: false,
				unit: null,
				valueType: 'boolean',
			},
			{
				name: 'number_of_bedrooms',
				value: 3,
				unit: null,
				valueType: 'number',
			},
			{
				name: 'number_of_bathrooms',
				value: 2,
				unit: null,
				valueType: 'number',
			},
			{
				name: 'backyard',
				value: true,
				unit: null,
				valueType: 'boolean',
			},
			{
				name: 'basement',
				value: true,
				unit: null,
				valueType: 'boolean',
			},
			{
				name: 'garage',
				value: true,
				unit: null,
				valueType: 'boolean',
			},
		],
		property_details: {
			wallType: 'brick', // Type of walls: brick, wood, concrete, etc.
			yearBuilt: 1990,
			floors: 2, // Number of floors in the building
			// total_units: 50,  // Total number of units in the building
			squareFootage: 1200, // Size of the property in square feet or sqm
			energyEfficiencyRating: 'A', // Energy efficiency rating of the property
			floor: 3, // room, appartment
			totalFloors: 3, // room, appartment
			// availability: true,
			availableFrom: 'date',
			availableTo: 'date',
			// total_units: 1,  // Single-family home
			maximumNumberOfGuests: 6,
		},

		postedByUserId: 67890,
	},
];

const _user = {
	id: 12345,
	firstName: 'Jane',
	lastName: 'Doe',
	email: 'jane.doe@example.com',
	phone: '+1-555-4321',
	role: 'owner', // Can be 'owner', 'agent', 'user', or 'guest'
	createdAt: '2023-10-01T12:34:56Z',
	lastLogin: '2023-10-02T14:22:11Z',
	updatedAt: 'date', // for history
};

const _profile = {
	userId: 12345,
	description: 'Description',
	// companyName: null,  // Only for agents, null for others
	// commissionRate: null,  // Only for agents, in % - 0.10
	isLookingForApartment: false, // can be added a badge to the profile
	savedProperties: [], // property IDs
	postedProperties: [98765, 12345], // For 'owner' or 'agent', list of posted properties
	// preferences: [],
};
