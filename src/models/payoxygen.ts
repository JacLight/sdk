export const Bank = {
    type: 'object',
    properties: {
        bankId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

        name: { type: 'String' },
        code: { type: 'String' },
        iban: { type: 'String' },
        swiftcode: { type: 'String' },
        country: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const BankAccount = {
    type: 'object',
    properties: {
        accountId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

export const Wallet = {
    type: 'object',
    properties: {
        walletId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

export const Biller = {
    type: 'object',
    properties: {
        billderId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

export const BillerItem = {
    type: 'object',
    properties: {
        billderItemId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

export const Merchant = {
    type: 'object',
    properties: {
        merchantId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

        number: { type: 'String' },
        name: { type: 'String' },
        description: { type: 'String' },
        status: { type: 'String' },
        state: { type: 'String' },
        balanceAvailable: { type: 'double' },
        balanceCurrent: { type: 'double' },
    },
} as const;

export const MerchantBrand = {
    type: 'object',
    properties: {
        merchantId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },
    },
} as const;

export const MerchantBiller = {
    type: 'object',
    properties: {
        myContactId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

export const MerchantUser = {
    type: 'object',
    properties: {
        mercehantUserId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },
    },
} as const;

export const Card = {
    type: 'object',
    properties: {
        cardId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

export const CardAllowed = {
    type: 'object',
    properties: {
        cardId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

export const CardReader = {
    type: 'object',
    properties: {
        readerId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

        serial: { type: 'String' },
        key: { type: 'String' },
        threshold: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const CardReaderAllowed = {
    type: 'object',
    properties: {
        readerId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

        serial: { type: 'String' },
        key: { type: 'String' },
        threshold: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const CardReaderLog = {
    type: 'object',
    properties: {
        logId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

export const Pos = {
    type: 'object',
    properties: {
        posId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

export const PosAllowed = {
    type: 'object',
    properties: {
        posId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

export const PosLog = {
    type: 'object',
    properties: {
        logId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

export const Transaction = {
    type: 'object',
    properties: {
        transactionId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

        transactionNumber: { type: 'long' },
    },
} as const;

export const TransactionItem = {
    type: 'object',
    properties: {
        transactionItemId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

        transactionId: { type: 'long' },
        transactionItemNumber: { type: 'long' },
        transaction: { type: 'long' },
        message: { type: 'long' },
        code: { type: 'long' },
        text: { type: 'long' },
        refTransID: { type: 'long' },
        splitTenderId: { type: 'long' },
        submitTimeUTC: { type: 'long' },
        submitTimeLocal: { type: 'long' },
        transactionType: { type: 'long' },
        transactionStatus: { type: 'long' },
        responseCode: { type: 'long' },
        responseReasonCode: { type: 'long' },
        responseReasonDescription: { type: 'long' },
        AVSResponse: { type: 'long' },
        cardCodeResponse: { type: 'long' },
        CAVVResponse: { type: 'long' },
        FDSFilterAction: { type: 'long' },
        FDSFilters: { type: 'long' },
        batch: { type: 'long' },
        order: { type: 'long' },
        invoiceNumber: { type: 'long' },
        description: { type: 'long' },
        purchaseOrderNumber: { type: 'long' },
        requestedAmount: { type: 'long' },
        authAmount: { type: 'long' },
        settleAmount: { type: 'long' },
        tax: { type: 'long' },
        shipping: { type: 'long' },
        duty: { type: 'long' },
        creditCard: { type: 'long' },
        cardNumber: { type: 'long' },
        cardType: { type: 'long' },
        bankAccount: { type: 'long' },
        routingNumber: { type: 'long' },
        accountNumber: { type: 'long' },
        nameOnAccount: { type: 'long' },
        echeckType: { type: 'long' },
        customer: { type: 'long' },
        billTo: { type: 'long' },
        shipTo: { type: 'long' },
        recurringBilling: { type: 'long' },
        customerIP: { type: 'long' },
        merchant: { type: 'long' },
        issuer: { type: 'long' },
    },
} as const;

export const TransactionResponse = {
    type: 'object',
    properties: {
        transactionResponseId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

export const Processor = {
    type: 'object',
    properties: {
        paymentGatewayId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

export const PaymentGateway = {
    type: 'object',
    properties: {
        paymentGatewayId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

export const PaymentItem = {
    type: 'object',
    properties: {
        paymentItemId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

        orderNumber: { type: 'String' },
        gateway: { type: 'String' },
        amount: { type: 'double' },
        tnxref: { type: 'String' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const BlockPayment = {
    type: 'object',
    properties: {
        merchantId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },
    },
} as const;

export const Fee = {
    type: 'object',
    properties: {
        feeId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

        orderNumber: { type: 'String' },
        gateway: { type: 'String' },
        amount: { type: 'double' },
        tnxref: { type: 'String' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const FeeItem = {
    type: 'object',
    properties: {
        feeItemId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

        orderNumber: { type: 'String' },
        gateway: { type: 'String' },
        amount: { type: 'double' },
        tnxref: { type: 'String' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const Currency = {
    type: 'object',
    properties: {
        currencyId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

        currencyCode: { type: 'String' },
        currencySymbol: { type: 'String' },
        description: { type: 'String' },
        currencyRate: { type: 'double' },
        decimalFormat: { type: 'String' },
        dollarValue: { type: 'double' },
        status: { type: 'String' },
    },
} as const;

export const Beneficiary = {
    type: 'object',
    properties: {
        myContactId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

export const Voucher = {
    type: 'object',
    properties: {
        voucherId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

        serial: { type: 'String' },
        code: { type: 'String' },
        smsCredit: { type: 'long' },
        batch: { type: 'String' },
        agent: { type: 'String' },
        boughtBy: { type: 'long' },
        boughtDate: { type: 'Date' },
        usedBy: { type: 'long' },
        usedDate: { type: 'Date' },
        voucherStatus: { type: 'String' },
        voucherType: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const Button = {
    type: 'object',
    properties: {
        buttonId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

export const ButtonItem = {
    type: 'object',
    properties: {
        buttonItemId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

export const Workspace = {
    type: 'object',
    properties: {
        workspaceId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

        name: { type: 'String' },
        description: { type: 'String' },
        style: { type: 'String' },
        position: { type: 'String' },
    },
} as const;

export const WorkspaceItem = {
    type: 'object',
    properties: {
        itemId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

        workspaceId: { type: 'long' },
        name: { type: 'String' },
        description: { type: 'String' },
        type: { type: 'String' },
        data: { type: 'String' },
        style: { type: 'String' },
    },
} as const;

export const Comment = {
    type: 'object',
    properties: {
        commentId: { type: 'long' },

        companyId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        groupId: { type: 'long' },
        remoteAppId: { type: 'long' },

        messageType: { type: 'String' },
        ownerType: { type: 'String' },
        ownerId: { type: 'long' },
        title: { type: 'String' },
        content: { type: 'String' },
    },
} as const;


export const MyEvent = {
    type: 'object',
    properties: {
        myEventId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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
