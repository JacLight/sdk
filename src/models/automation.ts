
export const MyCriteria = {
    type: 'object',
    properties: {
        criteriaId: { type: 'long' },

        companyId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        groupId: { type: 'long' },
        remoteAppId: { type: 'long' },

        ownerId: { type: 'long' },
        ownerType: { type: 'String' },
        sourceColumn: { type: 'String' },
        targetTable: { type: 'String' },
        targetColumn: { type: 'String' },
        value: { type: 'String' },
        valueType: { type: 'String' },
        condition: { type: 'String' },
        priority: { type: 'long' },
        status: { type: 'String' },
    },
} as const;


export const Trigger = {
    type: 'object',
    properties: {
        triggerId: { type: 'long' },



        ownerType: { type: 'String' },
        ownerId: { type: 'long' },
        name: { type: 'String' },
        active: { type: 'boolean' },
        description: { type: 'String' },
        runAction: { type: 'String' },
        runTrigger: { type: 'String' },
        checkCondition: { type: 'String' },
        startDate: { type: 'Date' },
        endDate: { type: 'Date' },
        runTime: { type: 'Date' },
        lastRunTime: { type: 'Date' },
        status: { type: 'String' },
        remarks: { type: 'String' },
    },
} as const;

export const TriggerEvent = {
    type: 'object',
    properties: {
        triggerEventId: { type: 'long' },



        ownerType: { type: 'String' },
        ownerId: { type: 'long' },
        eventName: { type: 'String' },
        eventType: { type: 'String' },
        runTime: { type: 'Date' },
        startTime: { type: 'Date' },
        endTime: { type: 'Date' },
        eventStatus: { type: 'String' },
        description: { type: 'String' },
        remarks: { type: 'String' },
    },
} as const;



export const Alert = {
    type: 'object',
    properties: {
        alertId: { type: 'long' },



        name: { type: 'String' },
        description: { type: 'String' },
        topic: { type: 'String' },
        sourceType: { type: 'String' },
        messageType: { type: 'String' },
        templateId: { type: 'long' },
        status: { type: 'String' },
    },
} as const;

export const AlertQueue = {
    type: 'object',
    properties: {
        alertQueueId: { type: 'long' },



        alertId: { type: 'long' },
        uniqueId: { type: 'String' },
        template: { type: 'String' },
        accountNo: { type: 'String' },
        accountName: { type: 'String' },
        customerName: { type: 'String' },
        accountType: { type: 'String' },
        accountGroup: { type: 'String' },
        address: { type: 'String' },
        email: { type: 'String' },
        phone: { type: 'String' },
        message: { type: 'String' },

        transactionType: { type: 'String' },
        transRef: { type: 'String' },
        amount: { type: 'String' },
        currency: { type: 'String' },
        narrative: { type: 'String' },
        originatingBranch: { type: 'String' },
        receiptNo: { type: 'String' },
        actionType: { type: 'String' },
        availableBalance: { type: 'String' },
        clearedBalance: { type: 'String' },
        unclearedBalance: { type: 'String' },
        interestRate: { type: 'String' },
        bookDate: { type: 'String' },
        valueDate: { type: 'String' },
        tranDate: { type: 'String' },
        createTime: { type: 'String' },

        fixedDepositType: { type: 'String' },
        depositDmount: { type: 'String' },
        maturityAmount: { type: 'String' },
        tenor: { type: 'String' },
        placementDate: { type: 'String' },
        maturityDate: { type: 'String' },
        ldNumber: { type: 'String' },

        branchCode: { type: 'String' },
        branch: { type: 'String' },
        region: { type: 'String' },

        staffId: { type: 'String' },
        costCode: { type: 'String' },
        costCodeDesc: { type: 'String' },

        free1: { type: 'String' },
        free2: { type: 'String' },
        free3: { type: 'String' },
        free4: { type: 'String' },
        free5: { type: 'String' },
        free6: { type: 'String' },
        free7: { type: 'String' },
        free8: { type: 'String' },
        free9: { type: 'String' },
        free10: { type: 'String' },

        tryCount: { type: 'String' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const ActionCommand = {
    type: 'object',
    properties: {
        actionCommandId: { type: 'long' },



        name: { type: 'String' },
        description: { type: 'String' },
        keyword: { type: 'String' },
        action: { type: 'String' },
        alertId: { type: 'long' },
        status: { type: 'String' },
    },
} as const;

export const ActionCommandLog = {
    type: 'object',
    properties: {
        actionCommandLogId: { type: 'long' },



        keyword: { type: 'String' },
        source: { type: 'String' },
        message: { type: 'String' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;


export const NotificationTemplate = {
    type: 'object',
    properties: {
        notificationTemplateId: { type: 'long' },



        ownerType: { type: 'String' },
        ownerId: { type: 'long' },
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
        notificationLogId: { type: 'long' },



        notificationTemplateId: { type: 'long' },
        notificationType: { type: 'String' },
        ownerType: { type: 'String' },
        ownerId: { type: 'long' },
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

export const MySchedule = {
    type: 'object',
    properties: {
        myScheduleId: { type: 'long' },



        ownerType: { type: 'String' },
        ownerId: { type: 'long' },
        startDate: { type: 'Date' },
        endDate: { type: 'Date' },
        repeat: { type: 'boolean' },
        sendTime: { type: 'Date' },
        lastRunTime: { type: 'Date' },
        repeatInterval: { type: 'String' },
        repeatClause: { type: 'String' },
        status: { type: 'String' },
        remarks: { type: 'String' },
    },
} as const;