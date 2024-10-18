export enum ActivityCode {
  // Account-related activities
  REGISTRATION = 'registration',
  LOGIN = 'login', // can be moved to a separte(security) log
  LOGOUT = 'logout', // can be moved to a separte(security) log
  PASSWORD_CHANGE = 'password_change',
  PROFILE_UPDATE = 'profile_update',
  EMAIL_UPDATE = 'email_update',
  PHONE_UPDATE = 'phone_update',
  ACCOUNT_DEACTIVATION = 'account_deactivation',

  // Property-related activities
  PROPERTY_CREATED = 'property_created',
  PROPERTY_UPDATED = 'property_updated',
  PROPERTY_DELETED = 'property_deleted',
  PROPERTY_VIEWED = 'property_viewed',
  PROPERTY_RENTED = 'property_rented',
  PROPERTY_SAVED = 'property_saved',
  PROPERTY_UNSAVED = 'property_unsaved',

  // Rental Process-related activities
  RENT_REQUEST_SUBMITTED = 'rent_request_submitted',
  RENT_REQUEST_APPROVED = 'rent_request_approved',
  RENT_REQUEST_REJECTED = 'rent_request_rejected',
  RENTAL_PAYMENT_MADE = 'rental_payment_made',
  RENTAL_CONTRACT_SIGNED = 'rental_contract_signed',

  // Agent and Owner-specific activities
  AGENT_COMMISSION_SET = 'agent_commission_set',
  AGENT_PROPERTY_MANAGED = 'agent_property_managed',
  OWNER_PROPERTY_LISTED = 'owner_property_listed',
  OWNER_PROPERTY_REMOVED = 'owner_property_removed',

  // Review and Feedback-related activities
  REVIEW_SUBMITTED = 'review_submitted',
  REVIEW_DELETED = 'review_deleted',
  REVIEW_UPDATED = 'review_updated',

  // Miscellaneous Activities
  NOTIFICATION_RECEIVED = 'notification_received',
  MESSAGE_SENT = 'message_sent',
  MESSAGE_RECEIVED = 'message_received',
  OTHER = 'other',
}

export const activitiesSeedData: { code: ActivityCode; description: string }[] =
  [
    {
      code: ActivityCode.REGISTRATION,
      description: 'User registered for the first time',
    },
    { code: ActivityCode.LOGIN, description: 'User logged into the system' },
    { code: ActivityCode.LOGOUT, description: 'User logged out of the system' },
    {
      code: ActivityCode.PASSWORD_CHANGE,
      description: 'User changed their password',
    },
    {
      code: ActivityCode.PROFILE_UPDATE,
      description: 'User updated their profile details',
    },
    {
      code: ActivityCode.EMAIL_UPDATE,
      description: 'User updated their email address',
    },
    {
      code: ActivityCode.PHONE_UPDATE,
      description: 'User updated their phone number',
    },
    {
      code: ActivityCode.ACCOUNT_DEACTIVATION,
      description: 'User deactivated their account',
    },
    {
      code: ActivityCode.PROPERTY_CREATED,
      description: 'A new property was created',
    },
    {
      code: ActivityCode.PROPERTY_UPDATED,
      description: 'A property was updated',
    },
    {
      code: ActivityCode.PROPERTY_DELETED,
      description: 'A property was deleted',
    },
    {
      code: ActivityCode.PROPERTY_VIEWED,
      description: 'A property was viewed',
    },
    {
      code: ActivityCode.PROPERTY_RENTED,
      description: 'A property was rented',
    },
    {
      code: ActivityCode.PROPERTY_SAVED,
      description: 'A property was saved to favorites',
    },
    {
      code: ActivityCode.PROPERTY_UNSAVED,
      description: 'A property was removed from favorites',
    },
    {
      code: ActivityCode.RENT_REQUEST_SUBMITTED,
      description: 'User submitted a rent request',
    },
    {
      code: ActivityCode.RENT_REQUEST_APPROVED,
      description: "User's rent request was approved",
    },
    {
      code: ActivityCode.RENT_REQUEST_REJECTED,
      description: "User's rent request was rejected",
    },
    {
      code: ActivityCode.RENTAL_PAYMENT_MADE,
      description: 'User made a rental payment',
    },
    {
      code: ActivityCode.RENTAL_CONTRACT_SIGNED,
      description: 'User signed the rental contract',
    },
    {
      code: ActivityCode.AGENT_COMMISSION_SET,
      description: 'Agent set their commission rate',
    },
    {
      code: ActivityCode.AGENT_PROPERTY_MANAGED,
      description: 'Agent managed a property',
    },
    {
      code: ActivityCode.OWNER_PROPERTY_LISTED,
      description: 'Owner listed a property',
    },
    {
      code: ActivityCode.OWNER_PROPERTY_REMOVED,
      description: 'Owner removed a property listing',
    },
    {
      code: ActivityCode.REVIEW_SUBMITTED,
      description: 'User submitted a review',
    },
    {
      code: ActivityCode.REVIEW_DELETED,
      description: 'User deleted their review',
    },
    {
      code: ActivityCode.REVIEW_UPDATED,
      description: 'User updated their review',
    },
    {
      code: ActivityCode.NOTIFICATION_RECEIVED,
      description: 'User received a notification',
    },
    { code: ActivityCode.MESSAGE_SENT, description: 'User sent a message' },
    {
      code: ActivityCode.MESSAGE_RECEIVED,
      description: 'User received a message',
    },
    { code: ActivityCode.OTHER, description: 'Miscellaneous user activity' },
  ];

export const wallTypesSeedData = [
  { code: 'wood', description: 'Made with wood...' },
  { code: 'brick', description: 'Constructed with bricks...' },
  { code: 'concrete', description: 'Built with concrete...' },
];
