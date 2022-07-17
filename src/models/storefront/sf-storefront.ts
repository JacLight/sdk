

const SupplierOrder = {
  type: 'object',
  properties: {
    supplierOrderId: { type: 'long' },

    supplierId: { type: 'long' },
    deliveryDate: { type: 'Date' },
    orderNumber: { type: 'String' },
    currency: { type: 'String' },
    orderStatus: { type: 'String' },
    orderState: { type: 'String' },
    reference: { type: 'String' },
    total: { type: 'double' },
    tax: { type: 'double' },
    discountRate: { type: 'double' },
    discountValue: { type: 'double' },
    remarks: { type: 'String' },
    status: { type: 'String' },
  },
} as const;

const SupplierOrderItem = {
  type: 'object',
  properties: {
    supplierOrderItemId: { type: 'long' },

    companyId: { type: 'long' },

    supplierOrderId: { type: 'long' },
    itemId: { type: 'long' },
    attribute: { type: 'String' },
    unitPrice: { type: 'double' },
    quantityOrdered: { type: 'long' },
    quantityReceived: { type: 'long' },
    price: { type: 'double' },
    discountRate: { type: 'String' },
    discountValue: { type: 'String' },
    taxRate: { type: 'String' },
    taxValue: { type: 'String' },
    total: { type: 'double' },
    tax: { type: 'double' },
    remarks: { type: 'String' },
  },
} as const;


const Stock = {
  type: 'object',
  properties: {
    stockId: { type: 'long' },

    warehouseId: { type: 'String' },
    itemId: { type: 'long' },
    attribute: { type: 'String' },
    reference: { type: 'String' },
    remarks: { type: 'String' },
    price: { type: 'String' },
    physicalQuantities: { type: 'String' },
    usableQuantities: { type: 'String' },
    Status: { type: 'String' },
  },
} as const;

const StockMovement = {
  type: 'object',
  properties: {
    stockMovementId: { type: 'long' },

    stockId: { type: 'String' },
    orderItemId: { type: 'String' },
    supplyOrderId: { type: 'String' },
    quantity: { type: 'String' },
    prepairedBy: { type: 'long' },
    date: { type: 'String' },
    remarks: { type: 'String' },
    status: { type: 'String' },
  },
} as const;


const Warehouse = {
  type: 'object',
  properties: {
    warehouseId: { type: 'long' },

    name: { type: 'String' },
    type: { type: 'String' },
    address: { type: 'String' },
    contact: { type: 'String' },
    remarks: { type: 'String' },
    status: { type: 'String' },
  },
} as const;

const WarehouseItem = {
  type: 'object',
  properties: {
    warehouseItemId: { type: 'long' },

    companyId: { type: 'long' },

    warehouseId: { type: 'String' },
    attribute: { type: 'String' },
    itenId: { type: 'long' },
    quantity: { type: 'long' },
  },
} as const;

const PointOfSale = {
  type: 'object',
  properties: {
    posId: { type: 'long' },

    name: { type: 'String' },
    encodig: { type: 'String' },
    pattern: { type: 'String' },
    sequence: { type: 'String' },
    write: { type: 'String' },
    type: { type: 'String' },
    status: { type: 'String' },
  },
} as const;

const PointOfSaleSession = {
  type: 'object',
  properties: {
    sessionId: { type: 'long' },

    posId: { type: 'String' },
    startDate: { type: 'String' },
    endTime: { type: 'String' },
    status: { type: 'String' },
  },
} as const;

const BarcodeReader = {
  type: 'object',
  properties: {
    readerId: { type: 'long' },

    name: { type: 'String' },
    encodig: { type: 'String' },
    pattern: { type: 'String' },
    sequence: { type: 'String' },
    write: { type: 'String' },
    type: { type: 'String' },
    status: { type: 'String' },
  },
} as const;

const Printer = {
  type: 'object',
  properties: {
    readerId: { type: 'long' },

    name: { type: 'String' },
    encodig: { type: 'String' },
    pattern: { type: 'String' },
    sequence: { type: 'String' },
    write: { type: 'String' },
    type: { type: 'String' },
    status: { type: 'String' },
  },
} as const;

const CashBox = {
  type: 'object',
  properties: {
    readerId: { type: 'long' },

    name: { type: 'String' },
    encodig: { type: 'String' },
    pattern: { type: 'String' },
    sequence: { type: 'String' },
    write: { type: 'String' },
    type: { type: 'String' },
    status: { type: 'String' },
  },
} as const;

const Bank = {
  type: 'object',
  properties: {
    bankId: { type: 'long' },

    name: { type: 'String' },
    code: { type: 'String' },
    iban: { type: 'String' },
    swiftcode: { type: 'String' },
    country: { type: 'String' },
    status: { type: 'String' },
  },
} as const;

const BankAccount = {
  type: 'object',
  properties: {
    accountId: { type: 'long' },

    bankId: { type: 'long' },
    number: { type: 'String' },
    name: { type: 'String' },
    swiftcode: { type: 'String' },
    type: { type: 'String' },
    currency: { type: 'String' },
    status: { type: 'String' },
    state: { type: 'String' },
    balanceAvailable: { type: 'double' },
    balanceCurrent: { type: 'double' },
  },
} as const;

const Wallet = {
  type: 'object',
  properties: {
    walletId: { type: 'long' },

    number: { type: 'String' },
    name: { type: 'String' },
    type: { type: 'String' },
    currency: { type: 'String' },
    status: { type: 'String' },
    state: { type: 'String' },
    balanceAvailable: { type: 'double' },
    balanceCurrent: { type: 'double' },
  },
} as const;

const Biller = {
  type: 'object',
  properties: {
    billderId: { type: 'long' },

    name: { type: 'String' },
    logo: { type: 'String' },
    email: { type: 'String' },
    website: { type: 'String' },
    contactName: { type: 'String' },
    contactEmail: { type: 'String' },
    contactPhone: { type: 'String' },
    debitAccount: { type: 'String' },
    creditAccount: { type: 'String' },
    category: { type: 'String' },
    status: { type: 'String' },
  },
} as const;

const BillerItem = {
  type: 'object',
  properties: {
    billderItemId: { type: 'long' },

    billerId: { type: 'String' },
    name: { type: 'String' },
    description: { type: 'String' },
    logo: { type: 'String' },
    amount: { type: 'String' },
    type: { type: 'String' },
    url: { type: 'String' },
    category: { type: 'String' },
    status: { type: 'String' },
  },
} as const;

const Merchant = {
  type: 'object',
  properties: {
    merchantId: { type: 'long' },

    number: { type: 'String' },
    name: { type: 'String' },
    description: { type: 'String' },
    status: { type: 'String' },
    state: { type: 'String' },
    balanceAvailable: { type: 'double' },
    balanceCurrent: { type: 'double' },
  },
} as const;

const MerchantBrand = {
  type: 'object',
  properties: {
    merchantId: { type: 'long' },
  },
} as const;

const MerchantBiller = {
  type: 'object',
  properties: {
    myContactId: { type: 'long' },

    myCountryId: { type: 'long' },
    myGroupId: { type: 'long' },
    state: { type: 'String' },
    title: { type: 'String' },
    postCode: { type: 'String' },
    email: { type: 'String' },
    website: { type: 'String' },
    firstName: { type: 'String' },
    lastName: { type: 'String' },
    otherNames: { type: 'String' },
    company: { type: 'String' },
    gender: { type: 'String' },
    dateOfBirth: { type: 'Date' },
    contactType: { type: 'String' },
    phone: { type: 'String' },
    status: { type: 'String' },
  },
} as const;

const MerchantUser = {
  type: 'object',
  properties: {
    mercehantUserId: { type: 'long' },
  },
} as const;

const Card = {
  type: 'object',
  properties: {
    cardId: { type: 'long' },

    pan: { type: 'String' },
    cardType: { type: 'String' },
    expiry: { type: 'long' },
    pinOffset: { type: 'String' },
    accountNo: { type: 'String' },
    customerName: { type: 'String' },
    branch: { type: 'String' },
    cardState: { type: 'String' },
    cartStatus: { type: 'String' },
  },
} as const;

const CardAllowed = {
  type: 'object',
  properties: {
    cardId: { type: 'long' },

    pan: { type: 'String' },
    cardType: { type: 'String' },
    expiry: { type: 'long' },
    pinOffset: { type: 'String' },
    accountNo: { type: 'String' },
    customerName: { type: 'String' },
    branch: { type: 'String' },
    cardState: { type: 'String' },
    cartStatus: { type: 'String' },
  },
} as const;

const CardReader = {
  type: 'object',
  properties: {
    readerId: { type: 'long' },

    serial: { type: 'String' },
    key: { type: 'String' },
    threshold: { type: 'String' },
    status: { type: 'String' },
  },
} as const;

const CardReaderAllowed = {
  type: 'object',
  properties: {
    readerId: { type: 'long' },

    serial: { type: 'String' },
    key: { type: 'String' },
    threshold: { type: 'String' },
    status: { type: 'String' },
  },
} as const;

const CardReaderLog = {
  type: 'object',
  properties: {
    logId: { type: 'long' },

    transactionNumber: { type: 'String' },
    readerId: { type: 'String' },
    cardType: { type: 'String' },
    pan: { type: 'String' },
    expiry: { type: 'long' },
    pin: { type: 'String' },
    name: { type: 'String' },
    cvv: { type: 'String' },
    accountType: { type: 'String' },
    amount: { type: 'String' },
    transactionType: { type: 'String' },
    raw: { type: 'String' },
    uf1: { type: 'String' },
    uf2: { type: 'String' },
    uf3: { type: 'String' },
    uf4: { type: 'String' },
    uf5: { type: 'String' },
    transactionState: { type: 'String' },
    transactionStatus: { type: 'String' },
  },
} as const;

const Pos = {
  type: 'object',
  properties: {
    posId: { type: 'long' },

    pan: { type: 'String' },
    cardType: { type: 'String' },
    expiry: { type: 'long' },
    pinOffset: { type: 'String' },
    accountNo: { type: 'String' },
    customerName: { type: 'String' },
    branch: { type: 'String' },
    cardState: { type: 'String' },
    cartStatus: { type: 'String' },
  },
} as const;

const PosAllowed = {
  type: 'object',
  properties: {
    posId: { type: 'long' },

    pan: { type: 'String' },
    cardType: { type: 'String' },
    expiry: { type: 'long' },
    pinOffset: { type: 'String' },
    accountNo: { type: 'String' },
    customerName: { type: 'String' },
    branch: { type: 'String' },
    cardState: { type: 'String' },
    cartStatus: { type: 'String' },
  },
} as const;

const PosLog = {
  type: 'object',
  properties: {
    logId: { type: 'long' },

    transactionNumber: { type: 'String' },
    readerId: { type: 'String' },
    cardType: { type: 'String' },
    pan: { type: 'String' },
    expiry: { type: 'long' },
    pin: { type: 'String' },
    name: { type: 'String' },
    cvv: { type: 'String' },
    accountType: { type: 'String' },
    amount: { type: 'String' },
    transactionType: { type: 'String' },
    raw: { type: 'String' },
    uf1: { type: 'String' },
    uf2: { type: 'String' },
    uf3: { type: 'String' },
    uf4: { type: 'String' },
    uf5: { type: 'String' },
    transactionState: { type: 'String' },
    transactionStatus: { type: 'String' },
  },
} as const;

const TransactionResponse = {
  type: 'object',
  properties: {
    transactionResponseId: { type: 'long' },

    customerdetails: { type: 'long' },
    billdetails: { type: 'long' },
    shipdetails: { type: 'long' },
    carddetails: { type: 'long' },
    bankdetails: { type: 'long' },
    paymentdetails: { type: 'long' },
    transactiondetails: { type: 'long' },
    buttondetails: { type: 'long' },
  },
} as const;

const Processor = {
  type: 'object',
  properties: {
    paymentGatewayId: { type: 'long' },

    name: { type: 'String' },
    gatewayType: { type: 'String' },
    Description: { type: 'String' },
    userName: { type: 'String' },
    password: { type: 'String' },
    param1: { type: 'String' },
    param2: { type: 'String' },
    param3: { type: 'String' },
    param4: { type: 'String' },
    status: { type: 'String' },
    displayPosition: { type: 'long' },
  },
} as const;

const PaymentGateway = {
  type: 'object',
  properties: {
    paymentGatewayId: { type: 'long' },

    name: { type: 'String' },
    gatewayType: { type: 'String' },
    Description: { type: 'String' },
    userName: { type: 'String' },
    password: { type: 'String' },
    param1: { type: 'String' },
    param2: { type: 'String' },
    param3: { type: 'String' },
    param4: { type: 'String' },
    status: { type: 'String' },
    displayPosition: { type: 'long' },
  },
} as const;

const PaymentItem = {
  type: 'object',
  properties: {
    paymentItemId: { type: 'long' },

    orderNumber: { type: 'String' },
    gateway: { type: 'String' },
    amount: { type: 'double' },
    tnxref: { type: 'String' },
    remarks: { type: 'String' },
    status: { type: 'String' },
  },
} as const;

const BlockPayment = {
  type: 'object',
  properties: {
    merchantId: { type: 'long' },
  },
} as const;

const Fee = {
  type: 'object',
  properties: {
    feeId: { type: 'long' },

    orderNumber: { type: 'String' },
    gateway: { type: 'String' },
    amount: { type: 'double' },
    tnxref: { type: 'String' },
    remarks: { type: 'String' },
    status: { type: 'String' },
  },
} as const;

const FeeItem = {
  type: 'object',
  properties: {
    feeItemId: { type: 'long' },

    orderNumber: { type: 'String' },
    gateway: { type: 'String' },
    amount: { type: 'double' },
    tnxref: { type: 'String' },
    remarks: { type: 'String' },
    status: { type: 'String' },
  },
} as const;

const Currency = {
  type: 'object',
  properties: {
    currencyId: { type: 'long' },

    currencyCode: { type: 'String' },
    currencySymbol: { type: 'String' },
    description: { type: 'String' },
    currencyRate: { type: 'double' },
    decimalFormat: { type: 'String' },
    dollarValue: { type: 'double' },
    status: { type: 'String' },
  },
} as const;

const Beneficiary = {
  type: 'object',
  properties: {
    myContactId: { type: 'long' },

    myCountryId: { type: 'long' },
    myGroupId: { type: 'long' },
    state: { type: 'String' },
    title: { type: 'String' },
    postCode: { type: 'String' },
    email: { type: 'String' },
    website: { type: 'String' },
    firstName: { type: 'String' },
    lastName: { type: 'String' },
    otherNames: { type: 'String' },
    company: { type: 'String' },
    gender: { type: 'String' },
    dateOfBirth: { type: 'Date' },
    contactType: { type: 'String' },
    phone: { type: 'String' },
    status: { type: 'String' },
  },
} as const;

const Button = {
  type: 'object',
  properties: {
    buttonId: { type: 'long' },

    username: { type: 'long' },
    password: { type: 'long' },
    signature: { type: 'long' },
    amount: { type: 'long' },
    ack: { type: 'long' },
    correlationId: { type: 'long' },
    currency: { type: 'long' },
    returnUrl: { type: 'long' },
    buttonType: { type: 'long' },
    test: { type: 'long' },
    cancelUrl: { type: 'long' },
    token: { type: 'long' },
    cmd: { type: 'long' },
    METHOD: { type: 'long' },
    BUTTONCODE: { type: 'long' },
    BUTTONIMAGE: { type: 'long' },
    BUTTONIMAGEURL: { type: 'long' },
    BUYNOWTEXT: { type: 'long' },
    SUBSCRIBETEXT: { type: 'long' },
  },
} as const;

const ButtonItem = {
  type: 'object',
  properties: {
    buttonItemId: { type: 'long' },

    buttonId: { type: 'long' },
    buttonNumber: { type: 'long' },
    username: { type: 'long' },
    password: { type: 'long' },
    signature: { type: 'long' },
    amount: { type: 'long' },
    ack: { type: 'long' },
    correlationId: { type: 'long' },
    currency: { type: 'long' },
    returnUrl: { type: 'long' },
    buttonType: { type: 'long' },
    cancelUrl: { type: 'long' },
    token: { type: 'long' },
    cmd: { type: 'long' },
    build: { type: 'long' },
    version: { type: 'long' },
    timestamp: { type: 'long' },
  },
} as const;

const Workspace = {
  type: 'object',
  properties: {
    workspaceId: { type: 'long' },

    name: { type: 'String' },
    description: { type: 'String' },
    style: { type: 'String' },
    position: { type: 'String' },
  },
} as const;

const WorkspaceItem = {
  type: 'object',
  properties: {
    itemId: { type: 'long' },

    workspaceId: { type: 'long' },
    name: { type: 'String' },
    description: { type: 'String' },
    type: { type: 'String' },
    data: { type: 'String' },
    style: { type: 'String' },
  },
} as const;

const MyEvent = {
  type: 'object',
  properties: {
    myEventId: { type: 'long' },
    ownerType: { type: 'String' },
    ownerId: { type: 'long' },
    eventName: { type: 'String' },
    eventType: { type: 'String' },
    startTime: { type: 'Date' },
    endTime: { type: 'Date' },
    eventStatus: { type: 'String' },
    description: { type: 'String' },
    remarks: { type: 'String' },
  },
} as const;
