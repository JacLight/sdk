export const StoreSubscription = {
    type: 'object',
    properties: {
        subscriptionId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

export const Seo = {
    type: 'object',
    properties: {
        seoId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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
    }
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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

        name: { type: 'String' },
        rate: { type: 'double' },
        status: { type: 'String' },
    },
} as const;

export const TaxRule = {
    type: 'object',
    properties: {
        taxRuleId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

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

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

        name: { type: 'String' },
        encodig: { type: 'String' },
        pattern: { type: 'String' },
        sequence: { type: 'String' },
        write: { type: 'String' },
        type: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const NotificationTemplate = {
    type: 'object',
    properties: {
        templateId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

        fromName: { type: 'String' },
        fromAddress: { type: 'String' },
        cc: { type: 'String' },
        bcc: { type: 'String' },
        title: { type: 'String' },
        body: { type: 'String' },
        bodyHtml: { type: 'String' },
        status: { type: 'String' },
        notificationType: { type: 'String' },
        notificationDestination: { type: 'String' },
    },
} as const;

export const NotificationLog = {
    type: 'object',
    properties: {
        logId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

        itemId: { type: 'long' },
        templateId: { type: 'long' },
        notificationType: { type: 'String' },
        notificationDestination: { type: 'String' },
        fromName: { type: 'String' },
        fromAddress: { type: 'String' },
        toAddress: { type: 'String' },
        toName: { type: 'String' },
        cc: { type: 'String' },
        bcc: { type: 'String' },
        title: { type: 'String' },
        body: { type: 'String' },
        bodyHtml: { type: 'String' },
        attachFile: { type: 'String' },
        firstTry: { type: 'Date' },
        lastTry: { type: 'Date' },
        nextTry: { type: 'Date' },
        tryCount: { type: 'Long' },
        status: { type: 'String' },
        state: { type: 'String' },
        uniqueId: { type: 'String' },
        delivered: { type: 'boolean' },
        bounced: { type: 'boolean' },
        bounceType: { type: 'String' },
        clicked: { type: 'boolean' },
        client: { type: 'String' },
        opened: { type: 'boolean' },
        share: { type: 'boolean' },
        spam: { type: 'boolean' },
        remarks: { type: 'String' },
    },
} as const;
