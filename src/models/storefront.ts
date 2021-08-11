export const StoreSubscription = {
    type: 'object',
    properties: {
        subscriptionId: { type: 'long' },

        name: { type: 'String' },
        description: { type: 'String' },
        startDate: { type: 'Date' },
        expiry: { type: 'Date' },

        subscriptionTemplateId: { type: 'long' },
        productId: { type: 'long' },
        autorenew: { type: 'boolean' },

        renewalNotificationId: { type: 'String' },
        welcomeNotificationId: { type: 'String' },
        expiryNotificationId: { type: 'String' },
        upgradeNotificationId: { type: 'String' },
        goodbyeNotificationId: { type: 'String' },

        period: { type: 'int' },
        periodType: { type: 'String' },

        expiryNotificationPeriod: { type: 'int' },
        expiryNotificationPeriodType: { type: 'String' },
        expiryNotificationRepeat: { type: 'boolean' },
        expiryNotificationRepeatFrequency: { type: 'int' },
        expiryNotificationRepeatUntil: { type: 'int' },

        status: { type: 'String' },
    },
} as const;

export const StoreSubscriptionRenewal = {
    type: 'object',
    properties: {
        renewalId: { type: 'long' },

        subscriptionId: { type: 'long' },
        orderItemId: { type: 'long' },
        oldExpiry: { type: 'Date' },
        newExpiry: { type: 'Date' },
        status: { type: 'String' },
    },
} as const;

export const StoreAttribute = {
    type: 'object',
    properties: {
        attributeId: { type: 'long' },

        itemId: { type: 'long' },
        name: { type: 'String' },
        value: { type: 'String' },
        description: { type: 'String' },
        attributeType: { type: 'String' },
        status: { type: 'String' },
        useInFilter: { type: 'boolean' },
    },
} as const;

export const StoreAttributeOption = {
    type: 'object',
    properties: {
        optionId: { type: 'long' },

        attributeId: { type: 'long' },
        itemId: { type: 'long' },
        value: { type: 'String' },
        status: { type: 'String' },
        type: { type: 'String' },
    },
} as const;

export const StorePaymentGateway = {
    type: 'object',
    properties: {
        paymentGatewayId: { type: 'long' },

        name: { type: 'String' },
        gatewayType: { type: 'String' },
        description: { type: 'String' },
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

export const StorePaymentItem = {
    type: 'object',
    properties: {
        paymentItemId: { type: 'long' },

        orderNumber: { type: 'String' },
        paymentGatewayId: { type: 'long' },
        amount: { type: 'double' },
        currency: { type: 'String' },
        tnxref: { type: 'String' },
        uniqueId: { type: 'String' },
        remarks: { type: 'String' },
        status: { type: 'String' },
        sessionId: { type: 'String' },
        requestIp: { type: 'String' },
        requestDump: { type: 'String' },
    },
} as const;

export const StoreInvoice = {
    type: 'object',
    properties: {
        invoiceId: { type: 'long' },

        customerId: { type: 'long' },
        number: { type: 'String' },
        currency: { type: 'String' },
        preparedBy: { type: 'long' },
        approvedBy: { type: 'long' },
        discountType: { type: 'String' },
        discount: { type: 'double' },
        vat: { type: 'double' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const StoreInvoiceItem = {
    type: 'object',
    properties: {
        invoiceItemId: { type: 'long' },

        companyId: { type: 'long' },

        invoiceId: { type: 'long' },
        itemid: { type: 'long' },
        sku: { type: 'String' },
        name: { type: 'String' },
        description: { type: 'String' },
        options: { type: 'String' },
        discountType: { type: 'String' },
        discount: { type: 'double' },
        quantity: { type: 'int' },
        price: { type: 'double' },
        discountedPrice: { type: 'int' },
        vat: { type: 'double' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const StorePurchase = {
    type: 'object',
    properties: {
        purchaseId: { type: 'long' },

        supplierId: { type: 'long' },
        currency: { type: 'String' },
        preparedBy: { type: 'long' },
        approvedBy: { type: 'long' },
        discountType: { type: 'String' },
        discount: { type: 'double' },
        vat: { type: 'double' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const StorePurchaseItem = {
    type: 'object',
    properties: {
        purchaseItemId: { type: 'long' },

        companyId: { type: 'long' },

        purchaseId: { type: 'long' },
        itemid: { type: 'long' },
        sku: { type: 'String' },
        brandId: { type: 'String' },
        modelId: { type: 'String' },
        name: { type: 'String' },
        description: { type: 'String' },
        options: { type: 'String' },
        discountType: { type: 'String' },
        discount: { type: 'double' },
        quantity: { type: 'int' },
        price: { type: 'double' },
        discountedPrice: { type: 'int' },
        vat: { type: 'double' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const StoreDelivery = {
    type: 'object',
    properties: {
        deliveryId: { type: 'long' },

        purchaseId: { type: 'long' },
        supplierId: { type: 'long' },
        receivedBy: { type: 'long' },
        checkedBy: { type: 'long' },
        itemCount: { type: 'String' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const StoreDeliveryItem = {
    type: 'object',
    properties: {
        deliveryItemId: { type: 'long' },

        companyId: { type: 'long' },

        deliveryId: { type: 'long' },
        purchaseItemId: { type: 'long' },
        itemId: { type: 'long' },
        sku: { type: 'String' },
        brandId: { type: 'String' },
        brandItemId: { type: 'String' },
        name: { type: 'String' },
        description: { type: 'String' },
        options: { type: 'String' },
        quantityReceived: { type: 'int' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const StoreCurrency = {
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

export const Seo = {
    type: 'object',
    properties: {
        seoId: { type: 'long' },

        ownerId: { type: 'long' },
        ownerType: { type: 'String' },
        metaTitle: { type: 'String' },
        metaDescription: { type: 'String' },
        friendlyURL: { type: 'String' },
        metaKeywords: { type: 'String' },
    },
} as const;

export const StoreCategory = {
    type: 'object',
    properties: {
        categoryId: { type: 'long' },

        companyId: { type: 'long' },

        showInMenu: { type: 'boolean' },
        showInList: { type: 'boolean' },
        articleId: { type: 'String' },
    },
} as const;

export const StoreItem = {
    type: 'object',
    properties: {
        itemId: { type: 'long' },

        companyId: { type: 'long' },

        itemType: { type: 'String' },
        bundleItemSkus: { type: 'String' },
        subscriptionTemplateId: { type: 'long' },
        payCircle: { type: 'String' },
        location: { type: 'String' },
        viewCount: { type: 'long' },
        dataFormId: { type: 'long' },
        brandId: { type: 'long' },
        articleId: { type: 'String' },
        brandItemId: { type: 'long' },
        currency: { type: 'String' },
        model: { type: 'String' },
        sku: { type: 'String' },
        upc: { type: 'String' },
        ean: { type: 'String' },
        jan: { type: 'String' },
        isbn: { type: 'String' },
        mpn: { type: 'String' },
        quantity: { type: 'String' },
        stock_status_id: { type: 'String' },
        image: { type: 'String' },
        manufacturer_id: { type: 'String' },
        shipping: { type: 'String' },
        price: { type: 'String' },
        points: { type: 'String' },
        tax_class_id: { type: 'String' },
        date_available: { type: 'String' },
        weight: { type: 'String' },
        weight_class_id: { type: 'String' },
        length: { type: 'String' },
        width: { type: 'String' },
        height: { type: 'String' },
        length_class_id: { type: 'String' },
        subtract: { type: 'String' },
        minimum: { type: 'String' },
        sort_order: { type: 'String' },
        status: { type: 'String' },
        viewed: { type: 'String' },
    },
} as const;

export const StoreOrder = {
    type: 'object',
    properties: {
        orderId: { type: 'long' },

        companyId: { type: 'long' },

        number: { type: 'String' },
        currency: { type: 'String' },
        order_id: { type: 'String' },
        invoice_no: { type: 'String' },
        invoice_prefix: { type: 'String' },
        store_id: { type: 'String' },
        store_name: { type: 'String' },
        store_url: { type: 'String' },
        customer_id: { type: 'String' },
        customer_group_id: { type: 'String' },
        firstname: { type: 'String' },
        lastname: { type: 'String' },
        email: { type: 'String' },
        telephone: { type: 'String' },
        fax: { type: 'String' },
        custom_field: { type: 'String' },
        payment_firstname: { type: 'String' },
        payment_lastname: { type: 'String' },
        payment_company: { type: 'String' },
        payment_address_1: { type: 'String' },
        payment_address_2: { type: 'String' },
        payment_city: { type: 'String' },
        payment_postcode: { type: 'String' },
        payment_country: { type: 'String' },
        payment_country_id: { type: 'String' },
        payment_zone: { type: 'String' },
        payment_zone_id: { type: 'String' },
        payment_address_format: { type: 'String' },
        payment_custom_field: { type: 'String' },
        payment_method: { type: 'String' },
        payment_code: { type: 'String' },
        shipping_firstname: { type: 'String' },
        shipping_lastname: { type: 'String' },
        shipping_company: { type: 'String' },
        shipping_address_1: { type: 'String' },
        shipping_address_2: { type: 'String' },
        shipping_city: { type: 'String' },
        shipping_postcode: { type: 'String' },
        shipping_country: { type: 'String' },
        shipping_country_id: { type: 'String' },
        shipping_zone: { type: 'String' },
        shipping_zone_id: { type: 'String' },
        shipping_address_format: { type: 'String' },
        shipping_custom_field: { type: 'String' },
        shipping_method: { type: 'String' },
        shipping_code: { type: 'String' },
        comment: { type: 'String' },
        total: { type: 'String' },
        order_status_id: { type: 'String' },
        affiliate_id: { type: 'String' },
        commission: { type: 'String' },
        marketing_id: { type: 'String' },
        tracking: { type: 'String' },
        language_id: { type: 'String' },
        currency_id: { type: 'String' },
        currency_code: { type: 'String' },
        currency_value: { type: 'String' },
        ip: { type: 'String' },
        forwarded_ip: { type: 'String' },
        user_agent: { type: 'String' },
        accept_language: { type: 'String' },
    },
} as const;

export const StoreOrderItem = {
    type: 'object',
    properties: {
        orderItemId: { type: 'long' },
        companyId: { type: 'long' },
        subscriptionId: { type: 'long' },
        serial: { type: 'String' },
        order_product_id: { type: 'String' },
        order_id: { type: 'String' },
        product_id: { type: 'String' },
        name: { type: 'String' },
        model: { type: 'String' },
        quantity: { type: 'String' },
        price: { type: 'String' },
        total: { type: 'String' },
        tax: { type: 'String' },
        reward: { type: 'String' },
    },
} as const;

export const StoreOrderOption = {
    type: 'object',
    properties: {
        orderItemId: { type: 'long' },
        companyId: { type: 'long' },
        subscriptionId: { type: 'long' },
        order_option_id: { type: 'String' },
        order_id: { type: 'String' },
        order_product_id: { type: 'String' },
        product_option_id: { type: 'String' },
        product_option_value_id: { type: 'String' },
        name: { type: 'String' },
        value: { type: 'String' },
        type: { type: 'String' },
    },
} as const;

export const Voucher = {
    type: 'object',
    properties: {
        voucherId: { type: 'long' },

        serial: { type: 'String' },
        code: { type: 'String' },
        amount: { type: 'double' },
        amountused: { type: 'double' },
        batch: { type: 'String' },
        agent: { type: 'String' },
        boughtBy: { type: 'long' },
        boughtDate: { type: 'Date' },
        usedBy: { type: 'long' },
        usedDate: { type: 'Date' },
        voucherStatus: { type: 'String' },
        voucherType: { type: 'String' },
        limitCategories: { type: 'String' },
        limitSkus: { type: 'String' },
        limitUsers: { type: 'String' },
        limitUse: { type: 'int' },
        startDate: { type: 'Date' },
        endDate: { type: 'Date' },
        useCount: { type: 'int' },
        status: { type: 'String' },
    },
} as const;

export const MyCoupon = {
    type: 'object',
    properties: {
        myCouponId: { type: 'long' },

        limitUsers: { type: 'String' },
        limitUse: { type: 'int' },
        useCount: { type: 'int' },
        usedByUsers: { type: 'String' },
    },
} as const;

export const DeliverySlip = {
    type: 'object',
    properties: {
        deliverySlipId: { type: 'long' },

        orderId: { type: 'long' },
        orderItemId: { type: 'long' },
        shipDate: { type: 'String' },
        deliverBy: { type: 'String' },
        deliverDate: { type: 'String' },
        status: { type: 'String' },
        remark: { type: 'String' },
    },
} as const;

export const CreditSlip = {
    type: 'object',
    properties: {
        creditSlipId: { type: 'long' },

        orderId: { type: 'long' },
        orderItemId: { type: 'long' },
        voucherId: { type: 'long' },
        status: { type: 'String' },
        remark: { type: 'String' },
    },
} as const;

export const StoreReturn = {
    type: 'object',
    properties: {
        returnId: { type: 'long' },

        orderId: { type: 'long' },
        orderItemId: { type: 'long' },
        voucherId: { type: 'long' },
        status: { type: 'String' },
        remark: { type: 'String' },
    },
} as const;

export const WishList = {
    type: 'object',
    properties: {
        wishListId: { type: 'long' },

        name: { type: 'String' },
        description: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const WishListItem = {
    type: 'object',
    properties: {
        wishListItemId: { type: 'long' },

        companyId: { type: 'long' },
        createDate: { type: 'Date' },

        wishListId: { type: 'long' },
        itemId: { type: 'long' },
        itemType: { type: 'String' },
        itemAttribute: { type: 'String' },
        quantity: { type: 'int' },
        price: { type: 'double' },
        status: { type: 'String' },
    },
} as const;

export const Tax = {
    type: 'object',
    properties: {
        taxId: { type: 'long' },

        name: { type: 'String' },
        rate: { type: 'double' },
        status: { type: 'String' },
    },
} as const;

export const TaxRule = {
    type: 'object',
    properties: {
        taxRuleId: { type: 'long' },

        taxId: { type: 'long' },
        rate: { type: 'double' },
        state: { type: 'String' },
        country: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const SupplierOrder = {
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

export const SupplierOrderItem = {
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

export const Brand = {
    type: 'object',
    properties: {
        brandId: { type: 'long' },

        name: { type: 'String' },
        description: { type: 'String' },
        rating: { type: 'String' },
        imageURL: { type: 'String' },
        isSupplier: { type: 'boolean' },
        status: { type: 'String' },
    },
} as const;

export const BrandItem = {
    type: 'object',
    properties: {
        brandItemId: { type: 'long' },

        brandId: { type: 'long' },
        name: { type: 'String' },
        description: { type: 'String' },
        imageURL: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const Stock = {
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

export const StockMovement = {
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

export const StockTransfer = {
    type: 'object',
    properties: {
        stockTransferId: { type: 'long' },

        stockId: { type: 'long' },
        fromId: { type: 'long' },
        toId: { type: 'long' },
        quantity: { type: 'int' },
        date: { type: 'String' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const StockReturn = {
    type: 'object',
    properties: {
        stockReturnId: { type: 'long' },

        orderItemId: { type: 'long' },
        warehouseId: { type: 'long' },
        itemId: { type: 'long' },
        refundId: { type: 'long' },
        receivedDate: { type: 'Date' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const Shipping = {
    type: 'object',
    properties: {
        shipingId: { type: 'long' },

        stockMovementId: { type: 'String' },
        orderItemId: { type: 'String' },
        shipAddressId: { type: 'long' },
        quantity: { type: 'String' },
        prepairedBy: { type: 'long' },
        date: { type: 'String' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const Warehouse = {
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

export const WarehouseItem = {
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

export const PointOfSale = {
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

export const PointOfSaleSession = {
    type: 'object',
    properties: {
        sessionId: { type: 'long' },

        posId: { type: 'String' },
        startDate: { type: 'String' },
        endTime: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const BarcodeReader = {
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

export const Printer = {
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

export const CashBox = {
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

export const Bank = {
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

export const BankAccount = {
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

export const Wallet = {
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

export const Biller = {
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

export const BillerItem = {
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

export const Merchant = {
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

export const MerchantBrand = {
    type: 'object',
    properties: {
        merchantId: { type: 'long' },
    },
} as const;

export const MerchantBiller = {
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

export const MerchantUser = {
    type: 'object',
    properties: {
        mercehantUserId: { type: 'long' },
    },
} as const;

export const Card = {
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

export const CardAllowed = {
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

export const CardReader = {
    type: 'object',
    properties: {
        readerId: { type: 'long' },

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

        transactionNumber: { type: 'long' },
    },
} as const;

export const TransactionItem = {
    type: 'object',
    properties: {
        transactionItemId: { type: 'long' },

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
    },
} as const;

export const Fee = {
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

export const FeeItem = {
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

export const Currency = {
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

export const Beneficiary = {
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


export const Button = {
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

export const ButtonItem = {
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

export const Workspace = {
    type: 'object',
    properties: {
        workspaceId: { type: 'long' },

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

        workspaceId: { type: 'long' },
        name: { type: 'String' },
        description: { type: 'String' },
        type: { type: 'String' },
        data: { type: 'String' },
        style: { type: 'String' },
    },
} as const;

export const MyEvent = {
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
